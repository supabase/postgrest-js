import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

test('basic insert', async () => {
  let res = await postgrest
    .from('messages')
    .insert({ message: 'foo', username: 'supabot', channel_id: 1 })
    .select()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "channel_id": 1,
            "data": null,
            "id": 5,
            "message": "foo",
            "username": "supabot",
          },
        ],
        "error": null,
        "status": 201,
        "statusText": "Created",
      }
    `)

  res = await postgrest.from('messages').select()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "channel_id": 1,
            "data": null,
            "id": 1,
            "message": "Hello World 👋",
            "username": "supabot",
          },
          Object {
            "channel_id": 2,
            "data": null,
            "id": 2,
            "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
            "username": "supabot",
          },
          Object {
            "channel_id": 3,
            "data": null,
            "id": 3,
            "message": "Some message on channel wihtout details",
            "username": "supabot",
          },
          Object {
            "channel_id": 3,
            "data": null,
            "id": 4,
            "message": "Some message on channel wihtout details",
            "username": "supabot",
          },
          Object {
            "channel_id": 1,
            "data": null,
            "id": 5,
            "message": "foo",
            "username": "supabot",
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('Prefer: return=minimal', async () => {
  const { data } = await postgrest.from('users').insert({ username: 'bar' })
  expect(data).toMatchInlineSnapshot(`null`)

  await postgrest.from('users').delete().eq('username', 'bar')
})

test("insert with count: 'exact'", async () => {
  let res = await postgrest
    .from('messages')
    .insert({ message: 'foo', username: 'supabot', channel_id: 1 }, { count: 'exact' })
    .select()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": 1,
        "data": Array [
          Object {
            "channel_id": 1,
            "data": null,
            "id": 8,
            "message": "foo",
            "username": "supabot",
          },
        ],
        "error": null,
        "status": 201,
        "statusText": "Created",
      }
    `)

  res = await postgrest.from('messages').select()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "channel_id": 1,
            "data": null,
            "id": 1,
            "message": "Hello World 👋",
            "username": "supabot",
          },
          Object {
            "channel_id": 2,
            "data": null,
            "id": 2,
            "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
            "username": "supabot",
          },
          Object {
            "channel_id": 3,
            "data": null,
            "id": 4,
            "message": "Some message on channel wihtout details",
            "username": "supabot",
          },
          Object {
            "channel_id": 1,
            "data": null,
            "id": 8,
            "message": "foo",
            "username": "supabot",
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('insert quoted column', async () => {
  let res = await postgrest
    .from('cornercase')
    .insert([{ 'column whitespace': 'foo', id: 1 }])
    .select('"column whitespace", id ')

  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
        "code": "23505",
        "details": "Key (id)=(1) already exists.",
        "hint": null,
        "message": "duplicate key value violates unique constraint \\"cornercase_pkey\\"",
      },
      "status": 409,
      "statusText": "Conflict",
    }
  `)
})

test("bulk insert with count: 'exact'", async () => {
  let res = await postgrest
    .from('messages')
    .insert(
      [
        { message: 'foo', username: 'supabot', channel_id: 1 },
        { message: 'foo', username: 'supabot', channel_id: 1 },
      ],
      { count: 'exact' }
    )
    .select()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": 2,
        "data": Array [
          Object {
            "channel_id": 1,
            "data": null,
            "id": 9,
            "message": "foo",
            "username": "supabot",
          },
          Object {
            "channel_id": 1,
            "data": null,
            "id": 10,
            "message": "foo",
            "username": "supabot",
          },
        ],
        "error": null,
        "status": 201,
        "statusText": "Created",
      }
    `)

  res = await postgrest.from('messages').select()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "channel_id": 1,
            "data": null,
            "id": 1,
            "message": "Hello World 👋",
            "username": "supabot",
          },
          Object {
            "channel_id": 2,
            "data": null,
            "id": 2,
            "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
            "username": "supabot",
          },
          Object {
            "channel_id": 3,
            "data": null,
            "id": 4,
            "message": "Some message on channel wihtout details",
            "username": "supabot",
          },
          Object {
            "channel_id": 1,
            "data": null,
            "id": 8,
            "message": "foo",
            "username": "supabot",
          },
          Object {
            "channel_id": 2,
            "data": null,
            "id": 3,
            "message": "foo",
            "username": "supabot",
          },
          Object {
            "channel_id": 1,
            "data": null,
            "id": 9,
            "message": "foo",
            "username": "supabot",
          },
          Object {
            "channel_id": 1,
            "data": null,
            "id": 10,
            "message": "foo",
            "username": "supabot",
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('bulk insert with column defaults', async () => {
  let res = await postgrest
    .from('channels')
    .insert([{ id: 100 }, { slug: 'test-slug' }], { defaultToNull: false })
    .select()
    .rollback()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "data": null,
            "id": 100,
            "slug": null,
          },
          Object {
            "data": null,
            "id": 5,
            "slug": "test-slug",
          },
        ],
        "error": null,
        "status": 201,
        "statusText": "Created",
      }
    `)
})

test('insert includes columns param', async () => {
  const client = postgrest.from('users').insert([{ foo: 1 }, { bar: 2 }] as any)
  expect((client as any).url.searchParams.get('columns')).toMatchInlineSnapshot(
    `"\\"foo\\",\\"bar\\""`
  )
})

test('insert w/ empty body has no columns param', async () => {
  const client = postgrest.from('users').insert([{}, {}] as any)
  expect((client as any).url.searchParams.has('columns')).toBeFalsy()
})
