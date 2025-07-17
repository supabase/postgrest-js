import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

test('on_conflict insert', async () => {
  const res = await postgrest
    .from('users')
    .upsert({ username: 'dragarcia' }, { onConflict: 'username' })
    .select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "age_range": "[20,30)",
          "catchphrase": "'fat' 'rat'",
          "data": null,
          "status": "ONLINE",
          "username": "dragarcia",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('ignoreDuplicates upsert', async () => {
  const res = await postgrest
    .from('users')
    .upsert({ username: 'dragarcia' }, { onConflict: 'username', ignoreDuplicates: true })
    .select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [],
      "error": null,
      "status": 201,
      "statusText": "Created",
    }
  `)
})

test('upsert', async () => {
  let res = await postgrest
    .from('messages')
    .upsert({ id: 3, message: 'foo', username: 'supabot', channel_id: 2 })
    .select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "channel_id": 2,
          "data": null,
          "id": 3,
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
          "channel_id": 1,
          "data": null,
          "id": 12,
          "message": "test1",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 13,
          "message": "test1",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 14,
          "message": "test1",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 15,
          "message": "updated",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 16,
          "message": "test3",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 17,
          "message": "test3",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 18,
          "message": "test3",
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
        Object {
          "channel_id": 2,
          "data": null,
          "id": 11,
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
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test("upsert with count: 'exact'", async () => {
  let res = await postgrest
    .from('messages')
    .upsert({ id: 3, message: 'foo', username: 'supabot', channel_id: 2 }, { count: 'exact' })
    .select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": 1,
      "data": Array [
        Object {
          "channel_id": 2,
          "data": null,
          "id": 3,
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
          "channel_id": 1,
          "data": null,
          "id": 12,
          "message": "test1",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 13,
          "message": "test1",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 14,
          "message": "test1",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 15,
          "message": "updated",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 16,
          "message": "test3",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 17,
          "message": "test3",
          "username": "supabot",
        },
        Object {
          "channel_id": 1,
          "data": null,
          "id": 18,
          "message": "test3",
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
        Object {
          "channel_id": 2,
          "data": null,
          "id": 11,
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
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('bulk upsert with column defaults', async () => {
  let res = await postgrest
    .from('channels')
    .upsert([{ id: 1 }, { slug: 'test-slug' }], { defaultToNull: false })
    .select()
    .rollback()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "data": null,
          "id": 1,
          "slug": null,
        },
        Object {
          "data": null,
          "id": 7,
          "slug": "test-slug",
        },
      ],
      "error": null,
      "status": 201,
      "statusText": "Created",
    }
  `)
})
