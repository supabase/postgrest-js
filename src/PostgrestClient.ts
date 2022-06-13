import PostgrestQueryBuilder from './PostgrestQueryBuilder'
import PostgrestFilterBuilder from './PostgrestFilterBuilder'
import PostgrestBuilder from './PostgrestBuilder'
import { DEFAULT_HEADERS } from './constants'
import { Fetch, GenericSchema } from './types'

export default class PostgrestClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
> {
  url: string
  headers: Record<string, string>
  schema?: SchemaName
  fetch?: Fetch
  shouldThrowOnError: boolean

  /**
   * Creates a PostgREST client.
   *
   * @param url  URL of the PostgREST endpoint.
   * @param headers  Custom headers.
   * @param schema  Postgres schema to switch to.
   */
  constructor(
    url: string,
    {
      headers = {},
      schema,
      fetch,
      throwOnError = false,
    }: {
      headers?: Record<string, string>
      schema?: SchemaName
      fetch?: Fetch
      throwOnError?: boolean
    } = {}
  ) {
    this.url = url
    this.headers = { ...DEFAULT_HEADERS, ...headers }
    this.schema = schema
    this.fetch = fetch
    this.shouldThrowOnError = throwOnError
  }

  /**
   * Authenticates the request with JWT.
   *
   * @param token  The JWT token to use.
   *
   * @deprecated Use `headers` in constructor instead.
   */
  auth(token: string): this {
    this.headers['Authorization'] = `Bearer ${token}`
    return this
  }

  /**
   * Perform a table operation.
   *
   * @param table  The table name to operate on.
   */
  from<
    TableName extends string & keyof Schema['Tables'],
    Table extends Schema['Tables'][TableName]
  >(table: TableName): PostgrestQueryBuilder<Table> {
    const url = new URL(`${this.url}/${table}`)
    return new PostgrestQueryBuilder<Table>(url, {
      headers: { ...this.headers },
      schema: this.schema,
      fetch: this.fetch,
      shouldThrowOnError: this.shouldThrowOnError,
    })
  }

  /**
   * Perform a function call.
   *
   * @param fn  The function name to call.
   * @param args  The parameters to pass to the function call.
   * @param options  Named parameters.
   * @param options.head  When set to true, no data will be returned.
   * @param options.count  Count algorithm to use to count rows in a table.
   */
  rpc<
    FunctionName extends string & keyof Schema['Functions'],
    Function_ extends Schema['Functions'][FunctionName]
  >(
    fn: FunctionName,
    args: Function_['Args'] = {},
    {
      head = false,
      count,
    }: {
      head?: boolean
      count?: 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<
    Function_['Returns'] extends any[]
      ? Function_['Returns'][number] extends Record<string, unknown>
        ? Function_['Returns'][number]
        : never
      : never,
    Function_['Returns']
  > {
    let method: 'HEAD' | 'POST'
    const url = new URL(`${this.url}/rpc/${fn}`)
    let body: unknown | undefined
    if (head) {
      method = 'HEAD'
      Object.entries(args).forEach(([name, value]) => {
        url.searchParams.append(name, `${value}`)
      })
    } else {
      method = 'POST'
      body = args
    }

    const headers = { ...this.headers }
    if (count) {
      headers['Prefer'] = `count=${count}`
    }

    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schema,
      body,
      fetch: this.fetch,
      shouldThrowOnError: this.shouldThrowOnError,
      allowEmpty: false,
    } as unknown as PostgrestBuilder<Function_['Returns']>)
  }
}
