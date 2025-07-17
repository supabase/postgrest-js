import { PostgrestClient } from '../src/index'
import { Database, CustomUserDataType } from './types.override'
import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { Json } from '../src/select-query-parser/types'

const REST_URL = 'http://localhost:3000'
export const postgrest = new PostgrestClient<Database>(REST_URL)

const userColumn: 'catchphrase' | 'username' = 'username'

test('select with type casting query', async () => {
  const res = await postgrest.from('best_friends').select('id::text').limit(1).single()

  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "id": "1",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: string
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join with column hinting', async () => {
  const res = await postgrest.from('best_friends').select('users!first_user(*)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "users": Object {
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
    users: {
      age_range: unknown | null
      catchphrase: unknown | null
      data: CustomUserDataType | null
      status: Database['public']['Enums']['user_status'] | null
      username: string
    }
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join select via column', async () => {
  const res = await postgrest.from('user_profiles').select('username(*)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "username": Object {
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
    username: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join select via column selective', async () => {
  const res = await postgrest.from('user_profiles').select('username(status)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "username": Object {
            "status": "ONLINE",
          },
        },
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: {
      status: Database['public']['Enums']['user_status'] | null
    } | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join select via column and alias', async () => {
  const res = await postgrest.from('user_profiles').select('user:username(*)').limit(1).single()
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
    user: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join select via unique table relationship', async () => {
  const res = await postgrest.from('user_profiles').select('users(*)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "users": Object {
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
    users: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join select via view name relationship', async () => {
  const res = await postgrest.from('user_profiles').select('updatable_view(*)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "updatable_view": Object {
          "non_updatable_column": 1,
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
    updatable_view: Database['public']['Views']['updatable_view']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join select via column with string templating', async () => {
  const res = await postgrest.from('users').select(`status, ${userColumn}`).limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "status": "ONLINE",
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    status: Database['public']['Enums']['user_status'] | null
    username: string
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('multiple times the same column in selection', async () => {
  const res = await postgrest.from('channels').select('id, id, id').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "id": 1,
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('embed resource with no fields', async () => {
  const res = await postgrest.from('messages').select('message, users()').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "message": "Hello World 👋",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
`)
  let result: Exclude<typeof res.data, null>
  let expected: {
    message: string | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select JSON accessor', async () => {
  const res = await postgrest
    .from('users')
    .select('data->foo->bar, data->foo->>baz')
    .limit(1)
    .filter('username', 'eq', 'jsonuser')
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "bar": Object {
          "nested": "value",
        },
        "baz": "string value",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
`)
  let result: Exclude<typeof res.data, null>
  let expected: {
    bar: Json
    baz: string
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('self reference relation', async () => {
  const res = await postgrest.from('collections').select('*, collections(*)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "collections": Array [
          Object {
            "description": "Child of Root",
            "id": 2,
            "parent_id": 1,
          },
          Object {
            "description": "Another Child of Root",
            "id": 3,
            "parent_id": 1,
          },
        ],
        "description": "Root Collection",
        "id": 1,
        "parent_id": null,
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
    description: string | null
    parent_id: number | null
    collections: {
      id: number
      description: string | null
      parent_id: number | null
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('self reference relation via column', async () => {
  const res = await postgrest
    .from('collections')
    .select('*, parent_id(*)')
    .eq('id', 2)
    .limit(1)
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "description": "Child of Root",
        "id": 2,
        "parent_id": Object {
          "description": "Root Collection",
          "id": 1,
          "parent_id": null,
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    description: string | null
    id: number
    parent_id:
      | (number & {
          description: string | null
          id: number
          parent_id: number | null
        })
      | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('many-to-many with join table', async () => {
  const res = await postgrest.from('products').select('*, categories(*)').eq('id', 1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "categories": Array [
          Object {
            "description": "Electronic devices and gadgets",
            "id": 1,
            "name": "Electronics",
          },
          Object {
            "description": "Computer and computer accessories",
            "id": 2,
            "name": "Computers",
          },
        ],
        "description": "High-performance laptop",
        "id": 1,
        "name": "Laptop",
        "price": 999.99,
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
    name: string
    description: string | null
    price: number
    categories: {
      id: number
      name: string
      description: string | null
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join on one to 0-1 non-empty relation via column name', async () => {
  const res = await postgrest
    .from('users')
    .select('user_profiles(username)')
    .eq('username', 'supabot')
    .limit(1)
    .single()
  expect(res.error).toBeNull()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    user_profiles: Array<Pick<Database['public']['Tables']['user_profiles']['Row'], 'username'>>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join on 1-M relation with selective fk hinting', async () => {
  const res = await postgrest
    .from('users')
    .select(
      `first_friend_of:best_friends_first_user_fkey(id),
        second_friend_of:best_friends_second_user_fkey(*),
        third_wheel_of:best_friends_third_wheel_fkey(*)`
    )
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
              "id": 1,
            },
            Object {
              "id": 2,
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_friend_of: Array<Pick<Database['public']['Tables']['best_friends']['Row'], 'id'>>
    second_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    third_wheel_of: Array<Database['public']['Tables']['best_friends']['Row']>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})
