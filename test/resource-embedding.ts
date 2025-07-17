import { PostgrestClient } from '../src/index'
import { Database } from './types.override'
import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'

const postgrest = new PostgrestClient<Database>('http://localhost:3000')

test('embedded select', async () => {
  const res = await postgrest.from('users').select('messages(*)')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
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
              "id": 4,
              "message": "Some message on channel wihtout details",
              "username": "supabot",
            },
          ],
        },
        Object {
          "messages": Array [],
        },
        Object {
          "messages": Array [],
        },
        Object {
          "messages": Array [],
        },
        Object {
          "messages": Array [],
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    messages: {
      channel_id: number
      data: unknown
      id: number
      message: string | null
      username: string
    }[]
  }[]
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

describe('embedded filters', () => {
  // TODO: Test more filters
  test('embedded eq', async () => {
    const res = await postgrest
      .from('users')
      .select('messages(*)')
      .eq('messages.channel_id' as any, 1)
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "messages": Array [
              Object {
                "channel_id": 1,
                "data": null,
                "id": 1,
                "message": "Hello World 👋",
                "username": "supabot",
              },
            ],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
    let result: Exclude<typeof res.data, null>
    let expected: {
      messages: {
        channel_id: number
        data: unknown
        id: number
        message: string | null
        username: string
      }[]
    }[]
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })
  test('embedded or', async () => {
    const res = await postgrest
      .from('users')
      .select('messages(*)')
      .or('channel_id.eq.2,message.eq.Hello World 👋', { foreignTable: 'messages' })
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
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
            ],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
    let result: Exclude<typeof res.data, null>
    let expected: {
      messages: {
        channel_id: number
        data: unknown
        id: number
        message: string | null
        username: string
      }[]
    }[]
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })
  test('embedded or with and', async () => {
    const res = await postgrest
      .from('users')
      .select('messages(*)')
      .or('channel_id.eq.2,and(message.eq.Hello World 👋,username.eq.supabot)', {
        foreignTable: 'messages',
      })
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
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
            ],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
    let result: Exclude<typeof res.data, null>
    let expected: {
      messages: {
        channel_id: number
        data: unknown
        id: number
        message: string | null
        username: string
      }[]
    }[]
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })
})

describe('embedded transforms', () => {
  test('embedded order', async () => {
    const res = await postgrest
      .from('users')
      .select('messages(*)')
      .order('channel_id' as any, { foreignTable: 'messages', ascending: false })
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "messages": Array [
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
                "id": 2,
                "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
                "username": "supabot",
              },
              Object {
                "channel_id": 1,
                "data": null,
                "id": 1,
                "message": "Hello World 👋",
                "username": "supabot",
              },
            ],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
    let result: Exclude<typeof res.data, null>
    let expected: {
      messages: {
        channel_id: number
        data: unknown
        id: number
        message: string | null
        username: string
      }[]
    }[]
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('embedded order on multiple columns', async () => {
    const res = await postgrest
      .from('users')
      .select('messages(*)')
      .order('channel_id' as any, { foreignTable: 'messages', ascending: false })
      .order('username', { foreignTable: 'messages', ascending: false })
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "messages": Array [
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
                "id": 2,
                "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
                "username": "supabot",
              },
              Object {
                "channel_id": 1,
                "data": null,
                "id": 1,
                "message": "Hello World 👋",
                "username": "supabot",
              },
            ],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
    let result: Exclude<typeof res.data, null>
    let expected: {
      messages: {
        channel_id: number
        data: unknown
        id: number
        message: string | null
        username: string
      }[]
    }[]
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('embedded limit', async () => {
    const res = await postgrest
      .from('users')
      .select('messages(*)')
      .limit(1, { foreignTable: 'messages' })
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "messages": Array [
              Object {
                "channel_id": 1,
                "data": null,
                "id": 1,
                "message": "Hello World 👋",
                "username": "supabot",
              },
            ],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
    let result: Exclude<typeof res.data, null>
    let expected: {
      messages: {
        channel_id: number
        data: unknown
        id: number
        message: string | null
        username: string
      }[]
    }[]
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })

  test('embedded range', async () => {
    const res = await postgrest
      .from('users')
      .select('messages(*)')
      .range(1, 1, { foreignTable: 'messages' })
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "messages": Array [
              Object {
                "channel_id": 2,
                "data": null,
                "id": 2,
                "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
                "username": "supabot",
              },
            ],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
          Object {
            "messages": Array [],
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
    let result: Exclude<typeof res.data, null>
    let expected: {
      messages: {
        channel_id: number
        data: unknown
        id: number
        message: string | null
        username: string
      }[]
    }[]
    expectType<TypeEqual<typeof result, typeof expected>>(true)
  })
})
