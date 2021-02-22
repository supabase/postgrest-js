import { PostgrestBuilder } from './types'
import PostgrestTransformBuilder from './PostgrestTransformBuilder'

export default class PostgrestRpcBuilder<T> extends PostgrestBuilder<T> {
  rpc(
    params?: object,
    {
      head = false,
      count = null,
    }: {
      head?: boolean
      count?: null | 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestTransformBuilder<T> {
    this.method = 'POST'
    this.body = params
    if (count) {
      this.headers['Prefer'] = `count=${count}`
    }
    if (head) {
      this.method = 'HEAD'
    }
    return new PostgrestTransformBuilder(this)
  }
}