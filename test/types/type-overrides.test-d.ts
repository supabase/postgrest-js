import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { PostgrestBuilder, PostgrestClient } from '../../src/index'
import { CustomUserDataType, Database } from '../types.override'
import { Json } from '../types.generated'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

// ===== .returns() method tests =====

// can override result type with .returns()
{
  const result = await postgrest
    .from('users')
    .select('*, messages(*)')
    .returns<{ messages: { foo: 'bar' }[] }[]>()
  if (result.error) {
    throw new Error(result.error.message)
  }
  expectType<{ foo: 'bar' }[]>(result.data[0].messages)
}

// Test returns() with different end methods
{
  // Test with single()
  const singleResult = await postgrest
    .from('users')
    .select()
    .single()
    .returns<{ username: string }>()
  if (singleResult.error) {
    throw new Error(singleResult.error.message)
  }
  let result: typeof singleResult.data
  let expected: { username: string }
  expectType<TypeEqual<typeof result, typeof expected>>(true)

  // Test with maybeSingle()
  const maybeSingleResult = await postgrest
    .from('users')
    .select()
    .maybeSingle()
    .returns<{ username: string }>()
  if (maybeSingleResult.error) {
    throw new Error(maybeSingleResult.error.message)
  }
  let maybeSingleResultType: typeof maybeSingleResult.data
  let maybeSingleExpected: { username: string } | null
  expectType<TypeEqual<typeof maybeSingleResultType, typeof maybeSingleExpected>>(true)

  // Test array to non-array type casting error
  const invalidCastArray = await postgrest.from('users').select().returns<{ username: string }>()
  if (invalidCastArray.error) {
    throw new Error(invalidCastArray.error.message)
  }
  let resultType: typeof invalidCastArray.data
  let resultExpected: {
    Error: 'Type mismatch: Cannot cast array result to a single object. Use .overrideTypes<Array<YourType>> or .returns<Array<YourType>> (deprecated) for array results or .single() to convert the result to a single object'
  }
  expectType<TypeEqual<typeof resultType, typeof resultExpected>>(true)

  // Test non-array to array type casting error
  const invalidCastSingle = postgrest
    .from('users')
    .select()
    .single()
    .returns<{ username: string }[]>()
  expectType<
    PostgrestBuilder<
      { PostgrestVersion: '12' },
      {
        Error: 'Type mismatch: Cannot cast single object to array type. Remove Array wrapper from return type or make sure you are not using .single() up in the calling chain'
      },
      false
    >
  >(invalidCastSingle)

  // Test with csv()
  const csvResult = await postgrest.from('users').select().csv().returns<string>()
  if (csvResult.error) {
    throw new Error(csvResult.error.message)
  }
  let csvResultType: typeof csvResult.data
  let csvExpected: string
  expectType<TypeEqual<typeof csvResultType, typeof csvExpected>>(true)
}

// ===== .overrideTypes() method tests =====

// Test merge array result to object should error
{
  const singleResult = await postgrest
    .from('users')
    .select()
    .overrideTypes<{ custom_field: string }>()
  if (singleResult.error) {
    throw new Error(singleResult.error.message)
  }
  let result: typeof singleResult.data
  expectType<
    TypeEqual<
      typeof result,
      {
        Error: 'Type mismatch: Cannot cast array result to a single object. Use .overrideTypes<Array<YourType>> or .returns<Array<YourType>> (deprecated) for array results or .single() to convert the result to a single object'
      }
    >
  >(true)
}

// Test with single() / maybeSingle()
{
  const singleResult = await postgrest
    .from('users')
    .select()
    .single()
    .overrideTypes<{ custom_field: string }>()
  if (singleResult.error) {
    throw new Error(singleResult.error.message)
  }
  let result: typeof singleResult.data
  expectType<TypeEqual<(typeof result)['custom_field'], string>>(true)
}

// Test with maybeSingle() merging with new field
{
  const maybeSingleResult = await postgrest
    .from('users')
    .select()
    .maybeSingle()
    .overrideTypes<{ custom_field: string }>()
  if (maybeSingleResult.error) {
    throw new Error(maybeSingleResult.error.message)
  }
  let maybeSingleResultType: typeof maybeSingleResult.data
  let expectedType: {
    age_range: unknown
    catchphrase: unknown
    data: CustomUserDataType | null
    status: 'ONLINE' | 'OFFLINE' | null
    username: string
    custom_field: string
  } | null
  expectType<TypeEqual<typeof maybeSingleResultType, typeof expectedType>>(true)
}

// Test replacing behavior
{
  const singleResult = await postgrest
    .from('users')
    .select()
    .single()
    .overrideTypes<{ custom_field: string }, { merge: false }>()
  if (singleResult.error) {
    throw new Error(singleResult.error.message)
  }
  let result: typeof singleResult.data
  expectType<TypeEqual<typeof result, { custom_field: string }>>(true)
}

// Test with select()
{
  const singleResult = await postgrest
    .from('users')
    .select()
    .overrideTypes<{ custom_field: string }[]>()
  if (singleResult.error) {
    throw new Error(singleResult.error.message)
  }
  let result: typeof singleResult.data
  expectType<
    TypeEqual<
      typeof result,
      {
        username: string
        data: CustomUserDataType | null
        age_range: unknown
        catchphrase: unknown
        status: 'ONLINE' | 'OFFLINE' | null
        custom_field: string
      }[]
    >
  >(true)
}

// Test merging nested object fields remove optionality via override
{
  const result = await postgrest
    .from('users')
    .select()
    .overrideTypes<{ data: { foo: number; qux: boolean } }[]>()
  if (result.error) {
    throw new Error(result.error.message)
  }
  let data: typeof result.data
  expectType<
    TypeEqual<
      typeof data,
      {
        username: string
        data: {
          foo: number
          bar: { baz: number }
          en: 'ONE' | 'TWO' | 'THREE'
          record: Record<string, Json | undefined> | null
          recordNumber: Record<number, Json | undefined> | null
          qux: boolean
        }
        age_range: unknown
        catchphrase: unknown
        status: 'ONLINE' | 'OFFLINE' | null
      }[]
    >
  >(true)
}

// Test overrideTypes with embedded relations
{
  const result = await postgrest.from('users').select('*, messages(*)').overrideTypes<
    {
      messages: { created_at: Date; data: string }[]
    }[]
  >()
  if (result.error) {
    throw new Error(result.error.message)
  }
  let data: typeof result.data
  expectType<
    TypeEqual<
      typeof data,
      {
        username: string
        data: CustomUserDataType | null
        age_range: unknown
        catchphrase: unknown
        status: 'ONLINE' | 'OFFLINE' | null
        messages: {
          channel_id: number
          data: string
          id: number
          message: string | null
          username: string
          created_at: Date
        }[]
      }[]
    >
  >(true)
}
