import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)
test('basic delete', async () => {
  let res = await postgrest.from('messages').delete().eq('message', 'foo').select()
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
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})
test("basic delete count: 'exact'", async () => {
  let res = await postgrest
    .from('messages')
    .delete({ count: 'exact' })
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
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})
