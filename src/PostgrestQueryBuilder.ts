import PostgrestBuilder from './PostgrestBuilder'
import PostgrestFilterBuilder from './PostgrestFilterBuilder'
import { GetResult } from './select-query-parser'
import { Fetch, GenericSchema, GenericTable, GenericView } from './types'

export default class PostgrestQueryBuilder<
  Schema extends GenericSchema,
  Relation extends GenericTable | GenericView
> {
  url: URL
  headers: Record<string, string>
  schema?: string
  signal?: AbortSignal
  fetch?: Fetch

  constructor(
    url: URL,
    {
      headers = {},
      schema,
      fetch,
    }: {
      headers?: Record<string, string>
      schema?: string
      fetch?: Fetch
    }
  ) {
    this.url = url
    this.headers = headers
    this.schema = schema
    this.fetch = fetch
  }

  /**
   * Perform a SELECT query on the table or view.
   *
   * @param columns - The columns to retrieve, separated by commas
   *
   * @param options - Named parameters
   *
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   *
   * @param options.count - Count algorithm to use to count rows in the table or view.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  select<Query extends string = '*', Result = GetResult<Schema, Relation['Row'], Query>>(
    columns?: Query,
    {
      head = false,
      count,
    }: {
      head?: boolean
      count?: 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<Schema, Relation['Row'], Result> {
    const method = head ? 'HEAD' : 'GET'
    // Remove whitespaces except when quoted
    let quoted = false
    const cleanedColumns = (columns ?? '*')
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
    if (count) {
      this.headers['Prefer'] = `count=${count}`
    }

    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: false,
    } as unknown as PostgrestBuilder<Result>)
  }

  /**
   * Perform an INSERT into the table or view.
   *
   * By default, inserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to insert. Pass an object to insert a single row
   * or an array to insert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count inserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  insert<Row extends Relation extends { Insert: unknown } ? Relation['Insert'] : never>(
    values: Row | Row[],
    {
      count,
    }: {
      count?: 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<Schema, Relation['Row'], undefined> {
    const method = 'POST'

    const prefersHeaders = []
    const body = values
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    if (this.headers['Prefer']) {
      prefersHeaders.unshift(this.headers['Prefer'])
    }
    this.headers['Prefer'] = prefersHeaders.join(',')

    if (Array.isArray(values)) {
      const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), [] as string[])
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`)
        this.url.searchParams.set('columns', uniqueColumns.join(','))
      }
    }

    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body,
      fetch: this.fetch,
      allowEmpty: false,
    } as unknown as PostgrestBuilder<undefined>)
  }

  /**
   * Perform an UPSERT on the table or view. Depending on the column(s) passed
   * to `onConflict`, `.upsert()` allows you to perform the equivalent of
   * `.insert()` if a row with the corresponding `onConflict` columns doesn't
   * exist, or if it does exist, perform an alternative action depending on
   * `ignoreDuplicates`.
   *
   * By default, upserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to upsert with. Pass an object to upsert a
   * single row or an array to upsert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
   * duplicate rows are determined. Two rows are duplicates if all the
   * `onConflict` columns are equal.
   *
   * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
   * `false`, duplicate rows are merged with existing rows.
   *
   * @param options.count - Count algorithm to use to count upserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  upsert<Row extends Relation extends { Insert: unknown } ? Relation['Insert'] : never>(
    values: Row | Row[],
    {
      onConflict,
      ignoreDuplicates = false,
      count,
    }: {
      onConflict?: string
      ignoreDuplicates?: boolean
      count?: 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<Schema, Relation['Row'], undefined> {
    const method = 'POST'

    const prefersHeaders = [`resolution=${ignoreDuplicates ? 'ignore' : 'merge'}-duplicates`]

    if (onConflict !== undefined) this.url.searchParams.set('on_conflict', onConflict)
    const body = values
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    if (this.headers['Prefer']) {
      prefersHeaders.unshift(this.headers['Prefer'])
    }
    this.headers['Prefer'] = prefersHeaders.join(',')

    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body,
      fetch: this.fetch,
      allowEmpty: false,
    } as unknown as PostgrestBuilder<undefined>)
  }

  /**
   * Perform an UPDATE on the table or view.
   *
   * By default, updated rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param values - The values to update with
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count updated rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  update<Row extends Relation extends { Update: unknown } ? Relation['Update'] : never>(
    values: Row,
    {
      count,
    }: {
      count?: 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<Schema, Relation['Row'], undefined> {
    const method = 'PATCH'
    const prefersHeaders = []
    const body = values
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    if (this.headers['Prefer']) {
      prefersHeaders.unshift(this.headers['Prefer'])
    }
    this.headers['Prefer'] = prefersHeaders.join(',')

    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body,
      fetch: this.fetch,
      allowEmpty: false,
    } as unknown as PostgrestBuilder<undefined>)
  }

  /**
   * Perform a DELETE on the table or view.
   *
   * By default, deleted rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count deleted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  delete({
    count,
  }: {
    count?: 'exact' | 'planned' | 'estimated'
  } = {}): PostgrestFilterBuilder<Schema, Relation['Row'], undefined> {
    const method = 'DELETE'
    const prefersHeaders = []
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    if (this.headers['Prefer']) {
      prefersHeaders.unshift(this.headers['Prefer'])
    }
    this.headers['Prefer'] = prefersHeaders.join(',')

    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: false,
    } as unknown as PostgrestBuilder<undefined>)
  }
}
