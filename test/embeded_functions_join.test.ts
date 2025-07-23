import { PostgrestClient } from '../src/index'
import { Database } from './types.override'
import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'

const REST_URL = 'http://localhost:3000'
export const postgrest = new PostgrestClient<Database>(REST_URL)

type Schema = Database['public']

describe('embeded functions select', () => {
  test('function returning a setof embeded table', async () => {
    const res = await postgrest.from('channels').select('id, all_channels_messages:get_messages(*)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      id: number
      all_channels_messages: Array<Schema['Tables']['messages']['Row']>
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function returning a setof embeded table with fields selection', async () => {
    const res = await postgrest
      .from('channels')
      .select('id, all_channels_messages:get_messages(id,message)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      id: number
      all_channels_messages: Array<Pick<Schema['Tables']['messages']['Row'], 'id' | 'message'>>
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function double definition returning a setof embeded table', async () => {
    const res = await postgrest.from('users').select('username, all_user_messages:get_messages(*)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      username: string
      all_user_messages: Array<Schema['Tables']['messages']['Row']>
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function double definition returning a setof embeded table with fields selection', async () => {
    const res = await postgrest
      .from('users')
      .select('username, all_user_messages:get_messages(id,message)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      username: string
      all_user_messages: Array<Pick<Schema['Tables']['messages']['Row'], 'id' | 'message'>>
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function returning a single row embeded table', async () => {
    const res = await postgrest
      .from('users')
      .select('username, user_called_profile:get_user_profile(*)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      username: string
      user_called_profile: Schema['Tables']['user_profiles']['Row'] | null
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function returning a single row embeded table with fields selection', async () => {
    const res = await postgrest
      .from('users')
      .select('username, user_called_profile:get_user_profile(username)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      username: string
      user_called_profile_not_null: Schema['Tables']['user_profiles']['Row']
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function embedded table with fields selection and sub linking', async () => {
    const res = await postgrest
      .from('channels')
      .select('id, all_channels_messages:get_messages(id,message,channels(id,slug))')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      username: string
      user_called_profile: Pick<Schema['Tables']['user_profiles']['Row'], 'username'> | null
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function with table row input', async () => {
    const res = await postgrest.from('users').select('username, user_messages:get_user_messages(*)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
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
  })

  test('function with view row input', async () => {
    const res = await postgrest
      .from('active_users')
      .select('username, active_user_messages:get_active_user_messages(*)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      username: string
      user_messages: Array<Schema['Tables']['messages']['Row']>
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function returning view', async () => {
    const res = await postgrest
      .from('users')
      .select('username, recent_messages:get_user_recent_messages(*)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      username: string | null
      active_user_messages: Array<Schema['Tables']['messages']['Row']>
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function with view input returning view', async () => {
    const res = await postgrest
      .from('active_users')
      .select('username, recent_messages:get_user_recent_messages(*)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      username: string
      recent_messages: Array<Schema['Views']['recent_messages']['Row']>
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function with blurb_message', async () => {
    const res = await postgrest
      .from('users')
      .select('username, user_messages:get_user_messages(id,message,blurb_message)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      username: string
      user_messages: Array<
        Pick<Schema['Tables']['messages']['Row'], 'id' | 'message' | 'blurb_message'>
      >
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function returning row', async () => {
    const res = await postgrest.from('channels').select('id, user:function_returning_row(*)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: never[]
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('function returning set of rows', async () => {
    const res = await postgrest
      .from('channels')
      .select('id, users:function_returning_set_of_rows(*)')
    expect(res).toMatchInlineSnapshot(``)
    let result: Exclude<typeof res.data, null>
    let expected: never[]
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })
})
