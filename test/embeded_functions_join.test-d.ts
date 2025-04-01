import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { Database } from './types.override'
import { rpcQueries, selectQueries } from './embeded_functions_join'

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
