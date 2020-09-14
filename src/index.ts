import { PostgrestBuilder, PostgrestQueryBuilder } from './builder'

export class PostgrestClient {
  url: string
  headers: { [key: string]: string }
  schema?: string

  constructor(
    url: string,
    { headers = {}, schema }: { headers?: { [key: string]: string }; schema?: string } = {}
  ) {
    this.url = url
    this.headers = headers
    this.schema = schema
  }

  auth(token: string): this {
    this.headers['Authorization'] = `Bearer ${token}`
    return this
  }

  from<T = any>(table: string): PostgrestQueryBuilder<T> {
    const url = `${this.url}/${table}`
    return new PostgrestQueryBuilder(url, { headers: this.headers, schema: this.schema })
  }

  rpc<T = any>(fn: string, params?: object): PostgrestBuilder<T> {
    const url = `${this.url}/rpc/${fn}`
    return new PostgrestQueryBuilder<T>(url, { headers: this.headers, schema: this.schema }).rpc(
      params
    )
  }
}
