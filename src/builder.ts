import axios from 'axios'

export class PostgrestBuilder<T> implements PromiseLike<T> {
  method!: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE'
  url: string
  params: { [key: string]: string } = {}
  headers: { [key: string]: string }
  schema: string
  data?: object | object[]

  constructor(url: string, options?: any) {
    this.url = url
    this.headers = options.headers
    this.schema = options.schema
  }

  select(columns: string = '*'): this {
    this.method = 'GET'
    this.params = { select: columns.replace(/\s/g, '') }
    return this
  }

  // insert(), update(), delete(), ...

  rpc(params?: any): this {
    this.method = 'POST'
    this.data = params
    return this
  }

  // eq(), neq(), gt(), ...

  then(onfulfilled?: any, onrejected?: any): Promise<any> {
    // https://postgrest.org/en/stable/api.html#switching-schemas
    if (typeof this.schema === 'undefined') {
      // skip
    } else if (['GET', 'HEAD'].includes(this.method)) {
      this.headers['Accept-Profile'] = this.schema
    } else {
      this.headers['Content-Profile'] = this.schema
    }

    return axios
      .request<PostgrestResponse<T>>({
        method: this.method,
        url: this.url,
        headers: this.headers,
        data: this.data,
      })
      .then((response) => {
        // Maintain backward compatibility with prev. implementation (body property instead of data)
        ;(response as any).body = response.data
        return response
      })
      .then(onfulfilled, onrejected)
  }
}

// https://postgrest.org/en/stable/api.html?highlight=options#errors-and-http-status-codes
interface PostgrestError {
  message: string
  details: string
  hint: string
  code: string
}

type PostgrestResponse<T> = T[] | PostgrestError

type PostgrestSingleResponse<T> = T | PostgrestError
