import { PostgrestBuilder } from './types'
import PostgrestFilterBuilder from './PostgrestFilterBuilder'

/**
 * CRUD
 */

export default class PostgrestQueryBuilder<T> extends PostgrestBuilder<T> {
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
   * Performs horizontal filtering with SELECT.
   *
   * @param columns  The columns to retrieve, separated by commas.
   */
  select(columns = '*'): PostgrestFilterBuilder<T> {
    this.method = 'GET'
    // Remove whitespaces except when quoted
    let quoted = false
    const cleanedColumns = columns
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
    return new PostgrestFilterBuilder(this)
  }

  /**
   * Performs an INSERT into the table.
   *
   * @param values  The values to insert.
   * @param upsert  If `true`, performs an UPSERT.
   * @param onConflict  By specifying the `on_conflict` query parameter, you can make UPSERT work on a column(s) that has a UNIQUE constraint.
   * @param returning  If `true`, return the inserted row(s) in the response.
   */
  insert(
    values: Partial<T> | Partial<T>[],
    {
      upsert = false,
      onConflict,
      returning = 'representation',
    }: {
      upsert?: boolean
      onConflict?: string
      returning?: 'representation' | 'minimal'
    } = {}
  ): PostgrestFilterBuilder<T> {
    this.method = 'POST'

    let prefersHeaders = []
    prefersHeaders.push(`return=${returning}`)
    if (upsert) prefersHeaders.push('resolution=merge-duplicates')
    this.headers['Prefer'] = prefersHeaders.join(',')
    
    if (upsert && onConflict !== undefined) this.url.searchParams.set('on_conflict', onConflict)
    this.body = values
    return new PostgrestFilterBuilder(this)
  }

  /**
   * Performs an UPDATE on the table.
   *
   * @param values  The values to update.
   * @param returnUpdated  If `true`, return the updated row(s) in the response.
   */
  update(values: Partial<T>, { returnUpdated = true } = {}): PostgrestFilterBuilder<T> {
    this.method = 'PATCH'
    this.headers['Prefer'] = `return=${returnUpdated ? 'representation' : 'minimal'}`
    this.body = values
    return new PostgrestFilterBuilder(this)
  }

  /**
   * Performs a DELETE on the table.
   *
   * @param returnDeleted  If `true`, return the deleted row(s) in the response.
   */
  delete({ returnDeleted = true } = {}): PostgrestFilterBuilder<T> {
    this.method = 'DELETE'
    this.headers['Prefer'] = `return=${returnDeleted ? 'representation' : 'minimal'}`
    return new PostgrestFilterBuilder(this)
  }

  /** @internal */
  rpc(params?: object): PostgrestBuilder<T> {
    this.method = 'POST'
    this.body = params
    return this
  }
}
