import PostgrestError from './PostgrestError'

export type Fetch = typeof fetch

/**
 * Response format
 *
 * {@link https://github.com/supabase/supabase-js/issues/32}
 */
interface PostgrestResponseBase {
  status: number
  statusText: string
}
export interface PostgrestResponseSuccess<T> extends PostgrestResponseBase {
  error: null
  data: T
  count: number | null
}
export interface PostgrestResponseFailure extends PostgrestResponseBase {
  error: PostgrestError
  data: null
  count: null
}

// TODO: in v3:
// - remove PostgrestResponse and PostgrestMaybeSingleResponse
// - rename PostgrestSingleResponse to PostgrestResponse
export type PostgrestSingleResponse<T> = PostgrestResponseSuccess<T> | PostgrestResponseFailure
export type PostgrestMaybeSingleResponse<T> = PostgrestSingleResponse<T | null>
export type PostgrestResponse<T> = PostgrestSingleResponse<T[]>

export type GenericRelationship = {
  foreignKeyName: string
  columns: string[]
  isOneToOne?: boolean
  referencedRelation: string
  referencedColumns: string[]
}

export type GenericTable = {
  Row: Record<string, unknown>
  Insert: Record<string, unknown>
  Update: Record<string, unknown>
  Relationships: GenericRelationship[]
}

export type GenericUpdatableView = {
  Row: Record<string, unknown>
  Insert: Record<string, unknown>
  Update: Record<string, unknown>
  Relationships: GenericRelationship[]
}

export type GenericNonUpdatableView = {
  Row: Record<string, unknown>
  Relationships: GenericRelationship[]
}

export type GenericView = GenericUpdatableView | GenericNonUpdatableView

export type GenericFunction = {
  Args: Record<string, unknown>
  Returns: unknown
}

export type GenericSchema = {
  Tables: Record<string, GenericTable>
  Views: Record<string, GenericView>
  Functions: Record<string, GenericFunction>
}

// https://twitter.com/mattpocockuk/status/1622730173446557697
export type Prettify<T> = { [K in keyof T]: T[K] } & {}
// https://github.com/sindresorhus/type-fest
export type SimplifyDeep<Type, ExcludeType = never> = ConditionalSimplifyDeep<
  Type,
  ExcludeType | NonRecursiveType | Set<unknown> | Map<unknown, unknown>,
  object
>
type ConditionalSimplifyDeep<
  Type,
  ExcludeType = never,
  IncludeType = unknown
> = Type extends ExcludeType
  ? Type
  : Type extends IncludeType
  ? { [TypeKey in keyof Type]: ConditionalSimplifyDeep<Type[TypeKey], ExcludeType, IncludeType> }
  : Type
type NonRecursiveType = BuiltIns | Function | (new (...arguments_: any[]) => unknown)
type BuiltIns = Primitive | void | Date | RegExp
type Primitive = null | undefined | string | number | boolean | symbol | bigint

// Match relationship filters with `table.column` syntax and resolve underlying
// column value. If not matched, fallback to generic type.
// TODO: Validate the relationship itself ala select-query-parser. Currently we
// assume that all tables have valid relationships to each other, despite
// nonexistent foreign keys.
export type ResolveFilterValue<
  Schema extends GenericSchema,
  Row extends Record<string, unknown>,
  ColumnName extends string
> = ColumnName extends `${infer RelationshipTable}.${infer Remainder}`
  ? Remainder extends `${infer _}.${infer _}`
    ? ResolveFilterValue<Schema, Row, Remainder>
    : ResolveFilterRelationshipValue<Schema, RelationshipTable, Remainder>
  : ColumnName extends keyof Row
    ? Row[ColumnName]
    : never

export type ResolveFilterRelationshipValue<
  Schema extends GenericSchema,
  RelationshipTable extends string,
  RelationshipColumn extends string
> = Schema['Tables'] & Schema['Views'] extends infer TablesAndViews
  ? RelationshipTable extends keyof TablesAndViews
    ? 'Row' extends keyof TablesAndViews[RelationshipTable]
      ? RelationshipColumn extends keyof TablesAndViews[RelationshipTable]['Row']
        ? TablesAndViews[RelationshipTable]['Row'][RelationshipColumn]
        : unknown
      : unknown
    : unknown
  : never
