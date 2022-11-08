import crossFetch from 'cross-fetch'
import type PostgrestFilterBuilder from './PostgrestFilterBuilder'
import type PostgrestQueryBuilder from './PostgrestQueryBuilder'
import type PostgrestTransformBuilder from './PostgrestTransformBuilder'

import type { Fetch, PostgrestResponse } from './types'

type EnableThrowOnError<T> = T extends PostgrestFilterBuilder<
  infer Schema,
  infer Row,
  infer Result,
  any
>
  ? PostgrestFilterBuilder<Schema, Row, Result, true>
  : T extends PostgrestTransformBuilder<infer Schema, infer Row, infer Result, any>
  ? PostgrestTransformBuilder<Schema, Row, Result, true>
  : T extends PostgrestQueryBuilder<infer Schema, infer Relation, any>
  ? PostgrestQueryBuilder<Schema, Relation, true>
  : any

export default abstract class PostgrestBuilder<Result, ThrowOnError>
  implements PromiseLike<PostgrestResponse<Result, ThrowOnError>>
{
  protected method: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE'
  protected url: URL
  protected headers: Record<string, string>
  protected schema?: string
  protected body?: unknown
  protected shouldThrowOnError = false
  protected signal?: AbortSignal
  protected fetch: Fetch
  protected allowEmpty: boolean

  constructor(builder: PostgrestBuilder<Result, ThrowOnError>) {
    this.method = builder.method
    this.url = builder.url
    this.headers = builder.headers
    this.schema = builder.schema
    this.body = builder.body
    this.shouldThrowOnError = builder.shouldThrowOnError
    this.signal = builder.signal
    this.allowEmpty = builder.allowEmpty

    if (builder.fetch) {
      this.fetch = builder.fetch
    } else if (typeof fetch === 'undefined') {
      this.fetch = crossFetch
    } else {
      this.fetch = fetch
    }
  }

  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError(): EnableThrowOnError<this> {
    this.shouldThrowOnError = true
    return this as any
  }

  then<TResult1 = PostgrestResponse<Result, ThrowOnError>, TResult2 = never>(
    onfulfilled?:
      | ((value: PostgrestResponse<Result, ThrowOnError>) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    // https://postgrest.org/en/stable/api.html#switching-schemas
    if (this.schema === undefined) {
      // skip
    } else if (['GET', 'HEAD'].includes(this.method)) {
      this.headers['Accept-Profile'] = this.schema
    } else {
      this.headers['Content-Profile'] = this.schema
    }
    if (this.method !== 'GET' && this.method !== 'HEAD') {
      this.headers['Content-Type'] = 'application/json'
    }

    // NOTE: Invoke w/o `this` to avoid illegal invocation error.
    // https://github.com/supabase/postgrest-js/pull/247
    const _fetch = this.fetch
    let res = _fetch(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.signal,
    }).then(async (res) => {
      let error = null
      let data = null
      let count: number | null = null
      let status = res.status
      let statusText = res.statusText

      if (res.ok) {
        if (this.method !== 'HEAD') {
          const body = await res.text()
          if (body === '') {
            // Prefer: return=minimal
          } else if (this.headers['Accept'] === 'text/csv') {
            data = body
          } else if (
            this.headers['Accept'] &&
            this.headers['Accept'].includes('application/vnd.pgrst.plan+text')
          ) {
            data = body
          } else {
            data = JSON.parse(body)
          }
        }

        const countHeader = this.headers['Prefer']?.match(/count=(exact|planned|estimated)/)
        const contentRange = res.headers.get('content-range')?.split('/')
        if (countHeader && contentRange && contentRange.length > 1) {
          count = parseInt(contentRange[1])
        }
      } else {
        const body = await res.text()

        try {
          error = JSON.parse(body)
        } catch {
          error = {
            message: body,
          }
        }

        if (error && this.allowEmpty && error?.details?.includes('Results contain 0 rows')) {
          error = null
          status = 200
          statusText = 'OK'
        }

        if (error && this.shouldThrowOnError) {
          throw error
        }
      }

      const postgrestResponse = {
        error,
        data,
        count,
        status,
        statusText,
      }

      return postgrestResponse
    })
    if (!this.shouldThrowOnError) {
      res = res.catch((fetchError) => ({
        error: {
          message: `FetchError: ${fetchError.message}`,
          details: '',
          hint: '',
          code: fetchError.code || '',
        },
        data: null,
        count: null,
        status: 0,
        statusText: '',
      }))
    }

    return res.then(onfulfilled, onrejected)
  }
}
