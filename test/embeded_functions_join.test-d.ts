import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { Database } from './types.override'
import { rpcQueries, selectQueries } from './embeded_functions_join'
import { SelectQueryError } from '../src/select-query-parser/utils'

type Schema = Database['public']

{
  const { data } = await selectQueries.embeded_setof_function
  let result: Exclude<typeof data, null>
  let expected: Array<{
    id: number
    all_channels_messages: Array<Schema['Tables']['messages']['Row']>
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await selectQueries.embeded_setof_function_fields_selection
  let result: Exclude<typeof data, null>
  let expected: Array<{
    id: number
    all_channels_messages: Array<Pick<Schema['Tables']['messages']['Row'], 'id' | 'message'>>
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await selectQueries.embeded_setof_function_double_definition
  let result: Exclude<typeof data, null>
  let expected: Array<{
    username: string
    all_user_messages: Array<Schema['Tables']['messages']['Row']>
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await selectQueries.embeded_setof_function_double_definition_fields_selection
  let result: Exclude<typeof data, null>
  let expected: Array<{
    username: string
    all_user_messages: Array<Pick<Schema['Tables']['messages']['Row'], 'id' | 'message'>>
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await selectQueries.embeded_setof_row_one_function
  let result: Exclude<typeof data, null>
  let expected: Array<{
    username: string
    user_called_profile: Schema['Tables']['user_profiles']['Row'] | null
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}
{
  const { data } = await selectQueries.embeded_setof_row_one_function_not_nullable
  let result: Exclude<typeof data, null>
  let expected: Array<{
    username: string
    user_called_profile_not_null: Schema['Tables']['user_profiles']['Row']
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await selectQueries.embeded_setof_row_one_function_with_fields_selection
  let result: Exclude<typeof data, null>
  let expected: Array<{
    username: string
    user_called_profile: Pick<Schema['Tables']['user_profiles']['Row'], 'username'> | null
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await selectQueries.embeded_setof_function_with_fields_selection_with_sub_linking
  let result: Exclude<typeof data, null>
  let expected: Array<{
    id: number
    all_channels_messages: Array<{
      id: number
      message: string | null
      channels: {
        id: number
        slug: string | null
      }
    }>
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

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
  const { data } = await selectQueries.embeded_function_with_table_row_input
  let result: Exclude<typeof data, null>
  let expected: Array<{
    username: string
    user_messages: Array<Schema['Tables']['messages']['Row']>
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await selectQueries.embeded_function_with_view_row_input
  let result: Exclude<typeof data, null>
  let expected: Array<{
    username: string | null
    active_user_messages: Array<Schema['Tables']['messages']['Row']>
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await selectQueries.embeded_function_returning_view
  let result: Exclude<typeof data, null>
  let expected: Array<{
    username: string
    recent_messages: Array<Schema['Views']['recent_messages']['Row']>
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await selectQueries.embeded_function_with_view_input_returning_view
  let result: Exclude<typeof data, null>
  let expected: Array<{
    username: string | null
    recent_messages: Array<Schema['Views']['recent_messages']['Row']>
  }>
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
  let expected: undefined
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with bool param']
  let result: Exclude<typeof data, null>
  let expected: number
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

{
  const { data } = await rpcQueries['polymorphic function with unnamed int param']
  let result: Exclude<typeof data, null>
  // Should be an error response as function is not found
  let expected: never
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
