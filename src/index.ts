import { PostgrestBuilder } from './builder'

export class PostgrestClient {
  url: string
  headers: { [key: string]: string }
  schema: string

  constructor(url: string, options?: any) {
    this.url = url
    this.headers = options.headers
    this.schema = options.schema
  }

  auth(token: string): this {
    this.headers['Authorization'] = `Bearer ${token}`
    return this
  }

  from<T>(table: string): PostgrestBuilder<T> {
    const url = `${this.url}/${table}`
    return new PostgrestBuilder(url, { headers: this.headers, schema: this.schema })
  }

  rpc<T>(fn: string, params?: any): PostgrestBuilder<T> {
    const url = `${this.url}/rpc/${fn}`
    return new PostgrestBuilder(url, { headers: this.headers, schema: this.schema }).rpc(params)
  }
}
