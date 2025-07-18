import { PostgrestClient } from '../src/index'
import { CustomUserDataType, Database } from './types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

test('basic update', async () => {
  let res = await postgrest.from('messages').update({ channel_id: 2 }).eq('message', 'foo').select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "channel_id": 2,
          "data": null,
          "id": 5,
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
          "channel_id": 2,
          "data": null,
          "id": 6,
          "message": "foo",
          "username": "supabot",
        },
        Object {
          "channel_id": 2,
          "data": null,
          "id": 7,
          "message": "foo",
          "username": "supabot",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
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
          "channel_id": 2,
          "data": null,
          "id": 5,
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
          "channel_id": 2,
          "data": null,
          "id": 6,
          "message": "foo",
          "username": "supabot",
        },
        Object {
          "channel_id": 2,
          "data": null,
          "id": 7,
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

test("update with count: 'exact'", async () => {
  let res = await postgrest
    .from('messages')
    .update({ channel_id: 2 }, { count: 'exact' })
    .eq('message', 'foo')
    .select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": 4,
      "data": Array [
        Object {
          "channel_id": 2,
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
          "channel_id": 2,
          "data": null,
          "id": 9,
          "message": "foo",
          "username": "supabot",
        },
        Object {
          "channel_id": 2,
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
          "channel_id": 2,
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
          "channel_id": 2,
          "data": null,
          "id": 9,
          "message": "foo",
          "username": "supabot",
        },
        Object {
          "channel_id": 2,
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

test('update with no match - return=minimal', async () => {
  const res = await postgrest
    .from('users')
    .update({ data: '' as unknown as CustomUserDataType })
    .eq('username', 'missing')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": null,
      "status": 204,
      "statusText": "No Content",
    }
  `)
})
test('update with no match - return=representation', async () => {
  const res = await postgrest
    .from('users')
    .update({ data: '' as unknown as CustomUserDataType })
    .eq('username', 'missing')
    .select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})
