// Credits to @bnjmnt4n (https://www.npmjs.com/package/postgrest-query)
// See https://github.com/PostgREST/postgrest/blob/2f91853cb1de18944a4556df09e52450b881cfb3/src/PostgREST/ApiRequest/QueryParams.hs#L282-L284

import type { AggregateFunctions, AggregateWithoutColumnFunctions, PostgreSQLTypes } from './types'

/**
 * Parses a query.
 * A query is a sequence of nodes, separated by `,`, ensuring that there is
 * no remaining input after all nodes have been parsed.
 *
 * Returns an array of parsed nodes, or an error.
 */
export type ParseQuery<Query extends string> = string extends Query
  ? GenericStringError
  : ParseNodes<EatWhitespace<Query>> extends [infer Nodes extends Ast.Node[], `${infer Remainder}`]
  ? EatWhitespace<Remainder> extends ''
    ? Nodes
    : ParserError<`Unexpected input: ${Remainder}`>
  : ParseNodes<EatWhitespace<Query>>

/**
 * Parser errors.
 */
export type ParserError<Message extends string> = { error: true } & Message
type GenericStringError = ParserError<'Received a generic string'>

/**
 * Parses a (possibly double-quoted) identifier.
 * Identifiers are sequences of 1 or more letters.
 */
type ParseIdentifier<Input extends string> = ReadLetters<Input> extends [
  infer Name extends string,
  `${infer Remainder}`
]
  ? [{ type: 'Identifier'; name: Name }, `${Remainder}`]
  : ReadQuotedLetters<Input> extends [infer Name extends string, `${infer Remainder}`]
  ? [{ type: 'Identifier'; name: Name }, `${Remainder}`]
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
  : ParseIdentifier<Input> extends [infer IdNode extends Ast.IdentifierNode, `${infer Remainder}`]
  ? EatWhitespace<Remainder> extends `!inner${infer Rest}`
    ? ParseEmbeddedResource<EatWhitespace<Rest>> extends [
        infer Children extends Ast.Node[],
        `${infer Remainder}`
      ]
      ? [
          Ast.FieldNode & {
            type: 'Field'
            name: IdNode['name']
            inner: true
            children: Children
          },
          EatWhitespace<Remainder>
        ]
      : CreateParserErrorIfRequired<
          ParseEmbeddedResource<EatWhitespace<Rest>>,
          'Expected embedded resource after `!inner`'
        >
    : EatWhitespace<Remainder> extends `!left${infer Rest}`
    ? ParseEmbeddedResource<EatWhitespace<Rest>> extends [
        infer Children extends Ast.Node[],
        `${infer Remainder}`
      ]
      ? [
          Ast.FieldNode & {
            type: 'Field'
            name: IdNode['name']
            left: true
            children: Children
          },
          EatWhitespace<Remainder>
        ]
      : CreateParserErrorIfRequired<
          ParseEmbeddedResource<EatWhitespace<Rest>>,
          'Expected embedded resource after `!left`'
        >
    : EatWhitespace<Remainder> extends `!${infer Rest}`
    ? ParseIdentifier<EatWhitespace<Rest>> extends [
        infer HintIdNode extends Ast.IdentifierNode,
        `${infer Remainder}`
      ]
      ? EatWhitespace<Remainder> extends `!inner${infer InnerRest}`
        ? ParseEmbeddedResource<EatWhitespace<InnerRest>> extends [
            infer Children extends Ast.Node[],
            `${infer Remainder}`
          ]
          ? [
              Ast.FieldNode & {
                type: 'Field'
                name: IdNode['name']
                hint: HintIdNode['name']
                inner: true
                children: Children
              },
              EatWhitespace<Remainder>
            ]
          : CreateParserErrorIfRequired<
              ParseEmbeddedResource<EatWhitespace<InnerRest>>,
              'Expected embedded resource after `!inner`'
            >
        : ParseEmbeddedResource<EatWhitespace<Remainder>> extends [
            infer Children extends Ast.Node[],
            `${infer Remainder}`
          ]
        ? [
            Ast.FieldNode & {
              type: 'Field'
              name: IdNode['name']
              hint: HintIdNode['name']
              children: Children
            },
            EatWhitespace<Remainder>
          ]
        : CreateParserErrorIfRequired<
            ParseEmbeddedResource<EatWhitespace<Remainder>>,
            'Expected embedded resource after `!hint`'
          >
      : ParserError<`Expected identifier after '!' at ${Rest}`>
    : ParseEmbeddedResource<EatWhitespace<Remainder>> extends [
        infer Children extends Ast.Node[],
        `${infer Remainder}`
      ]
    ? [
        Ast.FieldNode & {
          type: 'Field'
          name: IdNode['name']
          children: Children
        },
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
  ParseFieldWithoutEmbeddedResourceAndAggregation<Input> extends [
    infer Field extends Ast.FieldNode,
    `${infer Remainder}`
  ]
    ? ParseFieldAggregation<EatWhitespace<Remainder>, false> extends [
        infer AggregateFunction extends AggregateFunctions,
        `${infer Remainder}`
      ]
      ? [
          Ast.FieldNode & {
            type: 'Field'
            name: AggregateFunction
            aggregateFunction: AggregateFunction
          },
          EatWhitespace<Remainder>
        ]
      : ParseFieldAggregation<EatWhitespace<Remainder>, true> extends [
          infer AggregateFunction extends AggregateFunctions,
          `${infer Remainder}`
        ]
      ? ParseFieldTypeCast<EatWhitespace<Remainder>> extends [
          infer CastType extends PostgreSQLTypes,
          `${infer Remainder}`
        ]
        ? [
            Ast.FieldNode & {
              type: 'Field'
              name: Field['name']
              alias?: Field['alias']
              hint?: Field['hint']
              inner?: Field['inner']
              left?: Field['left']
              children?: Field['children']
              aggregateFunction: AggregateFunction
              castType: CastType
            },
            EatWhitespace<Remainder>
          ]
        : ParseFieldTypeCast<EatWhitespace<Remainder>> extends ParserError<infer E>
        ? ParserError<E>
        : [
            Ast.FieldNode & {
              type: 'Field'
              name: Field['name']
              alias?: Field['alias']
              hint?: Field['hint']
              inner?: Field['inner']
              left?: Field['left']
              children?: Field['children']
              aggregateFunction: AggregateFunction
            },
            EatWhitespace<Remainder>
          ]
      : ParseFieldAggregation<EatWhitespace<Remainder>, true> extends ParserError<infer E>
      ? ParserError<E>
      : [Field, EatWhitespace<Remainder>]
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
  ParseFieldWithoutEmbeddedResourceAndTypeCast<Input> extends [
    infer Field extends Ast.FieldNode,
    `${infer Remainder}`
  ]
    ? ParseFieldTypeCast<EatWhitespace<Remainder>> extends [
        infer CastType extends PostgreSQLTypes,
        `${infer Remainder}`
      ]
      ? [
          Ast.FieldNode & {
            type: 'Field'
            name: Field['name']
            alias?: Field['alias']
            hint?: Field['hint']
            inner?: Field['inner']
            left?: Field['left']
            children?: Field['children']
            castType: CastType
          },
          EatWhitespace<Remainder>
        ]
      : ParseFieldTypeCast<EatWhitespace<Remainder>> extends ParserError<string>
      ? ParseFieldTypeCast<EatWhitespace<Remainder>>
      : [Field, EatWhitespace<Remainder>]
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
  ParseIdentifier<Input> extends [infer IdNode extends Ast.IdentifierNode, `${infer Remainder}`]
    ? ParseJsonAccessor<EatWhitespace<Remainder>> extends [
        infer JsonFieldName extends string,
        infer JsonFieldType,
        `${infer Remainder}`
      ]
      ? [
          Ast.FieldNode & {
            type: 'Field'
            name: IdNode['name']
            alias: JsonFieldName
            castType: JsonFieldType
          },
          EatWhitespace<Remainder>
        ]
      : [
          Ast.FieldNode & {
            type: 'Field'
            name: IdNode['name']
          },
          EatWhitespace<Remainder>
        ]
    : ParserError<`Expected field at \`${Input}\``>

/**
 * Parses a field typecast (`::type`), returning a tuple of [CastType, Remainder]
 * or the original string input indicating that no typecast was found.
 */
type ParseFieldTypeCast<Input extends string> = EatWhitespace<Input> extends `::${infer Remainder}`
  ? ParseIdentifier<EatWhitespace<Remainder>> extends [
      infer TypeIdNode extends Ast.IdentifierNode,
      `${infer Remainder}`
    ]
    ? // Ensure that `CastType` is a valid PostgreSQL type.
      TypeIdNode['name'] extends PostgreSQLTypes
      ? [TypeIdNode['name'], EatWhitespace<Remainder>]
      : // We will never enter those conditions as PostgresSQLTypes have string in the union
        // that will match anything for custom types handling
        // TODO: extract the custom_types from the database and check that the
        // cast is actually a valid type
        ParserError<`Invalid type for \`::\` operator \`${TypeIdNode['name']}\``>
    : ParserError<`Invalid type for \`::\` operator at \`${Remainder}\``>
  : Input

/**
 * Parses a field aggregation (`.max()`), returning a tuple of [AggregateFunction, Remainder]
 * or the original string input indicating that no aggregation was found.
 */
type ParseFieldAggregation<
  Input extends string,
  IsField extends boolean = false
> = IsField extends true
  ? EatWhitespace<Input> extends `.${infer Remainder}`
    ? ParseIdentifier<EatWhitespace<Remainder>> extends [
        infer FuncIdNode extends Ast.IdentifierNode,
        `${infer Remainder}`
      ]
      ? FuncIdNode['name'] extends AggregateFunctions
        ? EatWhitespace<Remainder> extends `()${infer Remainder}`
          ? [FuncIdNode['name'], EatWhitespace<Remainder>]
          : ParserError<`Expected \`()\` after \`.\` operator \`${FuncIdNode['name']}\``>
        : ParserError<`Invalid function for \`.\` operator \`${FuncIdNode['name']}\``>
      : ParserError<`Invalid function for \`.\` operator at \`${Remainder}\``>
    : Input
  : // Check if the function is just count or count()
  ParseIdentifier<Input> extends [infer FuncIdNode extends Ast.IdentifierNode, `${infer Remainder}`]
  ? FuncIdNode['name'] extends AggregateWithoutColumnFunctions
    ? EatWhitespace<Remainder> extends `()${infer Remainder}`
      ? [FuncIdNode['name'], EatWhitespace<Remainder>]
      : [FuncIdNode['name'], EatWhitespace<Remainder>]
    : Input
  : Input

/**
 * Parses a node.
 * A node is one of the following:
 * - `*`
 * - a field, as defined above
 * - a renamed field, `alias:field`
 * - a spread field, `...field`
 */
type ParseNode<Input extends string, NodesInput extends string> = Input extends ''
  ? ParserError<'Empty string'>
  : Input extends `*${infer Remainder}`
  ? [
      Ast.StarNode & {
        type: 'Star'
      },
      EatWhitespace<Remainder>
    ]
  : Input extends `...${infer Rest}`
  ? ParseField<EatWhitespace<Rest>> extends [
      infer TargetField extends Ast.FieldNode,
      `${infer Remainder}`
    ]
    ? [
        Ast.SpreadNode & {
          type: 'Spread'
          target: TargetField
        },
        EatWhitespace<Remainder>
      ]
    : ParserError<`Unable to parse spread resource at ${NodesInput}`>
  : ParseIdentifier<Input> extends [
      infer AliasIdNode extends Ast.IdentifierNode,
      `${infer Remainder}`
    ]
  ? EatWhitespace<Remainder> extends `::${infer _Rest}`
    ? // If we find '::', it's a type cast, so treat it as part of the field
      ParseField<Input>
    : EatWhitespace<Remainder> extends `:${infer Rest}`
    ? // This is for the case where the aggregate function is count since it can be
      // called at top level withtout any mention of a column we need to repeat it to
      // preserve the aggregateFunction litteral
      ParseFieldAggregation<Rest, false> extends [
        infer AggregateFunction extends AggregateFunctions,
        `${infer Remainder}`
      ]
      ? [
          {
            type: 'Field'
            name: AggregateFunction
            alias: AliasIdNode['name']
            aggregateFunction: AggregateFunction
          },
          EatWhitespace<Remainder>
        ]
      : ParseField<EatWhitespace<Rest>> extends [
          infer Field extends Ast.FieldNode,
          `${infer Remainder}`
        ]
      ? [
          Ast.FieldNode & {
            type: 'Field'
            name: Field['name']
            alias: AliasIdNode['name']
            hint?: Field['hint']
            inner?: Field['inner']
            left?: Field['left']
            children?: Field['children']
            castType?: Field['castType']
            aggregateFunction?: Field['aggregateFunction']
          },
          EatWhitespace<Remainder>
        ]
      : ParserError<`Unable to parse renamed field at ${NodesInput}`>
    : // This is for the case where the aggregate function is count since it can be
    // called at top level withtout any mention of a column
    ParseFieldAggregation<Input, false> extends [
        infer AggregateFunction extends AggregateFunctions,
        `${infer Remainder}`
      ]
    ? [
        {
          type: 'Field'
          name: AggregateFunction
          aggregateFunction: AggregateFunction
        },
        EatWhitespace<Remainder>
      ]
    : ParseField<Input>
  : ParserError<`Expected identifier at \`${NodesInput}\``>

/**
 * Parses a JSON property accessor of the shape `->a->b->c`. The last accessor in
 * the series may convert to text by using the ->> operator instead of ->.
 *
 * Returns a tuple of [PropertyName, PropertyType, Remainder]
 * or the original string input indicating that no opening `->` was found.
 */
type ParseJsonAccessor<Input extends string> = EatWhitespace<Input> extends `->${infer Remainder}`
  ? EatWhitespace<Remainder> extends `>${infer Rest}`
    ? ParseIdentifier<EatWhitespace<Rest>> extends [
        infer NameIdNode extends Ast.IdentifierNode,
        `${infer Remainder}`
      ]
      ? // In the case of a ->> the result will be casted as text by default
        [NameIdNode['name'], 'text', EatWhitespace<Remainder>]
      : ParserError<`Expected property name after '->>'${Rest}`>
    : ParseIdentifier<EatWhitespace<Remainder>> extends [
        infer NameIdNode extends Ast.IdentifierNode,
        `${infer Remainder}`
      ]
    ? ParseJsonAccessor<Remainder> extends [
        infer PropertyName extends string,
        infer PropertyType,
        `${infer Remainder}`
      ]
      ? [PropertyName, PropertyType, EatWhitespace<Remainder>]
      : // With a -> accessor result will be casted as Json type
        [NameIdNode['name'], 'json', EatWhitespace<Remainder>]
    : ParserError<`Expected property name after '->' at ${Remainder}`>
  : Input

/**
 * Parses an embedded resource, which is an opening `(`, followed by a sequence of
 * 0 or more nodes separated by `,`, then a closing `)`.
 *
 * Returns a tuple of [Fields, Remainder], an error,
 * or the original string input indicating that no opening `(` was found.
 */
type ParseEmbeddedResource<Input extends string> =
  EatWhitespace<Input> extends `(${infer Remainder}`
    ? ParseNodes<EatWhitespace<Remainder>> extends [
        infer Nodes extends Ast.Node[],
        `${infer Remainder}`
      ]
      ? EatWhitespace<Remainder> extends `)${infer Remainder}`
        ? [Nodes, EatWhitespace<Remainder>]
        : ParserError<`Expected ')' at ${Remainder}`>
      : // If no nodes were detected, check for `)` for empty embedded resources `()`.
      ParseNodes<EatWhitespace<Remainder>> extends ParserError<string>
      ? EatWhitespace<Remainder> extends `)${infer Remainder}`
        ? [[], EatWhitespace<Remainder>]
        : ParseNodes<EatWhitespace<Remainder>>
      : ParserError<`Expected embedded resource fields or ')' at ${Remainder}`>
    : Input

/**
 * Parses a sequence of nodes, separated by `,`.
 *
 * Returns a tuple of [Nodes, Remainder] or an error.
 */
type ParseNodes<Input extends string> = string extends Input
  ? GenericStringError
  : ParseNodesHelper<Input, [], Input>

type ParseNodesHelper<
  Input extends string,
  Nodes extends Ast.Node[],
  NodesInput extends string
> = ParseNode<Input, NodesInput> extends [infer NodeResult extends Ast.Node, `${infer Remainder}`]
  ? EatWhitespace<Remainder> extends `,${infer Rest}`
    ? ParseNodesHelper<EatWhitespace<Rest>, [...Nodes, NodeResult], NodesInput>
    : [[...Nodes, NodeResult], EatWhitespace<Remainder>]
  : ParseNode<Input, NodesInput>

// Some utils type for the ParseQuery parser logic
// Count is a special case where an aggregate function won't need a column to be run against
// see: https://postgrest.org/en/v12/references/api/aggregate_functions.html#the-case-of-count
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

/**
 * Reads a consecutive sequence of 1 or more letters, where letters are `[0-9a-zA-Z_]`.
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
 * Creates a new {@link ParserError} if the given input is not already a parser error.
 */
type CreateParserErrorIfRequired<Input, Message extends string> = Input extends ParserError<string>
  ? Input
  : ParserError<Message>

type Whitespace = ' ' | '\n' | '\t'

/**
 * Trims whitespace from the left of the input.
 */
type EatWhitespace<Input extends string> = string extends Input
  ? GenericStringError
  : Input extends `${Whitespace}${infer Remainder}`
  ? EatWhitespace<Remainder>
  : Input

export namespace Ast {
  export interface IdentifierNode {
    type: 'Identifier'
    name: string
  }

  export interface FieldNode {
    type: 'Field'
    name: string
    alias?: string
    hint?: unknown
    inner?: boolean
    left?: boolean
    children?: unknown
    aggregateFunction?: AggregateFunctions
    castType?: PostgreSQLTypes
  }

  export interface StarNode {
    type: 'Star'
  }

  export interface SpreadNode {
    type: 'Spread'
    target: FieldNode
  }

  export type Node = IdentifierNode | FieldNode | StarNode | SpreadNode
}
