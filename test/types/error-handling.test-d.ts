import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { PostgrestClient, PostgrestError } from '../../src/index'
import { Database } from '../types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

// Should have nullable data and error field
{
  const result = await postgrest.from('users').select('username, messages(id, message)').limit(1)
  let expected:
    | {
        username: string
        messages: {
          id: number
          message: string | null
        }[]
      }[]
    | null
  const { data } = result
  const { error } = result
  expectType<TypeEqual<typeof data, typeof expected>>(true)
  let err: PostgrestError | null
  expectType<TypeEqual<typeof error, typeof err>>(true)
}

// Should have non nullable data and no error fields if throwOnError is added
{
  const result = await postgrest
    .from('users')
    .select('username, messages(id, message)')
    .limit(1)
    .throwOnError()
  const { data } = result
  const { error } = result
  let expected:
    | {
        username: string
        messages: {
          id: number
          message: string | null
        }[]
      }[]
  expectType<TypeEqual<typeof data, typeof expected>>(true)
  expectType<TypeEqual<typeof error, null>>(true)
  error
}

// Should work with throwOnError in the middle of the chaining
{
  const result = await postgrest
    .from('users')
    .select('username, messages(id, message)')
    .throwOnError()
    .eq('username', 'test')
    .limit(1)
  const { data } = result
  const { error } = result
  let expected:
    | {
        username: string
        messages: {
          id: number
          message: string | null
        }[]
      }[]
  expectType<TypeEqual<typeof data, typeof expected>>(true)
  expectType<TypeEqual<typeof error, null>>(true)
  error
}

// Test with throwOnError() on returns()
{
  const throwResult = await postgrest
    .from('users')
    .select()
    .returns<{ username: string }[]>()
    .throwOnError()
  let throwResultType: typeof throwResult.data
  let throwExpected: { username: string }[]
  expectType<TypeEqual<typeof throwResultType, typeof throwExpected>>(true)
  let throwErrorType: typeof throwResult.error
  let throwErrorExpected: null
  expectType<TypeEqual<typeof throwErrorType, typeof throwErrorExpected>>(true)
}
