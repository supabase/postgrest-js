import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { Database } from './types.override'
import { rpcQueries } from './advanced_rpc'
import { SelectQueryError } from '../src/select-query-parser/utils'

type Schema = Database['public']

{
  const { data } = await rpcQueries['function returning a setof embeded table']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Tables']['messages']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['function double definition returning a setof embeded table']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Tables']['messages']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['function returning a single row embeded table']
  let result: Exclude<typeof data, null>
  let expected: Schema['Tables']['user_profiles']['Row']
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['function with scalar input']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Tables']['messages']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['function with table row input']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Tables']['messages']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['function with view row input']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Tables']['messages']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['function returning view']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Views']['recent_messages']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['function with scalar input returning view']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Views']['recent_messages']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['function with scalar input with followup select']
  let result: Exclude<typeof data, null>
  let expected: Array<{
    channel_id: number | null
    message: string | null
    users: {
      catchphrase: unknown
      username: string
    } | null
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['function with row input with followup select']
  let result: Exclude<typeof data, null>
  let expected: Array<{
    id: number
    username: string | null
    users: {
      catchphrase: unknown
      username: string
    } | null
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// Tests for unresolvable functions
{
  const { data } = await rpcQueries['unresolvable function with no params']
  let result: Exclude<typeof data, null>
  let expected: undefined
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['unresolvable function with text param']
  let result: Exclude<typeof data, null>
  // Should be an error response due to ambiguous function resolution
  let expected: SelectQueryError<'Could not choose the best candidate function between: postgrest_unresolvable_function(a => int4), postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['unresolvable function with int param']
  let result: Exclude<typeof data, null>
  // Should be an error response due to ambiguous function resolution
  let expected: SelectQueryError<'Could not choose the best candidate function between: postgrest_unresolvable_function(a => int4), postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// Tests for resolvable functions
{
  const { data } = await rpcQueries['resolvable function with no params']
  let result: Exclude<typeof data, null>
  let expected: undefined
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['resolvable function with text param']
  let result: Exclude<typeof data, null>
  let expected: number
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['resolvable function with int param']
  let result: Exclude<typeof data, null>
  let expected: string
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['resolvable function with profile_id param']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Tables']['user_profiles']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['resolvable function with channel_id and search params']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Tables']['messages']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['resolvable function with user_row param']
  let result: Exclude<typeof data, null>
  let expected: Array<Schema['Tables']['messages']['Row']>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// Tests for polymorphic functions
{
  const { data } = await rpcQueries['polymorphic function with text param']
  let result: Exclude<typeof data, null>
  let expected: string
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed json param']
  let result: Exclude<typeof data, null>
  let expected: number
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed jsonb param']
  let result: Exclude<typeof data, null>
  let expected: number
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed text param']
  let result: Exclude<typeof data, null>
  let expected: number
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries[
    'polymorphic function with unnamed params definition call with bool param'
  ]
  let result: Exclude<typeof data, null>
  // TODO: since this call use an invalid type definition, we can't distinguish between the "no values" or the "empty"
  // property call:
  // polymorphic_function_with_no_params_or_unnamed:
  // | {
  //     Args: Record<PropertyKey, never>
  //     Returns: number
  //   }
  // | {
  //     Args: { '': string }
  //     Returns: string
  //   }
  // A type error would be raised at higher level (argument providing) time though
  let expected: string | number
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  // The same call, but using a valid text params: `{'': 'test'}` should properly
  // narrow down the resilt to the right definition
  const { data } = await rpcQueries[
    'polymorphic function with unnamed params definition call with text param'
  ]
  let result: Exclude<typeof data, null>
  let expected: string
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}
{
  // Same thing if we call the function with explicitely no params, it should narrow down to the right definition
  const { data } = await rpcQueries[
    'polymorphic function with no params and unnamed params definition call with no params'
  ]
  let result: Exclude<typeof data, null>
  let expected: number
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed default no params']
  let result: Exclude<typeof data, null>
  let expected: SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default( => int4), polymorphic_function_with_unnamed_default(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed default int param']
  let result: Exclude<typeof data, null>
  // TODO: since this call use an invalid type definition, we can't distinguish between the "no values" or the "empty"
  // A type error would be raised at higher level (argument providing) time though
  let expected:
    | string
    | SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default( => int4), polymorphic_function_with_unnamed_default(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed default text param']
  let result: Exclude<typeof data, null>
  let expected: string
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed default overload no params']
  let result: Exclude<typeof data, null>
  let expected: SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default_overload( => int4), polymorphic_function_with_unnamed_default_overload(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed default overload int param']
  let result: Exclude<typeof data, null>
  // TODO: since this call use an invalid type definition, we can't distinguish between the "no values" or the "empty"
  // A type error would be raised at higher level (argument providing) time though
  let expected:
    | string
    | SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default_overload( => int4), polymorphic_function_with_unnamed_default_overload(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed default overload text param']
  let result: Exclude<typeof data, null>
  let expected: string
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed default overload bool param']
  let result: Exclude<typeof data, null>
  // TODO: since this call use an invalid type definition, we can't distinguish between the "no values" or the "empty"
  // A type error would be raised at higher level (argument providing) time though
  let expected:
    | string
    | SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default_overload( => int4), polymorphic_function_with_unnamed_default_overload(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}
