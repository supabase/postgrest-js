import { PostgrestBuilder } from './types'
import PostgrestFilterBuilder from './PostgrestFilterBuilder'

export default class PostgrestRpcBuilder<T> extends PostgrestBuilder<T> {
  constructor(
    url: string,
    { headers = {}, schema }: { headers?: { [key: string]: string }; schema?: string } = {}
  ) {
    super({} as PostgrestBuilder<T>)
    this.url = new URL(url)
    this.headers = { ...headers }
    this.schema = schema
  }

  /**
   * Perform a function call.
   */
  rpc(
    params?: object,
    {
      method = 'POST',
      count = null,
    }: {
      method?: 'POST' | 'GET' | 'HEAD'
      count?: null | 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<T> {
    if (method == 'HEAD' || method == 'GET') {
      this.method = method

      if (params) {
        Object.entries(params).forEach(([name, value]) => {
          this.url.searchParams.append(name, value)
        })
      }
    } else {
      this.method = 'POST'
      this.body = params
    }

    if (count) {
      if (this.headers['Prefer'] !== undefined) this.headers['Prefer'] += `,count=${count}`
      else this.headers['Prefer'] = `count=${count}`
    }

    return new PostgrestFilterBuilder(this)
  }
}
