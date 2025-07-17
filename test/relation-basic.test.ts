import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

test('!left join on one to one relation', async () => {
  const res = await postgrest.from('channel_details').select('channels!left(id)').limit(1).single()
  expect(Array.isArray(res.data?.channels)).toBe(false)
  // TODO: This should not be nullable
  expect(res.data?.channels?.id).not.toBeNull()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "channels": Object {
          "id": 1,
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('!left join on one to many relation', async () => {
  const res = await postgrest.from('users').select('messages!left(username)').limit(1).single()
  expect(Array.isArray(res.data?.messages)).toBe(true)
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
          Object {
            "username": "supabot",
          },
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('!left join on one to 0-1 non-empty relation', async () => {
  const res = await postgrest
    .from('users')
    .select('user_profiles!left(username)')
    .eq('username', 'supabot')
    .limit(1)
    .single()
  expect(Array.isArray(res.data?.user_profiles)).toBe(true)
  expect(res.data?.user_profiles[0].username).not.toBeNull()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "user_profiles": Array [
          Object {
            "username": "supabot",
          },
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('!left join on zero to one with null relation', async () => {
  const res = await postgrest
    .from('user_profiles')
    .select('*,users!left(*)')
    .eq('id', 2)
    .limit(1)
    .single()
  expect(Array.isArray(res.data?.users)).toBe(false)
  expect(res.data?.users).toBeNull()

  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "id": 2,
        "username": null,
        "users": null,
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('!left join on zero to one with valid relation', async () => {
  const res = await postgrest
    .from('user_profiles')
    .select('*,users!left(status)')
    .eq('id', 1)
    .limit(1)
    .single()
  expect(Array.isArray(res.data?.users)).toBe(false)
  // TODO: This should be nullable indeed
  expect(res.data?.users?.status).not.toBeNull()

  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "id": 1,
        "username": "supabot",
        "users": Object {
          "status": "ONLINE",
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('!left join on zero to one empty relation', async () => {
  const res = await postgrest
    .from('users')
    .select('user_profiles!left(username)')
    .eq('username', 'dragarcia')
    .limit(1)
    .single()
  expect(Array.isArray(res.data?.user_profiles)).toBe(true)
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "user_profiles": Array [],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('join on 1-M relation', async () => {
  // TODO: This won't raise the proper types for "first_friend_of,..." results
  const res = await postgrest
    .from('users')
    .select(
      `first_friend_of:best_friends_first_user_fkey(*),
      second_friend_of:best_friends_second_user_fkey(*),
      third_wheel_of:best_friends_third_wheel_fkey(*)`
    )
    .eq('username', 'supabot')
    .limit(1)
    .single()
  expect(Array.isArray(res.data?.first_friend_of)).toBe(true)
  expect(Array.isArray(res.data?.second_friend_of)).toBe(true)
  expect(Array.isArray(res.data?.third_wheel_of)).toBe(true)
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "first_friend_of": Array [
          Object {
            "first_user": "supabot",
            "id": 1,
            "second_user": "kiwicopple",
            "third_wheel": "awailas",
          },
          Object {
            "first_user": "supabot",
            "id": 2,
            "second_user": "awailas",
            "third_wheel": null,
          },
        ],
        "second_friend_of": Array [],
        "third_wheel_of": Array [],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('join on 1-1 relation with nullables', async () => {
  const res = await postgrest
    .from('best_friends')
    .select(
      'first_user:users!best_friends_first_user_fkey(*), second_user:users!best_friends_second_user_fkey(*), third_wheel:users!best_friends_third_wheel_fkey(*)'
    )
    .order('id')
    .limit(1)
    .single()
  expect(Array.isArray(res.data?.first_user)).toBe(false)
  expect(Array.isArray(res.data?.second_user)).toBe(false)
  expect(Array.isArray(res.data?.third_wheel)).toBe(false)
  // TODO: This should return null only if the column is actually nullable thoses are not
  expect(res.data?.first_user?.username).not.toBeNull()
  expect(res.data?.second_user?.username).not.toBeNull()
  // TODO: This column however is nullable
  expect(res.data?.third_wheel?.username).not.toBeNull()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "first_user": Object {
          "age_range": "[1,2)",
          "catchphrase": "'cat' 'fat'",
          "data": null,
          "status": "ONLINE",
          "username": "supabot",
        },
        "second_user": Object {
          "age_range": "[25,35)",
          "catchphrase": "'bat' 'cat'",
          "data": null,
          "status": "OFFLINE",
          "username": "kiwicopple",
        },
        "third_wheel": Object {
          "age_range": "[25,35)",
          "catchphrase": "'bat' 'rat'",
          "data": null,
          "status": "ONLINE",
          "username": "awailas",
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})
