import { PostgrestClient } from '../src/index'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient(REST_URL)

test('basic select table', async () => {
  const res = await postgrest.from('users').select()
  expect(res).toMatchSnapshot()
})

test('stored procedure', async () => {
  const res = await postgrest.rpc('get_status', { name_param: 'supabot' })
  expect(res).toMatchSnapshot()
})

test('custom headers', async () => {
  const postgrest = new PostgrestClient(REST_URL, { headers: { apikey: 'foo' } })
  expect((postgrest.from('users').select() as any).headers['apikey']).toEqual('foo')
})

test('auth', async () => {
  const postgrest = new PostgrestClient(REST_URL).auth('foo')
  expect((postgrest.from('users').select() as any).headers['Authorization']).toEqual('Bearer foo')
})

test('switch schema', async () => {
  const postgrest = new PostgrestClient(REST_URL, { schema: 'personal' })
  const res = await postgrest.from('users').select()
  expect(res).toMatchSnapshot()
})

test('on_conflict insert', async () => {
  const res = await postgrest
    .from('users')
    .insert({ username: 'dragarcia' }, { upsert: true, onConflict: 'username' })
  expect(res).toMatchSnapshot()
})

describe('basic insert, update, delete', () => {
  test('basic insert', async () => {
    let res = await postgrest
      .from('messages')
      .insert({ message: 'foo', username: 'supabot', channel_id: 1 })
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })

  test('upsert', async () => {
    let res = await postgrest
      .from('messages')
      .insert({ id: 3, message: 'foo', username: 'supabot', channel_id: 2 }, { upsert: true })
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })

  test('bulk insert', async () => {
    let res = await postgrest.from('messages').insert([
      { message: 'foo', username: 'supabot', channel_id: 1 },
      { message: 'foo', username: 'supabot', channel_id: 1 },
    ])
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })

  test('basic update', async () => {
    let res = await postgrest.from('messages').update({ channel_id: 2 }).eq('message', 'foo')
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })

  test('basic delete', async () => {
    let res = await postgrest.from('messages').delete().eq('message', 'foo')
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })
})

test('missing table', async () => {
  const res = await postgrest.from('missing_table').select()
  expect(res).toMatchSnapshot()
})

test('connection error', async () => {
  const postgrest = new PostgrestClient('http://this.url.does.not.exist')
  let isErrorCaught = false
  await postgrest
    .from('user')
    .select()
    .then(undefined, () => {
      isErrorCaught = true
    })
  expect(isErrorCaught).toBe(true)
})

describe('types', () => {
  type User = {
    username: string
    data: object | null
    age_range: string | null
    status: 'ONLINE' | 'OFFLINE'
    catchphrase: 'string' | null
  }

  describe('without schema', () => {
    test('everything works without any types passed in', async () => {
      // eq should show User's properties in LSP/IntelliSense
      const { data: users } = await postgrest.from('users').select().eq('username', 'supabot')

      // Should not error on any property
      users[0].username
      users[0].somethingElse

      // Should not error when using properties
      const username: string = users[0].username
    })
  })

  type Session = {
    id: string
    expires: string
  }

  type Schema = {
    users: User
    sessions: Session
  }

  describe('with schema', () => {
    const typedClient = new PostgrestClient<Schema>(REST_URL)

    test('enforces table and column names', async () => {
      // Should error on incorrect table name
      // @ts-expect-error
      typedClient.from('asdasd')

      // Should error on incorrect column name
      // @ts-expect-error
      typedClient.from('sessions').select('expires').eq('asdsdasd')

      // Allows array, comma-separated, and * selects
      typedClient.from('users').select('username,age_range').eq('username', 'supabot')
      typedClient.from('users').select(['username', 'age_range']).eq('username', 'supabot')
      typedClient.from('users').select('*').eq('username', 'supabot')

      // Reports incorrect columns in array select
      // @ts-expect-error
      typedClient.from('users').select(['username', 'age_']).eq('username', 'supabot')

      // eq and select should show User's properties in LSP/IntelliSense
      const { data: users } = await typedClient.from('users').select('*').eq('username', 'supabot')

      // Should not error on any property
      users[0].username
      // Should error on incorrect property
      // @ts-expect-error
      users[0].somethingElse

      // Returns correct types
      const username: string = users[0].username
      // @ts-expect-error
      const notUsername: number = users[0].catchphrase
    })
  })
})

test("don't mutate PostgrestClient.headers", async () => {
  await postgrest.from('users').select().limit(1).single()
  const { error } = await postgrest.from('users').select()
  expect(error).toMatchSnapshot()
})

test('allow ordering on JSON column', async () => {
  const { data } = await postgrest.from('users').select().order('data->something')
  expect(data).toMatchSnapshot()
})

test('Prefer: return=minimal', async () => {
  const { data } = await postgrest
    .from('users')
    .insert({ username: 'bar' }, { returning: 'minimal' })
  expect(data).toMatchSnapshot()

  await postgrest.from('users').delete().eq('username', 'bar')
})

test('select with head:true', async () => {
  const res = await postgrest.from('users').select('*', { head: true })
  expect(res).toMatchSnapshot()
})

test('select with head:true, count:exact', async () => {
  const res = await postgrest.from('users').select('*', { head: true, count: 'exact' })
  expect(res).toMatchSnapshot()
})

test('select with head:true, count:planned', async () => {
  const res = await postgrest.from('users').select('*', { head: true, count: 'planned' })
  expect(res).toMatchSnapshot({
    count: expect.any(Number),
  })
})

test('select with head:true, count:estimated', async () => {
  const res = await postgrest.from('users').select('*', { head: true, count: 'estimated' })
  expect(res).toMatchSnapshot({
    count: expect.any(Number),
  })
})

test('select with count:exact', async () => {
  const res = await postgrest.from('users').select('*', { count: 'exact' })
  expect(res).toMatchSnapshot()
})

test('select with array columns', async () => {
  const res = await postgrest.from('users').select(['username', 'age_range'], { count: 'exact' })
  expect(res).toMatchSnapshot()
})

test("stored procedure with count: 'exact'", async () => {
  const res = await postgrest.rpc('get_status', { name_param: 'supabot', count: 'exact' })
  expect(res).toMatchSnapshot()
})

test("stored procedure with count: 'exact', head: true", async () => {
  const res = await postgrest.rpc('get_status', {
    name_param: 'supabot',
    count: 'exact',
    head: true,
  })
  expect(res).toMatchSnapshot()
})

describe("insert, update, delete with count: 'exact'", () => {
  test("insert with count: 'exact'", async () => {
    let res = await postgrest
      .from('messages')
      .insert({ message: 'foo', username: 'supabot', channel_id: 1 }, { count: 'exact' })
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })

  test("upsert with count: 'exact'", async () => {
    let res = await postgrest
      .from('messages')
      .insert(
        { id: 3, message: 'foo', username: 'supabot', channel_id: 2 },
        { upsert: true, count: 'exact' }
      )
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })

  test("bulk insert with count: 'exact'", async () => {
    let res = await postgrest.from('messages').insert(
      [
        { message: 'foo', username: 'supabot', channel_id: 1 },
        { message: 'foo', username: 'supabot', channel_id: 1 },
      ],
      { count: 'exact' }
    )
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })

  test("update with count: 'exact'", async () => {
    let res = await postgrest
      .from('messages')
      .update({ channel_id: 2 }, { count: 'exact' })
      .eq('message', 'foo')
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })

  test("basic delete count: 'exact'", async () => {
    let res = await postgrest.from('messages').delete({ count: 'exact' }).eq('message', 'foo')
    expect(res).toMatchSnapshot()

    res = await postgrest.from('messages').select()
    expect(res).toMatchSnapshot()
  })
})
