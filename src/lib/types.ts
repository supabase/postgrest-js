import fetch from 'cross-fetch'

/**
 * Error format
 *
 * {@link https://postgrest.org/en/stable/api.html?highlight=options#errors-and-http-status-codes}
 */
export type PostgrestError = {
  message: string
  details: string
  hint: string
  code: string
}

/**
 * Response format
 *
 * {@link https://github.com/supabase/supabase-js/issues/32}
 */
interface PostgrestResponseBase {
  status: number
  statusText: string
}

interface PostgrestResponseSuccess<T> extends PostgrestResponseBase {
  error: null
  data: T[]
  body: T[]
  count: number | null
}
interface PostgrestResponseFailure extends PostgrestResponseBase {
  error: PostgrestError
  data: null
  // For backward compatibility: body === data
  body: null
  count: null
}
export type PostgrestResponse<T> = PostgrestResponseSuccess<T> | PostgrestResponseFailure

interface PostgrestSingleResponseSuccess<T> extends PostgrestResponseBase {
  error: null
  data: T
  // For backward compatibility: body === data
  body: T
}
export type PostgrestSingleResponse<T> =
  | PostgrestSingleResponseSuccess<T>
  | PostgrestResponseFailure
export type PostgrestMaybeSingleResponse<T> = PostgrestSingleResponse<T | null>

export abstract class PostgrestBuilder<T> implements PromiseLike<PostgrestResponse<T>> {
  protected method!: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE'
  protected url!: URL
  protected headers!: { [key: string]: string }
  protected schema?: string
  protected body?: Partial<T> | Partial<T>[]
  protected shouldThrowOnError?: boolean

  constructor(builder: PostgrestBuilder<T>) {
    Object.assign(this, builder)
  }

  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError(): PostgrestBuilder<T> {
    this.shouldThrowOnError = true
    return this
  }

  then<TResult1 = PostgrestResponse<T>, TResult2 = never>(
    onfulfilled?:
      | ((value: PostgrestResponse<T>) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    // https://postgrest.org/en/stable/api.html#switching-schemas
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
          const isReturnMinimal = this.headers['Prefer']?.split(',').includes('return=minimal')
          if (this.method !== 'HEAD' && !isReturnMinimal) {
            const text = await res.text()
            if (!text) {
              // discard `text`
            } else if (this.headers['Accept'] === 'text/csv') {
              data = text
            } else {
              data = JSON.parse(text)
            }
          }

          const countHeader = this.headers['Prefer']?.match(/count=(exact|planned|estimated)/)
          const contentRange = res.headers.get('content-range')?.split('/')
          if (countHeader && contentRange && contentRange.length > 1) {
            count = parseInt(contentRange[1])
          }
        } else {
          error = await res.json()

          if (error && this.shouldThrowOnError) {
            throw error
          }
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
}
