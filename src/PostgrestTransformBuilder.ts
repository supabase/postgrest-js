import PostgrestBuilder from './PostgrestBuilder'
import { GetResult } from './select-query-parser'
import { PostgrestMaybeSingleResponse, PostgrestSingleResponse } from './types'

/**
 * Post-filters (transforms)
 */

export default class PostgrestTransformBuilder<
  Table extends Record<string, unknown>,
  Result
> extends PostgrestBuilder<Result> {
  /**
   * Performs vertical filtering with SELECT.
   *
   * @param columns  The columns to retrieve, separated by commas.
   */
  select<Query extends string = '*', NewResult = GetResult<Table, Query extends '*' ? '*' : Query>>(
    columns?: Query
  ): PostgrestTransformBuilder<Table, NewResult> {
    // Remove whitespaces except when quoted
    let quoted = false
    const cleanedColumns = (columns ?? '*')
      .split('')
      .map((c) => {
        if (/\s/.test(c) && !quoted) {
          return ''
        }
        if (c === '"') {
          quoted = !quoted
        }
        return c
      })
      .join('')
    this.url.searchParams.set('select', cleanedColumns)
    if (this.headers['Prefer']) {
      this.headers['Prefer'] += ','
    }
    this.headers['Prefer'] += 'return=representation'
    return this as unknown as PostgrestTransformBuilder<Table, NewResult>
  }

  /**
   * Orders the result with the specified `column`.
   *
   * @param column  The column to order on.
   * @param ascending  If `true`, the result will be in ascending order.
   * @param nullsFirst  If `true`, `null`s appear first.
   * @param foreignTable  The foreign table to use (if `column` is a foreign column).
   */
  order<ColumnName extends string & keyof Table>(
    column: ColumnName,
    options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: undefined }
  ): this
  order(
    column: string,
    options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable: string }
  ): this
  order(
    column: string,
    {
      ascending = true,
      nullsFirst = true,
      foreignTable,
    }: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string } = {}
  ): this {
    const key = foreignTable ? `${foreignTable}.order` : 'order'
    const existingOrder = this.url.searchParams.get(key)

    this.url.searchParams.set(
      key,
      `${existingOrder ? `${existingOrder},` : ''}${column}.${ascending ? 'asc' : 'desc'}.${
        nullsFirst ? 'nullsfirst' : 'nullslast'
      }`
    )
    return this
  }

  /**
   * Limits the result with the specified `count`.
   *
   * @param count  The maximum no. of rows to limit to.
   * @param foreignTable  The foreign table to use (for foreign columns).
   */
  limit(count: number, { foreignTable }: { foreignTable?: string } = {}): this {
    const key = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`
    this.url.searchParams.set(key, `${count}`)
    return this
  }

  /**
   * Limits the result to rows within the specified range, inclusive.
   *
   * @param from  The starting index from which to limit the result, inclusive.
   * @param to  The last index to which to limit the result, inclusive.
   * @param foreignTable  The foreign table to use (for foreign columns).
   */
  range(from: number, to: number, { foreignTable }: { foreignTable?: string } = {}): this {
    const keyOffset = typeof foreignTable === 'undefined' ? 'offset' : `${foreignTable}.offset`
    const keyLimit = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`
    this.url.searchParams.set(keyOffset, `${from}`)
    // Range is inclusive, so add 1
    this.url.searchParams.set(keyLimit, `${to - from + 1}`)
    return this
  }

  /**
   * Sets the AbortSignal for the fetch request.
   */
  abortSignal(signal: AbortSignal): this {
    this.signal = signal
    return this
  }

  /**
   * Retrieves only one row from the result. Result must be one row (e.g. using
   * `limit`), otherwise this will result in an error.
   */
  single(): PromiseLike<PostgrestSingleResponse<Result>> {
    this.headers['Accept'] = 'application/vnd.pgrst.object+json'
    return this as PromiseLike<PostgrestSingleResponse<Result>>
  }

  /**
   * Retrieves at most one row from the result. Result must be at most one row
   * (e.g. using `eq` on a UNIQUE column), otherwise this will result in an
   * error.
   */
  maybeSingle(): PromiseLike<PostgrestMaybeSingleResponse<Result>> {
    this.headers['Accept'] = 'application/vnd.pgrst.object+json'
    this.allowEmpty = true
    return this as PromiseLike<PostgrestMaybeSingleResponse<Result>>
  }

  /**
   * Set the response type to CSV.
   */
  csv(): PromiseLike<PostgrestSingleResponse<string>> {
    this.headers['Accept'] = 'text/csv'
    return this as PromiseLike<PostgrestSingleResponse<string>>
  }
}
