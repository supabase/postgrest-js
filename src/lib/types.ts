import fetch from 'cross-fetch'

/**
 * Filter operator tokens
 */
export type FilterOperator =
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

/**
 * Error format
 *
 * {@link https://postgrest.org/en/stable/api.html?highlight=options#errors-and-http-status-codes}
 */
export interface PostgrestError {
  message: string
  details: string
  hint: string
  code: string
}

/**
 * Response format
 *
 * {@link https://github.com/supabase/supabase-js/issues/32}
 */
export interface PostgrestResponseBase {
  status: number
  statusText: string
}

export interface PostgrestResponseSuccess<T> extends PostgrestResponseBase {
  error: null
  data: T[]
  body: T[]
  count: number | null
}

export interface PostgrestResponseFailure extends PostgrestResponseBase {
  error: PostgrestError
  data: null
  // For backward compatibility: body === data
  body: null
  count: null
}

export type PostgrestResponse<T> = PostgrestResponseSuccess<T> | PostgrestResponseFailure

export interface PostgrestSingleResponseSuccess<T> extends PostgrestResponseBase {
  error: null
  data: T
  // For backward compatibility: body === data
  body: T
}

export type PostgrestSingleResponse<T> =
  | PostgrestSingleResponseSuccess<T>
  | PostgrestResponseFailure

export type PostgrestMaybeSingleResponse<T> = PostgrestSingleResponse<T | null>

export interface Builder<T> extends PromiseLike<PostgrestResponse<T>> {
  then<TResult1 = PostgrestResponse<T>, TResult2 = never>(
    onfulfilled?:
      | ((value: PostgrestResponse<T>) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2>
}

export type ReturnCount = null | 'exact' | 'planned' | 'estimated'

export type ReturnFormat = 'minimal' | 'representation'

export interface SelectOptions {
  head?: boolean
  count?: ReturnCount
}

export interface InsertOptions {
  upsert?: boolean
  onConflict?: string
  returning?: ReturnFormat
  count?: ReturnCount
}

export interface UpsertOptions {
  onConflict?: string
  returning?: ReturnFormat
  count?: ReturnCount
}

export interface UpdateOptions {
  returning?: ReturnFormat
  count?: ReturnCount
}

export interface DeleteOptions {
  returning?: ReturnFormat
  count?: ReturnCount
}

export interface QueryBuilderConfig {
  headers?: Record<string, string>
  schema?: string
}

export interface QueryBuilder<T> {
  select(columns: string, options?: SelectOptions): FilterBuilder<T>

  insert(values: Partial<T> | Partial<T>[], options?: InsertOptions): FilterBuilder<T>

  upsert(values: Partial<T> | Partial<T>[], options?: UpsertOptions): FilterBuilder<T>

  update(values: Partial<T>, options?: UpdateOptions): FilterBuilder<T>

  delete(options?: DeleteOptions): FilterBuilder<T>
}

export interface ForeignTableOptions {
  foreignTable?: string
}

export type TextSearchType = 'plain' | 'phrase' | 'websearch' | null

export interface TextSearchOptions {
  config?: string
  type?: TextSearchType
}

export interface FilterBuilder<T> {
  not(column: keyof T, operator: FilterOperator, value: any): FilterBuilder<T>

  or(filters: string, { foreignTable }: ForeignTableOptions): FilterBuilder<T>

  eq(column: keyof T, value: T[keyof T]): FilterBuilder<T>

  neq(column: keyof T, value: T[keyof T]): FilterBuilder<T>

  gt(column: keyof T, value: T[keyof T]): FilterBuilder<T>

  gte(column: keyof T, value: T[keyof T]): FilterBuilder<T>

  lt(column: keyof T, value: T[keyof T]): FilterBuilder<T>

  lte(column: keyof T, value: T[keyof T]): FilterBuilder<T>

  like(column: keyof T, pattern: string): FilterBuilder<T>

  ilike(column: keyof T, pattern: string): FilterBuilder<T>

  is(column: keyof T, value: boolean | null): FilterBuilder<T>

  in(column: keyof T, values: T[keyof T][]): FilterBuilder<T>

  contains(column: keyof T, value: string | T[keyof T][] | object): FilterBuilder<T>

  containedBy(column: keyof T, value: string | T[keyof T][] | object): FilterBuilder<T>

  rangeLt(column: keyof T, range: string): FilterBuilder<T>

  rangeGt(column: keyof T, range: string): FilterBuilder<T>

  rangeGte(column: keyof T, range: string): FilterBuilder<T>

  rangeLte(column: keyof T, range: string): FilterBuilder<T>

  rangeAdjacent(column: keyof T, range: string): FilterBuilder<T>

  overlaps(column: keyof T, value: string | T[keyof T][]): FilterBuilder<T>

  textSearch(column: keyof T, query: string, options: TextSearchOptions): FilterBuilder<T>

  filter(column: keyof T, operator: FilterOperator, value: any): FilterBuilder<T>

  match(query: { [key: string]: string }): FilterBuilder<T>
}

export interface RpcOptions {
  count?: ReturnCount
}

export interface RpcBuilder<T> {
  rpc(params?: object, options?: RpcOptions): FilterBuilder<T>
}

export interface OrderOptions {
  ascending?: boolean
  nullsFirst?: boolean
  foreignTable?: string
}

export interface LimitOptions {
  foreignTable?: string
}

export interface RangeOptions {
  foreignTable?: string
}

export interface TransformBuilder<T> extends Builder<T> {
  select(columns?: string): TransformBuilder<T>

  order(column: keyof T, options?: OrderOptions): TransformBuilder<T>

  limit(count: number, options?: LimitOptions): TransformBuilder<T>

  range(from: number, to: number, options?: RangeOptions): TransformBuilder<T>

  single(): PromiseLike<PostgrestSingleResponse<T>>

  maybeSingle(): PromiseLike<PostgrestMaybeSingleResponse<T>>

  csv(): TransformBuilder<T>
}

export interface ClientConfig {
  headers?: Record<string, string>
  schema?: string
}

export interface Client {
  url: string
  headers: Record<string, string>
  schema?: string

  auth(token: string): Client

  from<T = any>(table: string): QueryBuilder<T>

  rpc<T = any>(fn: string, params?: object): FilterBuilder<T>
}

export abstract class PostgrestBuilder<T> implements Builder<T> {
  protected method!: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE'
  protected url!: URL
  protected headers!: { [key: string]: string }
  protected schema?: string
  protected body?: Partial<T> | Partial<T>[]

  constructor(builder: PostgrestBuilder<T>) {
    Object.assign(this, builder)
  }

  then<TResult1 = PostgrestResponse<T>, TResult2 = never>(
    onfulfilled?:
      | ((value: PostgrestResponse<T>) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
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
        let error = null
        let data = null
        let count = null

        if (res.ok) {
          const isReturnMinimal = this.headers['Prefer']?.split(',').includes('return=minimal')
          if (this.method !== 'HEAD' && !isReturnMinimal) {
            const text = await res.text()
            if (text && text !== '' && this.headers['Accept'] !== 'text/csv') {
              data = JSON.parse(text)
            }
          }

          const countHeader = this.headers['Prefer']?.match(/count=(exact|planned|estimated)/)
          const contentRange = res.headers.get('content-range')?.split('/')
          if (countHeader && contentRange && contentRange.length > 1) {
            count = parseInt(contentRange[1])
          }
        } else {
          error = await res.json()
        }

        const postgrestResponse: PostgrestResponse<T> = {
          error,
          data,
          count,
          status: res.status,
          statusText: res.statusText,
          body: data,
        }
        return postgrestResponse
      })
      .then(onfulfilled, onrejected)
  }
}
