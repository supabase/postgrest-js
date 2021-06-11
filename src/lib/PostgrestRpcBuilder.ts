import { FilterBuilder, PostgrestBuilder, RpcBuilder, RpcBuilderConfig, RpcOptions } from './types'
import PostgrestFilterBuilder from './PostgrestFilterBuilder'

export default class PostgrestRpcBuilder<T> extends PostgrestBuilder<T> implements RpcBuilder<T> {
  constructor(url: string, { headers = {}, schema }: RpcBuilderConfig = {}) {
    super({} as PostgrestBuilder<T>)
    this.url = new URL(url)
    this.headers = { ...headers }
    this.schema = schema
  }

  /**
   * Perform a stored procedure call.
   */
  rpc(params?: object, { count = null }: RpcOptions = {}): FilterBuilder<T> {
    this.method = 'POST'
    this.body = params

    if (count) {
      if (this.headers['Prefer'] !== undefined) this.headers['Prefer'] += `,count=${count}`
      else this.headers['Prefer'] = `count=${count}`
    }

    return new PostgrestFilterBuilder(this)
  }
}
