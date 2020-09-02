import fetch from 'isomorphic-unfetch'
import { URL } from 'url'

// https://postgrest.org/en/stable/api.html?highlight=options#errors-and-http-status-codes
interface PostgrestError {
  message: string
  details: string
  hint: string
  code: string
}

// type PostgrestResponse<T> = T | T[] | PostgrestError

interface PostgrestResponse<T> extends Omit<Response, 'body'> {
  body: T | T[] | PostgrestError
}

/**
 * Base builder
 */

export abstract class PostgrestBuilder<T> implements PromiseLike<any> {
  method!: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE'
  url!: URL
  headers!: { [key: string]: string }
  schema?: string
  body?: Partial<T> | Partial<T>[]

  constructor(builder: PostgrestBuilder<T>) {
    Object.assign(this, builder)
  }

  then(onfulfilled?: any, onrejected?: any): Promise<any> {
    // https://postgrest.org/en/stable/api.html#switching-schemas
    if (typeof this.schema === 'undefined') {
      // skip
    } else if (['GET', 'HEAD'].includes(this.method)) {
      this.headers['Accept-Profile'] = this.schema
    } else {
      this.headers['Content-Profile'] = this.schema
    }
    if (this.method !== 'GET' && this.method !== 'HEAD') {
      this.headers['Content-Type'] = 'application/json'
    }

    return fetch(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
    })
      .then(async (res) => {
        // HACK: Coerce the type to PostgrestResponse<T>
        ;(res as any).body = await res.json()
        return (res as unknown) as PostgrestResponse<T>
      })
      .then(onfulfilled, onrejected)
  }
}

/**
 * CRUD
 */

export class PostgrestQueryBuilder<T> extends PostgrestBuilder<T> {
  constructor(
    url: string,
    { headers = {}, schema }: { headers?: { [key: string]: string }; schema?: string } = {}
  ) {
    super({} as PostgrestBuilder<T>)
    this.url = new URL(url)
    this.headers = headers
    this.schema = schema
  }

  select(columns = '*'): PostgrestFilterBuilder<T> {
    this.method = 'GET'
    // Remove whitespaces except when quoted
    let quoted = false
    const cleanedColumns = columns
      .split('')
      .map((c) => {
        if (/\s/.test(c) && !quoted) {
          return ''
        }
        if (c === '"') {
          quoted = !quoted
        }
        return c
      })
      .join('')
    this.url.searchParams.set('select', cleanedColumns)
    return new PostgrestFilterBuilder(this)
  }

  insert(body: Partial<T> | Partial<T>[], { upsert = false } = {}): PostgrestBuilder<T> {
    this.method = 'POST'
    this.headers['Prefer'] = upsert
      ? 'return=representation,resolution=merge-duplicates'
      : 'return=representation'
    this.body = body
    return this
  }

  update(body: Partial<T>): PostgrestFilterBuilder<T> {
    this.method = 'PATCH'
    this.headers['Prefer'] = 'return=representation'
    this.body = body
    return new PostgrestFilterBuilder(this)
  }

  delete(): PostgrestFilterBuilder<T> {
    this.method = 'DELETE'
    this.headers['Prefer'] = 'return=representation'
    return new PostgrestFilterBuilder(this)
  }

  /** @internal */
  rpc(params?: object): PostgrestBuilder<T> {
    this.method = 'POST'
    this.body = params
    return this
  }
}

/**
 * Post-filters (transforms)
 */

class PostgrestTransformBuilder<T> extends PostgrestBuilder<T> {
  order(
    column: keyof T,
    {
      ascending = true,
      nullsFirst = false,
      foreignTable,
    }: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string } = {}
  ): PostgrestTransformBuilder<T> {
    const key = typeof foreignTable === 'undefined' ? 'order' : `"${foreignTable}".order`
    this.url.searchParams.set(
      key,
      `"${column}".${ascending ? 'asc' : 'desc'}.${nullsFirst ? 'nullsfirst' : 'nullslast'}`
    )
    return this
  }

  limit(
    count: number,
    { foreignTable }: { foreignTable?: string } = {}
  ): PostgrestTransformBuilder<T> {
    const key = typeof foreignTable === 'undefined' ? 'limit' : `"${foreignTable}".limit`
    this.url.searchParams.set(key, `${count}`)
    return this
  }

  range(
    from: number,
    to: number,
    { foreignTable }: { foreignTable?: string } = {}
  ): PostgrestTransformBuilder<T> {
    const keyOffset = typeof foreignTable === 'undefined' ? 'offset' : `"${foreignTable}".offset`
    const keyLimit = typeof foreignTable === 'undefined' ? 'limit' : `"${foreignTable}".limit`
    this.url.searchParams.set(keyOffset, `${from}`)
    // Range is inclusive, so add 1
    this.url.searchParams.set(keyLimit, `${to - from + 1}`)
    return this
  }

  single(): PostgrestTransformBuilder<T> {
    this.headers['Accept'] = 'application/vnd.pgrst.object+json'
    return this
  }
}

/**
 * Filters
 */

const cleanFilterArray = <T>(filter: T[keyof T][]) => filter.map((s) => `"${s}"`).join(',')

type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is'
  | 'in'
  | 'cs'
  | 'cd'
  | 'sl'
  | 'sr'
  | 'nxl'
  | 'nxr'
  | 'adj'
  | 'ov'
  | 'fts'
  | 'plfts'
  | 'phfts'
  | 'wfts'

class PostgrestFilterBuilder<T> extends PostgrestTransformBuilder<T> {
  not(column: keyof T, operator: FilterOperator, filter: any): this {
    this.url.searchParams.append(`"${column}"`, `not.${operator}.${filter}`)
    return this
  }

  or(filters: string): this {
    this.url.searchParams.append('or', `(${filters})`)
    return this
  }

  eq(column: keyof T, value: T[keyof T]): this {
    this.url.searchParams.append(`"${column}"`, `eq.${value}`)
    return this
  }

  neq(column: keyof T, value: T[keyof T]): this {
    this.url.searchParams.append(`"${column}"`, `neq.${value}`)
    return this
  }

  gt(column: keyof T, value: T[keyof T]): this {
    this.url.searchParams.append(`"${column}"`, `gt.${value}`)
    return this
  }

  gte(column: keyof T, value: T[keyof T]): this {
    this.url.searchParams.append(`"${column}"`, `gte.${value}`)
    return this
  }

  lt(column: keyof T, value: T[keyof T]): this {
    this.url.searchParams.append(`"${column}"`, `lt.${value}`)
    return this
  }

  lte(column: keyof T, value: T[keyof T]): this {
    this.url.searchParams.append(`"${column}"`, `lte.${value}`)
    return this
  }

  like(column: keyof T, pattern: string): this {
    this.url.searchParams.append(`"${column}"`, `like.${pattern}`)
    return this
  }

  ilike(column: keyof T, pattern: string): this {
    this.url.searchParams.append(`"${column}"`, `ilike.${pattern}`)
    return this
  }

  is(column: keyof T, value: boolean | null): this {
    this.url.searchParams.append(`"${column}"`, `is.${value}`)
    return this
  }

  in(column: keyof T, values: T[keyof T][]): this {
    this.url.searchParams.append(`"${column}"`, `in.(${cleanFilterArray(values)})`)
    return this
  }

  cs(column: keyof T, filter: string | T[keyof T][] | object): this {
    if (typeof filter === 'string') {
      // range types can be inclusive '[', ']' or exclusive '(', ')' so just
      // keep it simple and accept a string
      this.url.searchParams.append(`"${column}"`, `cs.${filter}`)
    } else if (Array.isArray(filter)) {
      // array
      this.url.searchParams.append(`"${column}"`, `cs.{${cleanFilterArray(filter)}}`)
    } else {
      // json
      this.url.searchParams.append(`"${column}"`, `cs.${JSON.stringify(filter)}`)
    }
    return this
  }

  cd(column: keyof T, filter: string | T[keyof T][] | object): this {
    if (typeof filter === 'string') {
      // range
      this.url.searchParams.append(`"${column}"`, `cd.${filter}`)
    } else if (Array.isArray(filter)) {
      // array
      this.url.searchParams.append(`"${column}"`, `cd.{${cleanFilterArray(filter)}}`)
    } else {
      // json
      this.url.searchParams.append(`"${column}"`, `cd.${JSON.stringify(filter)}`)
    }
    return this
  }

  sl(column: keyof T, range: string): this {
    this.url.searchParams.append(`"${column}"`, `sl.${range}`)
    return this
  }

  sr(column: keyof T, range: string): this {
    this.url.searchParams.append(`"${column}"`, `sr.${range}`)
    return this
  }

  nxl(column: keyof T, range: string): this {
    this.url.searchParams.append(`"${column}"`, `nxl.${range}`)
    return this
  }

  nxr(column: keyof T, range: string): this {
    this.url.searchParams.append(`"${column}"`, `nxr.${range}`)
    return this
  }

  adj(column: keyof T, range: string): this {
    this.url.searchParams.append(`"${column}"`, `adj.${range}`)
    return this
  }

  ov(column: keyof T, filter: string | T[keyof T][]): this {
    if (typeof filter === 'string') {
      // range
      this.url.searchParams.append(`"${column}"`, `cd.${filter}`)
    } else {
      // array
      this.url.searchParams.append(`"${column}"`, `cd.{${cleanFilterArray(filter)}}`)
    }
    return this
  }

  fts(column: keyof T, query: string, { config }: { config?: string } = {}): this {
    const configPart = typeof config === 'undefined' ? '' : `(${config})`
    this.url.searchParams.append(`"${column}"`, `fts${configPart}.${query}`)
    return this
  }

  plfts(column: keyof T, query: string, { config }: { config?: string } = {}): this {
    const configPart = typeof config === 'undefined' ? '' : `(${config})`
    this.url.searchParams.append(`"${column}"`, `plfts${configPart}.${query}`)
    return this
  }

  phfts(column: keyof T, query: string, { config }: { config?: string } = {}): this {
    const configPart = typeof config === 'undefined' ? '' : `(${config})`
    this.url.searchParams.append(`"${column}"`, `phfts${configPart}.${query}`)
    return this
  }

  wfts(column: keyof T, query: string, { config }: { config?: string } = {}): this {
    const configPart = typeof config === 'undefined' ? '' : `(${config})`
    this.url.searchParams.append(`"${column}"`, `wfts${configPart}.${query}`)
    return this
  }

  filter(column: keyof T, operator: FilterOperator, filter: any): this {
    this.url.searchParams.append(`"${column}"`, `${operator}.${filter}`)
    return this
  }

  match(query: { [key: string]: string }) {
    Object.keys(query).forEach((key) => {
      this.url.searchParams.append(`"${key}"`, `eq.${query[key]}`)
    })
    return this
  }
}
