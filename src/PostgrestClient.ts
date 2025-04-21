import PostgrestQueryBuilder from './PostgrestQueryBuilder'
import PostgrestFilterBuilder from './PostgrestFilterBuilder'
import PostgrestBuilder from './PostgrestBuilder'
import { DEFAULT_HEADERS } from './constants'
import { Fetch, GenericFunction, GenericSchema, GenericSetofOption } from './types'
import { FindMatchingFunctionByArgs, IsAny } from './select-query-parser/utils'

type ExactMatch<T, S> = [T] extends [S] ? ([S] extends [T] ? true : false) : false

type ExtractExactFunction<Fns, Args> = Fns extends infer F
  ? F extends GenericFunction
    ? ExactMatch<F['Args'], Args> extends true
      ? F
      : never
    : never
  : never

export type GetRpcFunctionFilterBuilderByArgs<
  Schema extends GenericSchema,
  FnName extends string & keyof Schema['Functions'],
  Args
> = {
  0: Schema['Functions'][FnName]
  // This is here to handle the case where the args is exactly {} and fallback to the empty
  // args function definition if there is one in such case
  1: [keyof Args] extends [never]
    ? ExtractExactFunction<Schema['Functions'][FnName], Args>
    : // Otherwise, we attempt to match with one of the function definition in the union based
    // on the function arguments provided
    Args extends GenericFunction['Args']
    ? FindMatchingFunctionByArgs<Schema['Functions'][FnName], Args>
    : any
}[1] extends infer Fn
  ? // If we are dealing with an non-typed client everything is any
    IsAny<Fn> extends true
    ? { Row: any; Result: any; RelationName: FnName; Relationships: null }
    : // Otherwise, we use the arguments based function definition narrowing to get the rigt value
    Fn extends GenericFunction
    ? {
        Row: Fn['Returns'] extends any[]
          ? Fn['Returns'][number] extends Record<string, unknown>
            ? Fn['Returns'][number]
            : never
          : Fn['Returns'] extends Record<string, unknown>
          ? Fn['Returns']
          : never
        Result: Fn['Returns']
        RelationName: Fn['SetofOptions'] extends GenericSetofOption
          ? Fn['SetofOptions']['to']
          : FnName
        Relationships: Fn['SetofOptions'] extends GenericSetofOption
          ? Fn['SetofOptions']['to'] extends keyof Schema['Tables']
            ? Schema['Tables'][Fn['SetofOptions']['to']]['Relationships']
            : Schema['Views'][Fn['SetofOptions']['to']]['Relationships']
          : null
      }
    : // If we failed to find the function by argument, we still pass with any but also add an overridable
    Fn extends never
    ? {
        Row: any
        Result: { error: true } & "Couldn't find function"
        RelationName: FnName
        Relationships: null
      }
    : never
  : never

/**
 * PostgREST client.
 *
 * @typeParam Database - Types for the schema from the [type
 * generator](https://supabase.com/docs/reference/javascript/next/typescript-support)
 *
 * @typeParam SchemaName - Postgres schema to switch to. Must be a string
 * literal, the same one passed to the constructor. If the schema is not
 * `"public"`, this must be supplied manually.
 */
export default class PostgrestClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
> {
  url: string
  headers: Record<string, string>
  schemaName?: SchemaName
  fetch?: Fetch

  // TODO: Add back shouldThrowOnError once we figure out the typings
  /**
   * Creates a PostgREST client.
   *
   * @param url - URL of the PostgREST endpoint
   * @param options - Named parameters
   * @param options.headers - Custom headers
   * @param options.schema - Postgres schema to switch to
   * @param options.fetch - Custom fetch
   */
  constructor(
    url: string,
    {
      headers = {},
      schema,
      fetch,
    }: {
      headers?: Record<string, string>
      schema?: SchemaName
      fetch?: Fetch
    } = {}
  ) {
    this.url = url
    this.headers = { ...DEFAULT_HEADERS, ...headers }
    this.schemaName = schema
    this.fetch = fetch
  }

  from<
    TableName extends string & keyof Schema['Tables'],
    Table extends Schema['Tables'][TableName]
  >(relation: TableName): PostgrestQueryBuilder<Schema, Table, TableName>
  from<ViewName extends string & keyof Schema['Views'], View extends Schema['Views'][ViewName]>(
    relation: ViewName
  ): PostgrestQueryBuilder<Schema, View, ViewName>
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation: string): PostgrestQueryBuilder<Schema, any, any> {
    const url = new URL(`${this.url}/${relation}`)
    return new PostgrestQueryBuilder(url, {
      headers: { ...this.headers },
      schema: this.schemaName,
      fetch: this.fetch,
    })
  }

  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema<DynamicSchema extends string & keyof Database>(
    schema: DynamicSchema
  ): PostgrestClient<
    Database,
    DynamicSchema,
    Database[DynamicSchema] extends GenericSchema ? Database[DynamicSchema] : any
  > {
    return new PostgrestClient(this.url, {
      headers: this.headers,
      schema,
      fetch: this.fetch,
    })
  }

  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.get - When set to `true`, the function will be called with
   * read-only access mode.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc<
    FnName extends string & keyof Schema['Functions'],
    Args extends Schema['Functions'][FnName]['Args'] = {},
    FilterBuilder extends GetRpcFunctionFilterBuilderByArgs<
      Schema,
      FnName,
      Args
    > = GetRpcFunctionFilterBuilderByArgs<Schema, FnName, Args>
  >(
    fn: FnName,
    args: Args = {} as Args,
    {
      head = false,
      get = false,
      count,
    }: {
      head?: boolean
      get?: boolean
      count?: 'exact' | 'planned' | 'estimated'
    } = {}
  ): PostgrestFilterBuilder<
    Schema,
    FilterBuilder['Row'],
    FilterBuilder['Result'],
    FilterBuilder['RelationName'],
    FilterBuilder['Relationships']
  > {
    let method: 'HEAD' | 'GET' | 'POST'
    const url = new URL(`${this.url}/rpc/${fn}`)
    let body: unknown | undefined
    if (head || get) {
      method = head ? 'HEAD' : 'GET'
      Object.entries(args)
        // params with undefined value needs to be filtered out, otherwise it'll
        // show up as `?param=undefined`
        .filter(([_, value]) => value !== undefined)
        // array values need special syntax
        .map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(',')}}` : `${value}`])
        .forEach(([name, value]) => {
          url.searchParams.append(name, value)
        })
    } else {
      method = 'POST'
      body = args
    }

    const headers = { ...this.headers }
    if (count) {
      headers['Prefer'] = `count=${count}`
    }

    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schemaName,
      body,
      fetch: this.fetch,
      allowEmpty: false,
    } as unknown as PostgrestBuilder<FilterBuilder['Row']>)
  }
}
