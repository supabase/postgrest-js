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

  // TODO: Add back shouldThrowOnError once we figure out the typings
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
    }: {
      headers?: Record<string, string>
      schema?: SchemaName
      fetch?: Fetch
    } = {}
  ) {
    this.url = url
    this.headers = { ...DEFAULT_HEADERS, ...headers }
    this.schema = schema
    this.fetch = fetch
  }

  /**
   * Perform a query on a table or a view.
   *
   * @param relation  The table or view name to query.
   */
  from<
    TableName extends string & keyof Schema['Tables'],
    Table extends Schema['Tables'][TableName]
  >(relation: TableName): PostgrestQueryBuilder<Table>
  from<ViewName extends string & keyof Schema['Views'], View extends Schema['Views'][ViewName]>(
    relation: ViewName
  ): PostgrestQueryBuilder<View>
  from(relation: string): PostgrestQueryBuilder<any>
  from(relation: string): PostgrestQueryBuilder<any> {
    const url = new URL(`${this.url}/${relation}`)
    return new PostgrestQueryBuilder<any>(url, {
      headers: { ...this.headers },
      schema: this.schema,
      fetch: this.fetch,
    })
  }

  /**
   * Perform a function call.
   *
   * @param fn  The function name to call.
   * @param args  The parameters to pass to the function call.
   * @param options  Named parameters.
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
      /** When set to true, no data will be returned. */
      head?: boolean
      /** Count algorithm to use to count rows in a table. */
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
      allowEmpty: false,
    } as unknown as PostgrestBuilder<Function_['Returns']>)
  }
}
