import fetch from 'cross-fetch'

/**
 * Error format
 *
 * {@link https://postgrest.org/en/stable/api.html?highlight=options#errors-and-http-status-codes}
 */
interface PostgrestError {
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
}
interface PostgrestResponseFailure extends PostgrestResponseBase {
  error: PostgrestError
  data: null
  // For backward compatibility: body === data
  body: null
}
export type PostgrestResponse<T> = PostgrestResponseSuccess<T> | PostgrestResponseFailure

interface PostgrestSingleResponseSuccess<T> extends PostgrestResponseBase {
  data: T
  // For backward compatibility: body === data
  body: T
}
export type PostgrestSingleResponse<T> =
  | PostgrestSingleResponseSuccess<T>
  | PostgrestResponseFailure

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
        let error, data
        if (res.ok) {
          error = null
          const isReturnMinimal = this.headers['Prefer']?.split(',').includes('return=minimal')
          data = isReturnMinimal ? null : await res.json()
        } else {
          error = await res.json()
          data = null
        }
        const postgrestResponse: PostgrestResponse<T> = {
          error,
          data,
          status: res.status,
          statusText: res.statusText,
          body: data,
        }
        return postgrestResponse
      })
      .then(onfulfilled, onrejected)
  }
}
