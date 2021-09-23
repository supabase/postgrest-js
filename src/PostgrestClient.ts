import PostgrestQueryBuilder from './lib/PostgrestQueryBuilder'
import PostgrestRpcBuilder from './lib/PostgrestRpcBuilder'
import PostgrestFilterBuilder from './lib/PostgrestFilterBuilder'
import { DEFAULT_HEADERS } from './lib/constants'

export default class PostgrestClient {
  url: string
  headers: { [key: string]: string }
  schema?: string

  /**
   * Creates a PostgREST client.
   *
   * @param url  URL of the PostgREST endpoint.
   * @param headers  Custom headers.
   * @param schema  Postgres schema to switch to.
   */
  constructor(
    url: string,
    { headers = {}, schema }: { headers?: { [key: string]: string }; schema?: string } = {}
  ) {
    this.url = url
    this.headers = { ...DEFAULT_HEADERS, ...headers }
    this.schema = schema
  }

  /**
   * Authenticates the request with JWT.
   *
   * @param token  The JWT token to use.
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
  from<T = any>(table: string): PostgrestQueryBuilder<T> {
    const url = `${this.url}/${table}`
    return new PostgrestQueryBuilder<T>(url, { headers: this.headers, schema: this.schema })
  }

  /**
   * Perform a function call.
   *
   * @param fn  The function name to call.
   * @param params  The parameters to pass to the function call.
   * @param count  Count algorithm to use to count rows in a table.
   * @param method  The HTTP request method the query is sent with.
   *                "HEAD"/"GET" queries will invoke the function in a read-only transaction.
   *                "HEAD" can be used with `count` to get the number of rows in a table
   *                without returning any data.
   */
  rpc<T = any>(
    fn: string,
    params?: object,
    {
      method = 'POST',
      count = null,
    }: {
      method?: 'POST' | 'GET' | 'HEAD'
      count?: null | 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<T> {
    const url = `${this.url}/rpc/${fn}`
    return new PostgrestRpcBuilder<T>(url, {
      headers: this.headers,
      schema: this.schema,
    }).rpc(params, { method, count })
  }
}
