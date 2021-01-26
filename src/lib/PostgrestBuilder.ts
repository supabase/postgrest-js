import fetch from 'cross-fetch'
import { PostgrestResponse } from './types'

export abstract class PostgrestBuilder<T> implements PromiseLike<PostgrestResponse<T>> {
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
    this._setHeaders<TResult1, TResult2>()

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
          error = null

          if (this.method !== 'HEAD') {
            const isReturnMinimal = this.headers['Prefer']?.split(',').includes('return=minimal')
            data = isReturnMinimal ? null : await res.json()
          }

          const countHeader = this.headers['Prefer']?.match(/count=(exact|planned|estimated)/)
          if (countHeader) {
            const contentRange = res.headers.get('content-range')?.split('/')
            if (contentRange && contentRange.length > 1) {
              count = parseInt(contentRange[1])
            }
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

  private _setHeaders<TResult1 = PostgrestResponse<T>, TResult2 = never>(): void {
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
  }
}
