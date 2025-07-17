import { PostgrestClient } from '../src/index'
import { Database } from './types.override'
import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'

const REST_URL = 'http://localhost:3000'
export const postgrest = new PostgrestClient<Database>(REST_URL)

test('nested query with selective fields', async () => {
  const res = await postgrest
    .from('users')
    .select('username, messages(id, message)')
    .limit(1)
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "id": 1,
            "message": "Hello World 👋",
          },
          Object {
            "id": 2,
            "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
          },
          Object {
            "id": 3,
            "message": "Some message on channel wihtout details",
          },
          Object {
            "id": 4,
            "message": "Some message on channel wihtout details",
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: {
      id: number
      message: string | null
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('nested query with multiple levels and selective fields', async () => {
  const res = await postgrest
    .from('users')
    .select('username, messages(id, message, channels(id, slug))')
    .limit(1)
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "channels": Object {
              "id": 1,
              "slug": "public",
            },
            "id": 1,
            "message": "Hello World 👋",
          },
          Object {
            "channels": Object {
              "id": 2,
              "slug": "random",
            },
            "id": 2,
            "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
          },
          Object {
            "channels": Object {
              "id": 3,
              "slug": "other",
            },
            "id": 3,
            "message": "Some message on channel wihtout details",
          },
          Object {
            "channels": Object {
              "id": 3,
              "slug": "other",
            },
            "id": 4,
            "message": "Some message on channel wihtout details",
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    messages: Array<{
      id: number
      message: string | null
      channels: {
        id: number
        slug: string | null
      }
    }>
    username: string
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('query with multiple one-to-many relationships', async () => {
  const res = await postgrest
    .from('users')
    .select('username, messages(id), user_profiles(id)')
    .limit(1)
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "id": 1,
          },
          Object {
            "id": 2,
          },
          Object {
            "id": 3,
          },
          Object {
            "id": 4,
          },
        ],
        "user_profiles": Array [
          Object {
            "id": 1,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('many-to-one relationship', async () => {
  const res = await postgrest.from('messages').select('user:users(*)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "user": Object {
          "age_range": "[1,2)",
          "catchphrase": "'cat' 'fat'",
          "data": null,
          "status": "ONLINE",
          "username": "supabot",
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    user: Database['public']['Tables']['users']['Row']
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('one-to-many relationship', async () => {
  const res = await postgrest.from('users').select('messages(*)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
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
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    messages: Database['public']['Tables']['messages']['Row'][]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('one-to-many relationship with selective columns', async () => {
  const res = await postgrest.from('users').select('messages(data)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "data": null,
          },
          Object {
            "data": null,
          },
          Object {
            "data": null,
          },
          Object {
            "data": null,
          },
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    messages: Array<Pick<Database['public']['Tables']['messages']['Row'], 'data'>>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('one-to-one relationship', async () => {
  const res = await postgrest.from('channels').select('channel_details(*)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "channel_details": Object {
          "details": "Details for public channel",
          "id": 1,
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    channel_details: Database['public']['Tables']['channel_details']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})
