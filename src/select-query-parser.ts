// Credits to @bnjmnt4n (https://www.npmjs.com/package/postgrest-query)
// See https://github.com/PostgREST/postgrest/blob/2f91853cb1de18944a4556df09e52450b881cfb3/src/PostgREST/ApiRequest/QueryParams.hs#L282-L284

import { GenericSchema, Prettify } from './types'

type Whitespace = ' ' | '\n' | '\t'

type LowerAlphabet =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

type Alphabet = LowerAlphabet | Uppercase<LowerAlphabet>

type Digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'

type Letter = Alphabet | Digit | '_'

type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

type SingleValuePostgreSQLTypes =
  | 'bool'
  | 'int2'
  | 'int4'
  | 'int8'
  | 'float4'
  | 'float8'
  | 'numeric'
  | 'bytea'
  | 'bpchar'
  | 'varchar'
  | 'date'
  | 'text'
  | 'citext'
  | 'time'
  | 'timetz'
  | 'timestamp'
  | 'timestamptz'
  | 'uuid'
  | 'vector'
  | 'json'
  | 'jsonb'
  | 'void'
  | 'record'
  | string

type ArrayPostgreSQLTypes = `_${SingleValuePostgreSQLTypes}`

type PostgreSQLTypes = SingleValuePostgreSQLTypes | ArrayPostgreSQLTypes

type TypeScriptSingleValueTypes<T extends SingleValuePostgreSQLTypes> = T extends 'bool'
  ? boolean
  : T extends 'int2' | 'int4' | 'int8' | 'float4' | 'float8' | 'numeric'
  ? number
  : T extends
      | 'bytea'
      | 'bpchar'
      | 'varchar'
      | 'date'
      | 'text'
      | 'citext'
      | 'time'
      | 'timetz'
      | 'timestamp'
      | 'timestamptz'
      | 'uuid'
      | 'vector'
  ? string
  : T extends 'json' | 'jsonb'
  ? Json
  : T extends 'void'
  ? undefined
  : T extends 'record'
  ? Record<string, unknown>
  : unknown

type AggregateFunctions = 'count' | 'sum' | 'avg' | 'min' | 'max'

type StripUnderscore<T extends string> = T extends `_${infer U}` ? U : T

type ContainsNull<T> = null extends T ? true : false;

type TypeScriptTypes<T extends PostgreSQLTypes> = T extends ArrayPostgreSQLTypes
  ? TypeScriptSingleValueTypes<StripUnderscore<Extract<T, SingleValuePostgreSQLTypes>>>[]
  : TypeScriptSingleValueTypes<T>

/**
 * Parser errors.
 */
type ParserError<Message extends string> = { error: true } & Message
type GenericStringError = ParserError<'Received a generic string'>
export type SelectQueryError<Message extends string> = { error: true } & Message

/**
 * Creates a new {@link ParserError} if the given input is not already a parser error.
 */
type CreateParserErrorIfRequired<Input, Message extends string> = Input extends ParserError<string>
  ? Input
  : ParserError<Message>

/**
 * Trims whitespace from the left of the input.
 */
type EatWhitespace<Input extends string> = string extends Input
  ? GenericStringError
  : Input extends `${Whitespace}${infer Remainder}`
  ? EatWhitespace<Remainder>
  : Input

/**
 * Returns a boolean representing whether there is a foreign key with the given name.
 */
type HasFKey<FKeyName, Relationships> = Relationships extends [infer R]
  ? R extends { foreignKeyName: FKeyName }
    ? true
    : false
  : Relationships extends [infer R, ...infer Rest]
  ? HasFKey<FKeyName, [R]> extends true
    ? true
    : HasFKey<FKeyName, Rest>
  : false

/**
 * Returns a boolean representing whether there is a foreign key with the given columns.
 */
type HasFKeyMatchingColumn<Columns, Relationships> = Relationships extends [infer R]
  ? R extends { columns: Columns }
    ? true
    : false
  : Relationships extends [infer R, ...infer Rest]
  ? HasFKeyMatchingColumn<Columns, [R]> extends true
    ? true
    : HasFKeyMatchingColumn<Columns, Rest>
  : false

/**
 * Returns a boolean representing whether there the foreign key has a unique constraint.
 */
type HasUniqueFKey<FKeyName, Relationships> = Relationships extends [infer R]
  ? R extends { foreignKeyName: FKeyName; isOneToOne: true }
    ? true
    : false
  : Relationships extends [infer R, ...infer Rest]
  ? HasUniqueFKey<FKeyName, [R]> extends true
    ? true
    : HasUniqueFKey<FKeyName, Rest>
  : false

/**
 * Returns a boolean representing whether there is a foreign key referencing
 * a given relation.
 */
type HasFKeyToFRel<FRelName, Relationships> = Relationships extends [infer R]
  ? R extends { referencedRelation: FRelName }
    ? true
    : false
  : Relationships extends [infer R, ...infer Rest]
  ? HasFKeyToFRel<FRelName, [R]> extends true
    ? true
    : HasFKeyToFRel<FRelName, Rest>
  : false

type HasUniqueFKeyToFRel<FRelName, Relationships> = Relationships extends [infer R]
  ? R extends { referencedRelation: FRelName; isOneToOne: true }
    ? true
    : false
  : Relationships extends [infer R, ...infer Rest]
  ? HasUniqueFKeyToFRel<FRelName, [R]> extends true
    ? true
    : HasUniqueFKeyToFRel<FRelName, Rest>
  : false

/**
 * Checks if there is more than one relation to a given foreign relation name in the Relationships.
 */
type HasMultipleFKeysToFRel<FRelName, Relationships> = Relationships extends [
  infer R,
  ...infer Rest
]
  ? R extends { referencedRelation: FRelName }
    ? HasFKeyToFRel<FRelName, Rest> extends true
      ? true
      : HasMultipleFKeysToFRel<FRelName, Rest>
    : HasMultipleFKeysToFRel<FRelName, Rest>
  : false

type TablesAndViews<Schema extends GenericSchema> = Schema['Tables'] & Exclude<Schema['Views'], ''>

type RequireHintingSelectQueryError<
  Field extends { original: string },
  RelationName
> = SelectQueryError<`Could not embed because more than one relationship was found for '${Field['original']}' and '${RelationName extends string
  ? RelationName
  : 'unkown'}' you need to hint the column with ${Field['original']}!<columnName> ?`>

type IsEmptyOrUnkownObject<T> = T extends Record<string, never>
  ? true
  : T extends unknown
    ? keyof T extends never
      ? true
      : false
    : false;

type FindMatchingRelationships<value extends string, Relationships> = Relationships extends [infer R, ...infer Rest]
  ? R extends { foreignKeyName: value }
    ? R
    : R extends { referencedRelation: value }
      ? R
      : R extends { columns: [value] }
        ? R
        : FindMatchingRelationships<value, Rest>
  : never

type FindFieldMathingRelationships<Field extends { original: string, inner?: boolean, left?: boolean, hint?: string, name?: string }, Relationships> = FindMatchingRelationships<Field['original'], Relationships>

// Given a Schema, will get a smaller schema where all the relationships referencedRelation will have to match
// one of the key of Schema['Tables'] and return the new schema where all the relationships of all the Tables will
// always only point to other tables
type GetSchemaWithoutViewsRelationships<Schema extends GenericSchema> = {
  [TableName in keyof Schema['Tables']]: {
    Row: Schema['Tables'][TableName]['Row'];
    Relationships: Schema['Tables'][TableName] extends { Relationships: infer R }
      ? {
          [K in keyof R]: R[K] extends { referencedRelation: infer RefRel }
            ? RefRel extends keyof Schema['Tables']
              ? R[K]
              : never
            : never
        }
      : never
  }
}

type FindTableFromFkeyName<Schema extends GenericSchema, FKName extends string> = 
{
[TableName in keyof Schema['Tables']]: Schema['Tables'][TableName] extends { Relationships: infer R }
  ? R extends Array<{ foreignKeyName: string }>
    ? FKName extends R[number]['foreignKeyName']
      ? Schema['Tables'][TableName]
      : never
    : never
  : never
}[keyof Schema['Tables']] extends infer TableResult
  ? TableResult extends never
    ? {
      [ViewName in keyof Schema['Views']]: Schema['Views'][ViewName] extends { Relationships: infer R }
        ? R extends Array<{ foreignKeyName: string }>
          ? FKName extends R[number]['foreignKeyName']
            ? Schema['Views'][ViewName]
            : never
          : never
        : never
    }[keyof Schema['Views']]
    : TableResult
  : never

type FindReferencedTableFromFkeyName<Schema extends GenericSchema, FKName extends string> = {
  [TableName in keyof Schema['Tables']]: Schema['Tables'][TableName] extends { Relationships: infer R }
    ? R extends Array<{ foreignKeyName: string; referencedRelation: string }>
      ? FKName extends R[number]['foreignKeyName']
        ? Schema['Tables'][Extract<R[number], { foreignKeyName: FKName }>['referencedRelation']]
        : never
      : never
    : never
}[keyof Schema['Tables']] extends infer Result
  ? Result extends never
    ? never
    : Result
  : never


type FindReferencedViewFromFkeyName<Schema extends GenericSchema, FKName extends string> = {
    [ViewName in keyof Schema['Views']]: Schema['Views'][ViewName] extends { Relationships: infer R }
      ? R extends Array<{ foreignKeyName: string; referencedRelation: string }>
        ? FKName extends R[number]['foreignKeyName']
          ? Schema['Views'][Extract<R[number], { foreignKeyName: FKName }>['referencedRelation']]
          : never
        : never
      : never
  }[keyof Schema['Views']] extends infer Result
    ? Result extends never
      ? never
      : Result
    : never

type FindReferencedRowFromFkeyName<Schema extends GenericSchema, FKName extends string> = 
  FindReferencedTableFromFkeyName<Schema, FKName> extends { Row: Record<string, unknown> }
  ? FindReferencedTableFromFkeyName<Schema, FKName>['Row']
  : FindReferencedViewFromFkeyName<Schema, FKName> extends { Row: Record<string, unknown> }
  ? FindReferencedViewFromFkeyName<Schema, FKName>['Row']
  : never


  type FindOriginTableFromFkeyName<Schema extends GenericSchema, FKName extends string> = {
    [TableName in keyof Schema['Tables']]: Schema['Tables'][TableName] extends { Relationships: infer R }
      ? R extends Array<{ foreignKeyName: string; referencedRelation: string }>
        ? FKName extends R[number]['foreignKeyName']
          ? Schema['Tables'][TableName]
          : never
        : never
      : never
  }[keyof Schema['Tables']] extends infer Result
    ? Result extends never
      ? never
      : Result
    : never
  
  
  type FindOriginViewFromFkeyName<Schema extends GenericSchema, FKName extends string> = {
      [ViewName in keyof Schema['Views']]: Schema['Views'][ViewName] extends { Relationships: infer R }
        ? R extends Array<{ foreignKeyName: string; referencedRelation: string }>
          ? FKName extends R[number]['foreignKeyName']
            ? Schema['Views'][ViewName]
            : never
          : never
        : never
    }[keyof Schema['Views']] extends infer Result
      ? Result extends never
        ? never
        : Result
      : never
  
  type FindOriginRowFromFkeyName<Schema extends GenericSchema, FKName extends string> = 
    FindOriginTableFromFkeyName<Schema, FKName> extends { Row: Record<string, unknown> }
    ? FindOriginTableFromFkeyName<Schema, FKName>['Row']
    : FindOriginViewFromFkeyName<Schema, FKName> extends { Row: Record<string, unknown> }
    ? FindOriginViewFromFkeyName<Schema, FKName>['Row']
    : never
  

type IsColumnsNullable<Table extends { Row: Record<string, unknown> }, Columns extends (keyof Table['Row'])[]> = 
  Columns extends [infer Column, ...infer Rest]
    ? Column extends keyof Table['Row']
      ? ContainsNull<Table['Row'][Column]> extends true
        ? true
        : IsColumnsNullable<Table, Rest extends (keyof Table['Row'])[] ? Rest : []>
      : never
    : false

type IsRelationNullable<Schema extends GenericSchema, FKName extends string> =
  FindTableFromFkeyName<Schema, FKName> extends infer Table
    ? Table extends { Row: Record<string, unknown>, Relationships: unknown[] }
      ? FindMatchingRelationships<FKName, Table['Relationships']> extends { columns: (keyof Table['Row'])[] }
        ? IsColumnsNullable<Table, FindMatchingRelationships<FKName, Table['Relationships']>['columns']>
        : never
      : never
    : never


// Given a referencedRelation name RefRel this type will pull out a list of all the relationships
// that match the referencedRelation across all Tables from the schema
type GetAllReferencedRelations<
  Schema extends GenericSchema,
  RefRel extends string
> = {
  [TableName in keyof Schema['Tables']]: Schema['Tables'][TableName] extends { Relationships: infer R }
    ? R extends Array<{ referencedRelation: string }>
      ? Extract<R[number], { referencedRelation: RefRel }> extends never
        ? never
        : RefRel extends keyof Schema['Tables']
          ? Extract<R[number], { referencedRelation: RefRel }>
          : never
      : never
    : never
}[keyof Schema['Tables']] extends infer Result
  ? Result extends never
    ? []
    : Result extends unknown[]
      ? Result
      : Result extends unknown
        ? [Result]
        : never
  : never

type SchemaWithInferedRelationships<Schema extends GenericSchema, Field extends { original: string }> = TablesAndViews<Schema>[Field['original']] extends {
  Relationships: infer R
}
  ? R
  : unknown

// Will attempt to solve the relation Row based on possibles aliases like:
// foreignKeyName(*) or relationColumnName(*) or relatedTableName(*)
type FindRelationRow<
  Schema extends GenericSchema,
  Field extends { original: string },
  RelationName extends string,
  Relationships
> = 
  // Check if the Field's original name is a foreign key
  IsForeignKeyName<Schema, Field['original']> extends true
  ? 'Field[original]-represent-fkname'
  : IsForeignKeyName<Schema, RelationName> extends true
  ? 'RelationName-represent-fkname'
  : unknown

/**
 * Constructs a type definition for a single field of an object.
 *
 * @param Schema Database schema.
 * @param Row Type of a row in the given table.
 * @param Relationships Relationships between different tables in the database.
 * @param Field Single field parsed by `ParseQuery`.
 */
type ConstructFieldDefinition<
  Schema extends GenericSchema,
  Row extends Record<string, unknown>,
  RelationName,
  Relationships,
  Field
> = IsEmptyOrUnkownObject<Row> extends true
  // If our row is an empty or unknown object, we failed to properly infer the
  // type of our row, this happen in case of implicit aliasing via columns, fkNames or referenced tables alias
  // foreignKeyName(*) or relationColumnName(*) or referencedTable(*)
  // ---------------------------
  // Check if our RelationName match one of our ForeignKeyName
  ? RelationName extends string
    // If it does, use the foreignKey referenced table row as the new Row type
    ? IsForeignKeyName<Schema, RelationName> extends true 
      ? ConstructFieldDefinition<
          Schema,
          FindOriginRowFromFkeyName<Schema, RelationName>,
          RelationName,
          Relationships,
          Field
        >
      : {f: Field, rn: RelationName, rs: Relationships, r: Row, infwithrel: SchemaWithInferedRelationships<Schema, Field>}
  : 'relation-name-is-not-a-string'
  : Field extends { star: true }
  ? Row
  : Field extends { spread: true; original: string; children: unknown[] }
  ? GetResultHelper<
      Schema,
      TablesAndViews<Schema>[Field['original']]['Row'],
      Field['original'],
      SchemaWithInferedRelationships<Schema, Field>,
      Field['children'] & {'branch-unkown-field': true},
      unknown
    >
  : Field extends { children: [] }
  ? {}
  : Field extends { name: string; original: string; hint?: string; children: unknown[] }
  ? {
      [_ in Field['name']]: ConstructFieldWithChildren<
        Schema,
        Field & { 'branch-schema-infered-field': true },
        RelationName,
        Relationships,
        SchemaWithInferedRelationships<Schema, Field>
      >
    }
  : Field extends { name: string; type: infer T }
  ? { [K in Field['name']]: T }
  : Field extends { name: string; original: string }
  ? ConstructSimpleField<Row, Field>
  : Record<string, unknown>

type ConstructFieldWithChildren<
  Schema extends GenericSchema,
  Field extends { name: string; original: string; hint?: string; children: unknown[]; inner?: boolean; left?: boolean },
  RelationName,
  Relationships,
  InferedRelationships
> = GetResultHelper<
  Schema,
  TablesAndViews<Schema>[Field['original']]['Row'],
  Field['original'],
  InferedRelationships,
  Field['children'],
  unknown
> extends infer Child
  ? 'hint' extends keyof Field
    ? ConstructFieldWithHint<Schema, Field & { hint: string }, Relationships, Child>
    : ConstructFieldWithoutHint<Schema, Field, RelationName, Relationships, InferedRelationships, Child>
  : never

type ConstructFieldWithHint<
  Schema extends GenericSchema,
  Field extends { original: string; hint: string; inner?: boolean },
  Relationships,
  Child
> = HasUniqueFKey<Field['hint'], SchemaWithInferedRelationships<Schema, Field>> extends true
  ? Field extends { inner: true }
    ? Child
    : Child | null
  : Relationships extends unknown[]
  ? HasFKey<Field['hint'], Relationships> extends true
    ? Field extends { inner: true }
      ? Child
      : FindMatchingRelationships<Field['hint'], Relationships> extends { foreignKeyName: string }
        ? IsRelationNullable<Schema, FindMatchingRelationships<Field['hint'], Relationships>['foreignKeyName']> extends true 
          ? Child | null
          : Child
        : Child | null
    : HasFKeyMatchingColumn<[Field['hint']], Relationships> extends true
    ? FindMatchingRelationships<Field['hint'], Relationships> extends { foreignKeyName: string }
      ? IsRelationNullable<Schema, FindMatchingRelationships<Field['hint'], Relationships>['foreignKeyName']> extends true 
        ? Child | null
        : Child
      : Child | null
    : // .from('users').select(`first_friend_of:best_friends!best_friends_first_user_fkey(*),second_friend_of:best_friends!best_friends_second_user_fkey(*),third_wheel_of:best_friends!best_friends_third_wheel_fkey(*)`)
      Child[]
  : never

type ConstructFieldWithoutHint<
  Schema extends GenericSchema,
  Field extends { original: string; inner?: boolean; left?: boolean },
  RelationName,
  Relationships,
  InferedRelationships,
  Child
> = HasUniqueFKeyToFRel<RelationName, InferedRelationships> extends true
  ? Field extends { inner: true }
    ? Child
    : Child | null
  : Relationships extends unknown[]
  ? ConstructFieldWithRelationships<Schema, Field, RelationName, Relationships, Child>
  : never

type ConstructFieldWithRelationships<
  Schema extends GenericSchema,
  Field extends { original: string; inner?: boolean; left?: boolean },
  RelationName,
  Relationships,
  Child
> = HasFKeyToFRel<Field['original'], Relationships> extends true
  ? ConstructFieldWithFKeyToFRel<Schema, Field, RelationName, Relationships, Child>
  : ConstructFieldWithoutFKeyToFRel<Schema, Field, RelationName, Relationships, Child>

type ConstructFieldWithFKeyToFRel<
  Schema extends GenericSchema,
  Field extends { original: string; inner?: boolean; left?: boolean },
  RelationName,
  Relationships,
  Child
> = Field extends { inner: true }
  ? Child
  : Field extends { left: true }
  ? HasMultipleFKeysToFRel<Field['original'], Relationships> extends true
    ? RequireHintingSelectQueryError<Field, RelationName>
    : FindFieldMathingRelationships<Field, Relationships> extends { foreignKeyName: string }
      ? IsRelationNullable<Schema, FindFieldMathingRelationships<Field, Relationships>['foreignKeyName']> extends true
        ? Child | null
        : Child
      : Child | null
  : HasMultipleFKeysToFRel<Field['original'], Relationships> extends true
  ? RequireHintingSelectQueryError<Field, RelationName>
  : FindFieldMathingRelationships<Field, Relationships> extends { foreignKeyName: string }
  ? IsRelationNullable<Schema, FindFieldMathingRelationships<Field, Relationships>['foreignKeyName']> extends true
    ? Child | null
    : Child
  : Child | null

type ConstructFieldWithoutFKeyToFRel<
  Schema extends GenericSchema,
  Field extends { original: string },
  RelationName,
  Relationships,
  Child
> = HasMultipleFKeysToFRel<
  RelationName,
  SchemaWithInferedRelationships<Schema, Field>
> extends true
  ? // For 1-M relationships
    RequireHintingSelectQueryError<Field, RelationName>
  : Child extends unknown
  ? ConstructFieldWithUnknownChild<Schema, Field, RelationName, Relationships, Child>
  : never

type IsForeignKeyName<
  Schema extends GenericSchema,
  FKName extends string
> = {
  [TableName in keyof Schema['Tables']]: Schema['Tables'][TableName] extends { Relationships: infer R }
    ? R extends Array<{ foreignKeyName: string }>
      ? FKName extends R[number]['foreignKeyName']
        ? true
        : never
      : never
    : never
}[keyof Schema['Tables']] extends never
  ? false
  : true

type ConstructFieldWithUnknownChild<
  Schema extends GenericSchema,
  Field extends { original: string },
  RelationName,
  Relationships,
  Child
> = 
  // Our Child cannot be infered by previous logic, it's an alias such as
  // reference via a relation table alias
  // reference via a column holding relation alias
  IsEmptyOrUnkownObject<Child> extends true
  // Check if the RelationName is a direct ForeignKey reference
  ? RelationName extends string
    ? IsForeignKeyName<Schema, RelationName> extends true
      ? {type: 'relation-name-is-fk-name',
        f: Field,
        isFkName: IsForeignKeyName<Schema, 'best_friends_first_user_fkey'>
        rname: RelationName, g: FindTableFromFkeyName<Schema, RelationName> }
      : IsForeignKeyName<Schema, Field['original']> extends true
      ? 'field-original-is-fk-name'
      : 'idk'
    : Child[]
  : Child[]
  //   // Try to find relations matching our RelationName
  //   ? GetAllReferencedRelations<Schema, RelationName> extends []
  //     // Check if our Field['original'] match one of our relationship
  //     // either by direct fkname or via column matching or table reference
  //     ? FindMatchingRelationships<Field['original'], GetAllReferencedRelations<Schema, RelationName>> extends {foreignKeyName: string}
  //       ? FindTableFromFkeyName<Schema, Field['original']> extends { Row: Record<string, unknown> }
  //         ? GetResultHelper<
  //             Schema,
  //             FindTableFromFkeyName<Schema, Field['original']>['Row'],
  //             Field['original'],
  //             SchemaWithInferedRelationships<Schema, Field>,
  //             Field extends {'children': unknown[]} ? Field['children'] : [],
  //             unknown
  //           >[]
  //         : Child[]
  //       : Child[]
  //     // If no relations were found referencing RelationName the reference might be
  //     // aliased via Columns name
  //     : FindMatchingRelationships<Field['original'], Relationships> extends { foreignKeyName: string }
  //     // We found a matching relationship, we build our result from the related table
  //     ? FindReferencedTableFromFkeyName<Schema, FindMatchingRelationships<Field['original'], Relationships>['foreignKeyName']> extends { Row: Record<string, unknown> } 
  //     ? GetResultHelper<
  //         Schema,
  //         FindReferencedTableFromFkeyName<Schema, FindMatchingRelationships<Field['original'], Relationships>['foreignKeyName']>['Row'],
  //         Field['original'],
  //         SchemaWithInferedRelationships<Schema, Field>,
  //         Field extends {'children': unknown[]} ? Field['children'] : [],
  //         unknown
  //       >[]
  //     : { rr:  FindReferencedTableFromFkeyName<Schema, FindMatchingRelationships<Field['original'], Relationships>['foreignKeyName']>  }
  //     : 'toto'

  //   : Child[]
  // : Child[]

type ConstructSimpleField<
  Row extends Record<string, unknown>,
  Field extends { name: string; original: string }
> = Field['original'] extends keyof Row
  ? { [K in Field['name']]: Row[Field['original']] }
  : Field['name'] extends keyof Row
  ? { [K in Field['name']]: Row[K] }
  : Field['original'] extends AggregateFunctions
  ? { [K in Field['name']]: number }
  : { r: Row, F: Field, sq: SelectQueryError<`Referencing missing column \`${Field['original']}\``>}


/**
 * Notes: all `Parse*` types assume that their input strings have their whitespace
 * removed. They return tuples of ["Return Value", "Remainder of text"] or
 * a `ParserError`.
 */

/**
 * Reads a consecutive sequence of 1 or more letter, where letters are `[0-9a-zA-Z_]`.
 */
type ReadLetters<Input extends string> = string extends Input
  ? GenericStringError
  : ReadLettersHelper<Input, ''> extends [`${infer Letters}`, `${infer Remainder}`]
  ? Letters extends ''
    ? ParserError<`Expected letter at \`${Input}\``>
    : [Letters, Remainder]
  : ReadLettersHelper<Input, ''>

type ReadLettersHelper<Input extends string, Acc extends string> = string extends Input
  ? GenericStringError
  : Input extends `${infer L}${infer Remainder}`
  ? L extends Letter
    ? ReadLettersHelper<Remainder, `${Acc}${L}`>
    : [Acc, Input]
  : [Acc, '']

/**
 * Reads a consecutive sequence of 1 or more double-quoted letters,
 * where letters are `[^"]`.
 */
type ReadQuotedLetters<Input extends string> = string extends Input
  ? GenericStringError
  : Input extends `"${infer Remainder}`
  ? ReadQuotedLettersHelper<Remainder, ''> extends [`${infer Letters}`, `${infer Remainder}`]
    ? Letters extends ''
      ? ParserError<`Expected string at \`${Remainder}\``>
      : [Letters, Remainder]
    : ReadQuotedLettersHelper<Remainder, ''>
  : ParserError<`Not a double-quoted string at \`${Input}\``>

type ReadQuotedLettersHelper<Input extends string, Acc extends string> = string extends Input
  ? GenericStringError
  : Input extends `${infer L}${infer Remainder}`
  ? L extends '"'
    ? [Acc, Remainder]
    : ReadQuotedLettersHelper<Remainder, `${Acc}${L}`>
  : ParserError<`Missing closing double-quote in \`"${Acc}${Input}\``>

/**
 * Parses a (possibly double-quoted) identifier.
 * Identifiers are sequences of 1 or more letters.
 */
type ParseIdentifier<Input extends string> = ReadLetters<Input> extends [
  infer Name,
  `${infer Remainder}`
]
  ? [Name, `${Remainder}`]
  : ReadQuotedLetters<Input> extends [infer Name, `${infer Remainder}`]
  ? [Name, `${Remainder}`]
  : ParserError<`No (possibly double-quoted) identifier at \`${Input}\``>

/**
 * Parses a field without preceding field renaming.
 * A field is one of the following:
 * - a field with an embedded resource
 *   - `field(nodes)`
 *   - `field!hint(nodes)`
 *   - `field!inner(nodes)`
 *   - `field!left(nodes)`
 *   - `field!hint!inner(nodes)`
 * - a field without an embedded resource (see {@link ParseFieldWithoutEmbeddedResource})
 */
type ParseField<Input extends string> = Input extends ''
  ? ParserError<'Empty string'>
  : ParseIdentifier<Input> extends [infer Name, `${infer Remainder}`]
  ? EatWhitespace<Remainder> extends `!inner${infer Remainder}`
    ? ParseEmbeddedResource<EatWhitespace<Remainder>> extends [infer Fields, `${infer Remainder}`]
      ? // `field!inner(nodes)`
        [
          {
            name: Name
            original: Name
            children: Fields
            inner: true
            parseFieldBranch: 'field!inner(nodes)'
          },
          EatWhitespace<Remainder>
        ]
      : CreateParserErrorIfRequired<
          ParseEmbeddedResource<EatWhitespace<Remainder>>,
          'Expected embedded resource after `!inner`'
        >
    : EatWhitespace<Remainder> extends `!left${infer Remainder}`
    ? ParseEmbeddedResource<EatWhitespace<Remainder>> extends [infer Fields, `${infer Remainder}`]
      ? // `field!left(nodes)`
        [
          {
            name: Name
            original: Name
            children: Fields
            left: true
            parseFieldBranch: 'field!left(nodes)'
          },
          EatWhitespace<Remainder>
        ]
      : CreateParserErrorIfRequired<
          ParseEmbeddedResource<EatWhitespace<Remainder>>,
          'Expected embedded resource after `!left`'
        >
    : EatWhitespace<Remainder> extends `!${infer Remainder}`
    ? ParseIdentifier<EatWhitespace<Remainder>> extends [infer Hint, `${infer Remainder}`]
      ? EatWhitespace<Remainder> extends `!inner${infer Remainder}`
        ? ParseEmbeddedResource<EatWhitespace<Remainder>> extends [
            infer Fields,
            `${infer Remainder}`
          ]
          ? // `field!hint!inner(nodes)`
            [
              {
                name: Name
                original: Name
                hint: Hint
                children: Fields
                inner: true
                parseFieldBranch: 'field!hint!inner(nodes)'
              },
              EatWhitespace<Remainder>
            ]
          : CreateParserErrorIfRequired<
              ParseEmbeddedResource<EatWhitespace<Remainder>>,
              'Expected embedded resource after `!inner`'
            >
        : ParseEmbeddedResource<EatWhitespace<Remainder>> extends [
            infer Fields,
            `${infer Remainder}`
          ]
        ? // `field!hint(nodes)`
          [
            {
              name: Name
              original: Name
              hint: Hint
              children: Fields
              parseFieldBranch: 'field!hint(nodes)'
            },
            EatWhitespace<Remainder>
          ]
        : CreateParserErrorIfRequired<
            ParseEmbeddedResource<EatWhitespace<Remainder>>,
            'Expected embedded resource after `!hint`'
          >
      : ParserError<'Expected identifier after `!`'>
    : ParseEmbeddedResource<EatWhitespace<Remainder>> extends [infer Fields, `${infer Remainder}`]
    ? // `field(nodes)`
      [
        { name: Name; original: Name; children: Fields; parseFieldBranch: 'field(nodes)' },
        EatWhitespace<Remainder>
      ]
    : ParseEmbeddedResource<EatWhitespace<Remainder>> extends ParserError<string>
    ? // Return error if start of embedded resource was detected but not found.
      ParseEmbeddedResource<EatWhitespace<Remainder>>
    : // Otherwise try to match a field without embedded resource.
      ParseFieldWithoutEmbeddedResource<Input>
  : ParserError<`Expected identifier at \`${Input}\``>

/**
 * Parses a field excluding embedded resources, without preceding field renaming.
 * This is one of the following:
 * - `field`
 * - `field.aggregate()`
 * - `field.aggregate()::type`
 * - `field::type`
 * - `field::type.aggregate()`
 * - `field::type.aggregate()::type`
 * - `field->json...`
 * - `field->json.aggregate()`
 * - `field->json.aggregate()::type`
 * - `field->json::type`
 * - `field->json::type.aggregate()`
 * - `field->json::type.aggregate()::type`
 */
type ParseFieldWithoutEmbeddedResource<Input extends string> =
  ParseFieldWithoutEmbeddedResourceAndAggregation<Input> extends [infer Field, `${infer Remainder}`]
    ? ParseFieldAggregation<EatWhitespace<Remainder>> extends [
        `${infer AggregateFunction}`,
        `${infer Remainder}`
      ]
      ? ParseFieldTypeCast<EatWhitespace<Remainder>> extends [infer Type, `${infer Remainder}`]
        ? // `field.aggregate()::type`
          [
            Omit<Field, 'name' | 'original' | 'type'> & {
              name: AggregateFunction
              original: AggregateFunction
              type: Type
              parseFieldWithoutEmbeddedResourceBranch: 'field.aggregate()::type'
            },
            EatWhitespace<Remainder>
          ]
        : ParseFieldTypeCast<EatWhitespace<Remainder>> extends ParserError<string>
        ? ParseFieldTypeCast<EatWhitespace<Remainder>>
        : // `field.aggregate()`
          [
            Omit<Field, 'name' | 'original'> & {
              name: AggregateFunction
              original: AggregateFunction
              parseFieldWithoutEmbeddedResourceBranch: 'field.aggregate()'
            },
            EatWhitespace<Remainder>
          ]
      : ParseFieldAggregation<EatWhitespace<Remainder>> extends ParserError<string>
      ? ParseFieldAggregation<EatWhitespace<Remainder>>
      : // `field`
        [Field & { parseFieldWithoutEmbeddedResourceBranch: 'field' }, EatWhitespace<Remainder>]
    : CreateParserErrorIfRequired<
        ParseFieldWithoutEmbeddedResourceAndAggregation<Input>,
        `Expected field at \`${Input}\``
      >

/**
 * Parses a field excluding embedded resources or aggregation, without preceding field renaming.
 * This is one of the following:
 * - `field`
 * - `field::type`
 * - `field->json...`
 * - `field->json...::type`
 */
type ParseFieldWithoutEmbeddedResourceAndAggregation<Input extends string> =
  ParseFieldWithoutEmbeddedResourceAndTypeCast<Input> extends [infer Field, `${infer Remainder}`]
    ? ParseFieldTypeCast<EatWhitespace<Remainder>> extends [infer Type, `${infer Remainder}`]
      ? // `field::type` or `field->json...::type`
        [
          Omit<Field, 'type'> & {
            type: Type
            parseFieldWithoutEmbeddedResourceAndAggregationBranch: 'field::type or field->json...::type'
          },
          EatWhitespace<Remainder>
        ]
      : ParseFieldTypeCast<EatWhitespace<Remainder>> extends ParserError<string>
      ? ParseFieldTypeCast<EatWhitespace<Remainder>>
      : // `field` or `field->json...`
        [
          Field & {
            parseFieldWithoutEmbeddedResourceAndAggregationBranch: 'field or field->json...'
          },
          EatWhitespace<Remainder>
        ]
    : CreateParserErrorIfRequired<
        ParseFieldWithoutEmbeddedResourceAndTypeCast<Input>,
        `Expected field at \`${Input}\``
      >

/**
 * Parses a field excluding embedded resources or typecasting, without preceding field renaming.
 * This is one of the following:
 * - `field`
 * - `field->json...`
 */
type ParseFieldWithoutEmbeddedResourceAndTypeCast<Input extends string> =
  ParseIdentifier<Input> extends [infer Name, `${infer Remainder}`]
    ? ParseJsonAccessor<EatWhitespace<Remainder>> extends [
        infer PropertyName,
        infer PropertyType,
        `${infer Remainder}`
      ]
      ? // `field->json...`
        [
          {
            name: PropertyName
            original: PropertyName
            type: PropertyType
            parseFieldWithoutEmbeddedResourceAndTypeCastBranch: 'field->json...'
          },
          EatWhitespace<Remainder>
        ]
      : // `field`
        [
          {
            name: Name
            original: Name
            parseFieldWithoutEmbeddedResourceAndTypeCastBranch: 'field'
          },
          EatWhitespace<Remainder>
        ]
    : ParserError<`Expected field at \`${Input}\``>

/**
 * Parses a field typecast (`::type`), returning a tuple of ["Type", "Remainder of text"]
 * or the original string input indicating that no typecast was found.
 */
type ParseFieldTypeCast<Input extends string> = EatWhitespace<Input> extends `::${infer Remainder}`
  ? ParseIdentifier<EatWhitespace<Remainder>> extends [`${infer CastType}`, `${infer Remainder}`]
    ? // Ensure that `CastType` is a valid type.
      CastType extends PostgreSQLTypes
      ? [
          TypeScriptTypes<CastType>,
          EatWhitespace<Remainder>
        ]
      : ParserError<`Invalid type for \`::\` operator \`${CastType}\``>
    : ParserError<`Invalid type for \`::\` operator at \`${Remainder}\``>
  : Input

/**
 * Parses a field aggregation (`.max()`), returning a tuple of ["Aggregate function", "Remainder of text"]
 * or the original string input indicating that no aggregation was found.
 */
type ParseFieldAggregation<Input extends string> =
  EatWhitespace<Input> extends `.${infer Remainder}`
    ? ParseIdentifier<EatWhitespace<Remainder>> extends [
        `${infer FunctionName}`,
        `${infer Remainder}`
      ]
      ? // Ensure that aggregation function is valid.
        FunctionName extends AggregateFunctions
        ? EatWhitespace<Remainder> extends `()${infer Remainder}`
          ? [FunctionName, EatWhitespace<Remainder>]
          : ParserError<`Expected \`()\` after \`.\` operator \`${FunctionName}\``>
        : ParserError<`Invalid type for \`.\` operator \`${FunctionName}\``>
      : ParserError<`Invalid type for \`.\` operator at \`${Remainder}\``>
    : Input

/**
 * Parses a node.
 * A node is one of the following:
 * - `*`
 * - a field, as defined above
 * - a renamed field, `renamed_field:field`
 * - a spread field, `...field`
 */
type ParseNode<Input extends string> = Input extends ''
  ? ParserError<'Empty string'>
  : // `*`
  Input extends `*${infer Remainder}`
  ? [{ star: true }, EatWhitespace<Remainder>]
  : // `...field`
  Input extends `...${infer Remainder}`
  ? ParseField<EatWhitespace<Remainder>> extends [infer Field, `${infer Remainder}`]
    ? Field extends { children: unknown[] }
      ? [
          Prettify<{ spread: true } & Field> & { parseNodeBranch: '...field' },
          EatWhitespace<Remainder>
        ]
      : ParserError<'Unable to parse spread resource'>
    : ParserError<'Unable to parse spread resource'>
  : ParseIdentifier<Input> extends [infer Name, `${infer Remainder}`]
  ? EatWhitespace<Remainder> extends `::${infer _Remainder}`
    ? // `field::`
      // Special case to detect type-casting before renaming.
      ParseField<Input>
    : EatWhitespace<Remainder> extends `:${infer Remainder}`
    ? // `renamed_field:`
      ParseField<EatWhitespace<Remainder>> extends [infer Field, `${infer Remainder}`]
      ? Field extends { name: string }
        ? [
            Prettify<Omit<Field, 'name'> & { name: Name; parseNodeBranch: 'renamed_field:field' }>,
            EatWhitespace<Remainder>
          ]
        : ParserError<`Unable to parse renamed field`>
      : ParserError<`Unable to parse renamed field`>
    : // Otherwise, just parse it as a field without renaming.
      ParseField<Input> & { parseNodeBranch: 'field' }
  : ParserError<`Expected identifier at \`${Input}\``>

/**
 * Parses a JSON property accessor of the shape `->a->b->c`. The last accessor in
 * the series may convert to text by using the ->> operator instead of ->.
 *
 * Returns a tuple of ["Last property name", "Last property type", "Remainder of text"]
 * or the original string input indicating that no opening `->` was found.
 */
type ParseJsonAccessor<Input extends string> = Input extends `->${infer Remainder}`
  ? Remainder extends `>${infer Remainder}`
    ? ParseIdentifier<Remainder> extends [infer Name, `${infer Remainder}`]
      ? [Name, string, EatWhitespace<Remainder>]
      : ParserError<'Expected property name after `->>`'>
    : ParseIdentifier<Remainder> extends [infer Name, `${infer Remainder}`]
    ? ParseJsonAccessor<Remainder> extends [
        infer PropertyName,
        infer PropertyType,
        `${infer Remainder}`
      ]
      ? [PropertyName, PropertyType, EatWhitespace<Remainder>]
      : [Name, Json, EatWhitespace<Remainder>]
    : ParserError<'Expected property name after `->`'>
  : Input

/**
 * Parses an embedded resource, which is an opening `(`, followed by a sequence of
 * 0 or more nodes separated by `,`, then a closing `)`.
 *
 * Returns a tuple of ["Parsed fields", "Remainder of text"], an error,
 * or the original string input indicating that no opening `(` was found.
 */
type ParseEmbeddedResource<Input extends string> = Input extends `(${infer Remainder}`
  ? ParseNodes<EatWhitespace<Remainder>> extends [infer Fields, `${infer Remainder}`]
    ? EatWhitespace<Remainder> extends `)${infer Remainder}`
      ? [Fields, EatWhitespace<Remainder>]
      : ParserError<`Expected ")"`>
    : // If no nodes were detected, check for `)` for empty embedded resources `()`.
    ParseNodes<EatWhitespace<Remainder>> extends ParserError<string>
    ? EatWhitespace<Remainder> extends `)${infer Remainder}`
      ? [[], EatWhitespace<Remainder>]
      : ParseNodes<EatWhitespace<Remainder>>
    : ParserError<'Expected embedded resource fields or `)`'>
  : Input
/**
 * Parses a sequence of nodes, separated by `,`.
 *
 * Returns a tuple of ["Parsed fields", "Remainder of text"] or an error.
 */
type ParseNodes<Input extends string> = string extends Input
  ? GenericStringError
  : ParseNodesHelper<Input, []>

type ParseNodesHelper<Input extends string, Fields extends unknown[]> = ParseNode<Input> extends [
  infer Field,
  `${infer Remainder}`
]
  ? EatWhitespace<Remainder> extends `,${infer Remainder}`
    ? ParseNodesHelper<EatWhitespace<Remainder>, [Field, ...Fields]>
    : [[Field, ...Fields], EatWhitespace<Remainder>]
  : ParseNode<Input>

/**
 * Parses a query.
 * A query is a sequence of nodes, separated by `,`, ensuring that there is
 * no remaining input after all nodes have been parsed.
 *
 * Returns an array of parsed nodes, or an error.
 */
type ParseQuery<Query extends string> = string extends Query
  ? GenericStringError
  : ParseNodes<EatWhitespace<Query>> extends [infer Fields, `${infer Remainder}`]
  ? EatWhitespace<Remainder> extends ''
    ? Fields
    : ParserError<`Unexpected input: ${Remainder}`>
  : ParseNodes<EatWhitespace<Query>>

type GetResultHelper<
  Schema extends GenericSchema,
  Row extends Record<string, unknown>,
  RelationName,
  Relationships,
  Fields extends unknown[],
  Acc
> = Fields extends [infer R]
  ? ConstructFieldDefinition<Schema, Row, RelationName, Relationships, R> extends SelectQueryError<
      infer E
    >
    ? SelectQueryError<E>
    : GetResultHelper<
        Schema,
        Row,
        RelationName,
        Relationships,
        [],
        ConstructFieldDefinition<Schema, Row, RelationName, Relationships, R> & Acc
      >
  : Fields extends [infer R, ...infer Rest]
  ? ConstructFieldDefinition<Schema, Row, RelationName, Relationships, R> extends SelectQueryError<
      infer E
    >
    ? SelectQueryError<E>
    : GetResultHelper<
        Schema,
        Row,
        RelationName,
        Relationships,
        Rest,
        ConstructFieldDefinition<Schema, Row, RelationName, Relationships, R> & Acc
      >
  : Prettify<Acc>

/**
 * Constructs a type definition for an object based on a given PostgREST query.
 *
 * @param Schema Database schema.
 * @param Row Type of a row in the given table.
 * @param Relationships Relationships between different tables in the database.
 * @param Query Select query string literal to parse.
 */
export type GetResult<
  Schema extends GenericSchema,
  Row extends Record<string, unknown>,
  RelationName,
  Relationships,
  Query extends string
> = ParseQuery<Query> extends unknown[]
  ? GetResultHelper<Schema, Row, RelationName, Relationships, ParseQuery<Query>, unknown>
  : ParseQuery<Query>
