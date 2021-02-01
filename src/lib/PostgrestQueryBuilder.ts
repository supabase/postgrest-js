import { PostgrestBuilder, TableBase } from './types'
import PostgrestFilterBuilder from './PostgrestFilterBuilder'
import PostgrestTransformBuilder from './PostgrestTransformBuilder'

export default class PostgrestQueryBuilder<Type extends TableBase> extends PostgrestBuilder<Type> {
  constructor(
    url: string,
    { headers = {}, schema }: { headers?: Record<string, string>; schema?: string } = {}
  ) {
    super({} as PostgrestBuilder<Type>)
    this.url = new URL(url)
    this.headers = { ...headers }
    this.schema = schema
  }

  /**
   * Performs vertical filtering with SELECT.
   *
   * @param columns  The columns to retrieve, separated by commas.
   * @param head  When set to true, select will void data.
   * @param count  Count algorithm to use to count rows in a table.
   */
  select(
    columns: '*' | string | keyof Type | Array<keyof Type> = '*',
    {
      head = false,
      count = null,
    }: {
      head?: boolean
      count?: null | 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<Type> {
    this.method = 'GET'

    if (Array.isArray(columns)) {
      columns = columns.join(',')
    }

    // Remove whitespaces except when quoted
    let quoted = false
    const cleanedColumns = (columns as string)
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

    if (count) {
      this.headers['Prefer'] = `count=${count}`
    }

    if (head) {
      this.method = 'HEAD'
    }

    return new PostgrestFilterBuilder(this)
  }

  /**
   * Performs an INSERT into the table.
   *
   * @param values  The values to insert.
   * @param upsert  If `true`, performs an UPSERT.
   * @param onConflict  By specifying the `on_conflict` query parameter, you can make UPSERT work on a column(s) that has a UNIQUE constraint.
   * @param returning  By default the new record is returned. Set this to 'minimal' if you don't need this value.
   */
  insert(
    values: Partial<Type> | Partial<Type>[],
    {
      upsert = false,
      onConflict,
      returning = 'representation',
      count = null,
    }: {
      upsert?: boolean
      onConflict?: string
      returning?: 'minimal' | 'representation'
      count?: null | 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<Type> {
    this.method = 'POST'

    let prefersHeaders = []
    prefersHeaders.push(`return=${returning}`)
    if (upsert) prefersHeaders.push('resolution=merge-duplicates')

    if (upsert && onConflict !== undefined) this.url.searchParams.set('on_conflict', onConflict)
    this.body = values
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }

    this.headers['Prefer'] = prefersHeaders.join(',')

    return new PostgrestFilterBuilder(this)
  }

  /**
   * Performs an UPDATE on the table.
   *
   * @param values  The values to update.
   * @param returning  By default the updated record is returned. Set this to 'minimal' if you don't need this value.
   */
  update(
    values: Partial<Type>,
    {
      returning = 'representation',
      count = null,
    }: {
      returning?: 'minimal' | 'representation'
      count?: null | 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<Type> {
    this.method = 'PATCH'
    let prefersHeaders = []
    prefersHeaders.push(`return=${returning}`)
    this.body = values
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    this.headers['Prefer'] = prefersHeaders.join(',')
    return new PostgrestFilterBuilder(this)
  }

  /**
   * Performs a DELETE on the table.
   *
   * @param returning  If `true`, return the deleted row(s) in the response.
   */
  delete({
    returning = 'representation',
    count = null,
  }: {
    returning?: 'minimal' | 'representation'
    count?: null | 'exact' | 'planned' | 'estimated'
  } = {}): PostgrestFilterBuilder<Type> {
    this.method = 'DELETE'
    let prefersHeaders = []
    prefersHeaders.push(`return=${returning}`)
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    this.headers['Prefer'] = prefersHeaders.join(',')
    return new PostgrestFilterBuilder(this)
  }

  /** @internal */
  rpc(
    params?: object,
    {
      head = false,
      count = null,
    }: {
      head?: boolean
      count?: null | 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestTransformBuilder<Type> {
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
