import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

test('throwOnError throws errors instead of returning them', async () => {
  let isErrorCaught = false

  try {
    // @ts-expect-error: nonexistent table
    await postgrest.from('missing_table').select().throwOnError()
  } catch (error) {
    expect(error).toMatchInlineSnapshot(
      `[PostgrestError: relation "public.missing_table" does not exist]`
    )
    isErrorCaught = true
  }

  expect(isErrorCaught).toBe(true)
})

test('throwOnError throws errors which include stack', async () => {
  try {
    // @ts-expect-error: nonexistent table
    await postgrest.from('does_not_exist').select().throwOnError()
  } catch (err) {
    expect(err instanceof Error).toBe(true)
    expect((err as Error).stack).not.toBeUndefined()
  }
})

test('maybeSingle w/ throwOnError', async () => {
  let passes = true
  await postgrest
    .from('messages')
    .select()
    .eq('message', 'i do not exist')
    .throwOnError()
    .maybeSingle()
    .then(undefined, () => {
      passes = false
    })
  expect(passes).toEqual(true)
})
