import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

test('custom headers', async () => {
  const postgrest = new PostgrestClient<Database>(REST_URL, { headers: { apikey: 'foo' } })
  expect((postgrest.from('users').select() as any).headers.get('apikey')).toEqual('foo')
})

test('custom headers on a per-call basis', async () => {
  const postgrest1 = new PostgrestClient<Database>(REST_URL, { headers: { apikey: 'foo' } })
  const postgrest2 = postgrest1.rpc('void_func').setHeader('apikey', 'bar')
  // Original client object isn't affected
  expect((postgrest1.from('users').select() as any).headers.get('apikey')).toEqual('foo')
  // Derived client object uses new header value
  expect((postgrest2 as any).headers.get('apikey')).toEqual('bar')
})

describe('custom prefer headers with ', () => {
  test('insert', async () => {
    const postgrest = new PostgrestClient<Database>(REST_URL, {
      headers: { Prefer: 'tx=rollback' },
    })
    const postgrestFilterBuilder = postgrest
      .from('users')
      .insert({ username: 'dragarcia' })
      .select() as any
    expect(postgrestFilterBuilder.headers.get('Prefer')).toContain('tx=rollback')
    expect(postgrestFilterBuilder.headers.get('Prefer')).toContain('return=')
  })
  test('update', async () => {
    const postgrest = new PostgrestClient<Database>(REST_URL, {
      headers: { Prefer: 'tx=rollback' },
    })
    const postgrestFilterBuilder = postgrest
      .from('users')
      .update({ username: 'dragarcia' })
      .select() as any
    expect(postgrestFilterBuilder.headers.get('Prefer')).toContain('tx=rollback')
    expect(postgrestFilterBuilder.headers.get('Prefer')).toContain('return=')
  })
  test('upsert', async () => {
    const postgrest = new PostgrestClient<Database>(REST_URL, {
      headers: { Prefer: 'tx=rollback' },
    })
    const postgrestFilterBuilder = postgrest
      .from('users')
      .upsert({ username: 'dragarcia' })
      .select() as any
    expect(postgrestFilterBuilder.headers.get('Prefer')).toContain('tx=rollback')
    expect(postgrestFilterBuilder.headers.get('Prefer')).toContain('return=')
  })
  test('delete', async () => {
    const postgrest = new PostgrestClient<Database>(REST_URL, {
      headers: { Prefer: 'tx=rollback' },
    })
    const postgrestFilterBuilder = postgrest.from('users').delete().select() as any
    expect(postgrestFilterBuilder.headers.get('Prefer')).toContain('tx=rollback')
    expect(postgrestFilterBuilder.headers.get('Prefer')).toContain('return=')
  })
})

test("don't mutate PostgrestClient.headers", async () => {
  await postgrest.from('users').select().limit(1).single()
  const { error } = await postgrest.from('users').select()
  expect(error).toMatchInlineSnapshot(`null`)
})
