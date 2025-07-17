import { expectType } from 'tsd'
import { PostgrestClient } from '../../src/index'
import { Database } from '../types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

// `null` can't be used with `.eq()`
{
  postgrest.from('users').select().eq('username', 'foo')
  // @ts-expect-error
  postgrest.from('users').select().eq('username', null)

  const nullableVar = 'foo' as string | null
  // @ts-expect-error
  postgrest.from('users').select().eq('username', nullableVar)
}

// Basic query operations with valid enum values
{
  const result = await postgrest.from('users').select('status').eq('status', 'ONLINE')
  if (result.error) {
    throw new Error(result.error.message)
  }
  expectType<{ status: Database['public']['Enums']['user_status'] | null }[]>(result.data)
}

{
  const result = await postgrest.from('users').select('status').neq('status', 'ONLINE')
  if (result.error) {
    throw new Error(result.error.message)
  }
  expectType<{ status: Database['public']['Enums']['user_status'] | null }[]>(result.data)
}

{
  const result = await postgrest.from('users').select('status').in('status', ['ONLINE', 'OFFLINE'])
  if (result.error) {
    throw new Error(result.error.message)
  }
  expectType<{ status: Database['public']['Enums']['user_status'] | null }[]>(result.data)
}

// rpc return type
{
  const result = await postgrest.rpc('get_status')
  if (result.error) {
    throw new Error(result.error.message)
  }
  expectType<'ONLINE' | 'OFFLINE'>(result.data)
}
