import { postgrest, selectParams, RPC_NAME_SCALAR } from '../rpc'
import { Database } from '../types'
import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'

// RPC call with no params
{
  const { data } = await postgrest
    .rpc(RPC_NAME_SCALAR, { name_param: 'supabot' })
    .select(selectParams.noParams)
  let result: Exclude<typeof data, null>
  let expected: Database['public']['Functions'][typeof RPC_NAME_SCALAR]['Returns']
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// RPC call with star select
{
  const { data } = await postgrest
    .rpc(RPC_NAME_SCALAR, { name_param: 'supabot' })
    .select(selectParams.starSelect)
  let result: Exclude<typeof data, null>
  let expected: Database['public']['Functions'][typeof RPC_NAME_SCALAR]['Returns']
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// RPC call with single field select
{
  const { data } = await postgrest
    .rpc(RPC_NAME_SCALAR, { name_param: 'supabot' })
    .select(selectParams.fieldSelect)
  let result: Exclude<typeof data, null>
  let expected: { username: string }[]
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// RPC call with multiple fields select
{
  const { data } = await postgrest
    .rpc(RPC_NAME_SCALAR, { name_param: 'supabot' })
    .select(selectParams.fieldsSelect)
  let result: Exclude<typeof data, null>
  let expected: Database['public']['Functions'][typeof RPC_NAME_SCALAR]['Returns']
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// RPC call with field aliasing
{
  const { data } = await postgrest
    .rpc(RPC_NAME_SCALAR, { name_param: 'supabot' })
    .select(selectParams.fieldAliasing)
  let result: Exclude<typeof data, null>
  let expected: { name: string }[]
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// RPC call with field casting
{
  const { data } = await postgrest
    .rpc(RPC_NAME_SCALAR, { name_param: 'supabot' })
    .select(selectParams.fieldCasting)
  let result: Exclude<typeof data, null>
  let expected: { status: string }[]
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// RPC call with field aggregate
{
  const { data } = await postgrest
    .rpc(RPC_NAME_SCALAR, { name_param: 'supabot' })
    .select(selectParams.fieldAggregate)
  let result: Exclude<typeof data, null>
  let expected: { count: number; status: 'ONLINE' | 'OFFLINE' }[]
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// RPC call with select field and embed relation
// TODO: Implement support for RPC functions that return a set of rows
//
// Current introspection for functions returning setof:
// get_all_users: {
//   Args: Record<PropertyKey, never>
//   Returns: {
//     age_range: unknown | null
//     catchphrase: unknown | null
//     data: Json | null
//     status: Database["public"]["Enums"]["user_status"] | null
//     username: string
//   }[]
// }
//
// Proposed introspection change:
// get_all_users: {
//   setOf?: { refName: '<table-id-in-schema>' }
//   Args: Record<PropertyKey, never>
// }
//
// This would allow for proper typing of RPC calls that return sets,
// enabling them to use the same filtering and selection capabilities
// as table queries.
//
// On the PostgrestClient side, the rpc method should be updated to
// handle the 'setOf' property, branching the return type based on its presence:
//
// rpc<FnName extends string & keyof Schema['Functions'], Fn extends Schema['Functions'][FnName]>(
//   ...
// ):
// Fn['setOf'] extends { refName: string extends keyof Schema['Tables'] }
// ? PostgrestFilterBuilder<Schema, GetTable<Fn['setOf']>['Row'], Fn['setOf']['refName'], GetTable<Fn['setOf']>['Relationships']>
// : PostgrestFilterBuilder<
//     Schema,
//     Fn['Returns'] extends any[]
//       ? Fn['Returns'][number] extends Record<string, unknown>
//         ? Fn['Returns'][number]
//         : never
//       : never,
//     Fn['Returns'],
//     FnName,
//     null
//   >
//
// Implementation can be done in a follow-up PR.

// {
//   const { data } = await postgrest
//     .rpc(RPC_SETOF_NAME, {})
//     .select(selectParams.selectFieldAndEmbedRelation)
//   let result: Exclude<typeof data, null>
//   let expected: {
//     username: string
//     status: 'ONLINE' | 'OFFLINE'
//     profile: { id: number }[]
//   }[]
//   expectType<TypeEqual<typeof result, typeof expected>>(true)
// }
