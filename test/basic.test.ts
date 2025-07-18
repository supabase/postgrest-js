import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

test('basic select table', async () => {
  const res = await postgrest.from('users').select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "age_range": "[1,2)",
          "catchphrase": "'cat' 'fat'",
          "data": null,
          "status": "ONLINE",
          "username": "supabot",
        },
        Object {
          "age_range": "[25,35)",
          "catchphrase": "'bat' 'cat'",
          "data": null,
          "status": "OFFLINE",
          "username": "kiwicopple",
        },
        Object {
          "age_range": "[25,35)",
          "catchphrase": "'bat' 'rat'",
          "data": null,
          "status": "ONLINE",
          "username": "awailas",
        },
        Object {
          "age_range": "[20,30)",
          "catchphrase": "'json' 'test'",
          "data": Object {
            "foo": Object {
              "bar": Object {
                "nested": "value",
              },
              "baz": "string value",
            },
          },
          "status": "ONLINE",
          "username": "jsonuser",
        },
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

test('basic select returns types override', async () => {
  const res = await postgrest.from('users').select().returns<{ status: 'ONLINE' | 'OFFLINE' }>()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "age_range": "[1,2)",
          "catchphrase": "'cat' 'fat'",
          "data": null,
          "status": "ONLINE",
          "username": "supabot",
        },
        Object {
          "age_range": "[25,35)",
          "catchphrase": "'bat' 'cat'",
          "data": null,
          "status": "OFFLINE",
          "username": "kiwicopple",
        },
        Object {
          "age_range": "[25,35)",
          "catchphrase": "'bat' 'rat'",
          "data": null,
          "status": "ONLINE",
          "username": "awailas",
        },
        Object {
          "age_range": "[20,30)",
          "catchphrase": "'json' 'test'",
          "data": Object {
            "foo": Object {
              "bar": Object {
                "nested": "value",
              },
              "baz": "string value",
            },
          },
          "status": "ONLINE",
          "username": "jsonuser",
        },
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

test('basic select returns from builder', async () => {
  const res = await postgrest
    .from('users')
    .select()
    .eq('username', 'supabot')
    .single()
    .returns<{ status: 'ONLINE' | 'OFFLINE' }>()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "age_range": "[1,2)",
        "catchphrase": "'cat' 'fat'",
        "data": null,
        "status": "ONLINE",
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('basic select overrideTypes from builder', async () => {
  const res = await postgrest
    .from('users')
    .select()
    .eq('username', 'supabot')
    .single()
    .overrideTypes<{ status: 'ONLINE' | 'OFFLINE' }>()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "age_range": "[1,2)",
        "catchphrase": "'cat' 'fat'",
        "data": null,
        "status": "ONLINE",
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('basic select with maybeSingle yielding more than one result', async () => {
  const res = await postgrest.from('users').select().maybeSingle()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
        "code": "PGRST116",
        "details": "Results contain 5 rows, application/vnd.pgrst.object+json requires 1 row",
        "hint": null,
        "message": "JSON object requested, multiple (or no) rows returned",
      },
      "status": 406,
      "statusText": "Not Acceptable",
    }
  `)
})

test('basic select with single yielding more than one result', async () => {
  const res = await postgrest.from('users').select().single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
        "code": "PGRST116",
        "details": "The result contains 5 rows",
        "hint": null,
        "message": "JSON object requested, multiple (or no) rows returned",
      },
      "status": 406,
      "statusText": "Not Acceptable",
    }
  `)
})

test('basic select view', async () => {
  const res = await postgrest.from('updatable_view').select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "non_updatable_column": 1,
          "username": "supabot",
        },
        Object {
          "non_updatable_column": 1,
          "username": "kiwicopple",
        },
        Object {
          "non_updatable_column": 1,
          "username": "awailas",
        },
        Object {
          "non_updatable_column": 1,
          "username": "jsonuser",
        },
        Object {
          "non_updatable_column": 1,
          "username": "dragarcia",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('switch schema', async () => {
  const postgrest = new PostgrestClient<Database, { PostgrestVersion: '12' }, 'personal'>(
    REST_URL,
    {
      schema: 'personal',
    }
  )
  const res = await postgrest.from('users').select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "age_range": "[1,2)",
          "data": null,
          "status": "ONLINE",
          "username": "supabot",
        },
        Object {
          "age_range": "[25,35)",
          "data": null,
          "status": "OFFLINE",
          "username": "kiwicopple",
        },
        Object {
          "age_range": "[25,35)",
          "data": null,
          "status": "ONLINE",
          "username": "awailas",
        },
        Object {
          "age_range": "[20,30)",
          "data": null,
          "status": "ONLINE",
          "username": "dragarcia",
        },
        Object {
          "age_range": "[20,40)",
          "data": null,
          "status": "ONLINE",
          "username": "leroyjenkins",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('dynamic schema', async () => {
  const postgrest = new PostgrestClient<Database>(REST_URL)
  const res = await postgrest.schema('personal').from('users').select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "age_range": "[1,2)",
          "data": null,
          "status": "ONLINE",
          "username": "supabot",
        },
        Object {
          "age_range": "[25,35)",
          "data": null,
          "status": "OFFLINE",
          "username": "kiwicopple",
        },
        Object {
          "age_range": "[25,35)",
          "data": null,
          "status": "ONLINE",
          "username": "awailas",
        },
        Object {
          "age_range": "[20,30)",
          "data": null,
          "status": "ONLINE",
          "username": "dragarcia",
        },
        Object {
          "age_range": "[20,40)",
          "data": null,
          "status": "ONLINE",
          "username": "leroyjenkins",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('throwOnError throws errors instead of returning them', async () => {
  let isErrorCaught = false

  try {
    // @ts-expect-error: nonexistent table
    await postgrest.from('missing_table').select().throwOnError()
  } catch (error) {
    expect(error).toMatchInlineSnapshot(
      `[PostgrestError: relation "public.missing_table" does not exist]`
    )
    isErrorCaught = true
  }

  expect(isErrorCaught).toBe(true)
})

test('throwOnError throws errors which include stack', async () => {
  try {
    // @ts-expect-error: nonexistent table
    await postgrest.from('does_not_exist').select().throwOnError()
  } catch (err) {
    expect(err instanceof Error).toBe(true)
    expect((err as Error).stack).not.toBeUndefined()
  }
})

test('maybeSingle w/ throwOnError', async () => {
  let passes = true
  await postgrest
    .from('messages')
    .select()
    .eq('message', 'i do not exist')
    .throwOnError()
    .maybeSingle()
    .then(undefined, () => {
      passes = false
    })
  expect(passes).toEqual(true)
})

test("don't mutate PostgrestClient.headers", async () => {
  await postgrest.from('users').select().limit(1).single()
  const { error } = await postgrest.from('users').select()
  expect(error).toMatchInlineSnapshot(`null`)
})

test('allow ordering on JSON column', async () => {
  const { data } = await postgrest
    .from('users')
    .select()
    .order('data->something' as any)
  expect(data).toMatchInlineSnapshot(`
    Array [
      Object {
        "age_range": "[1,2)",
        "catchphrase": "'cat' 'fat'",
        "data": null,
        "status": "ONLINE",
        "username": "supabot",
      },
      Object {
        "age_range": "[25,35)",
        "catchphrase": "'bat' 'cat'",
        "data": null,
        "status": "OFFLINE",
        "username": "kiwicopple",
      },
      Object {
        "age_range": "[25,35)",
        "catchphrase": "'bat' 'rat'",
        "data": null,
        "status": "ONLINE",
        "username": "awailas",
      },
      Object {
        "age_range": "[20,30)",
        "catchphrase": "'json' 'test'",
        "data": Object {
          "foo": Object {
            "bar": Object {
              "nested": "value",
            },
            "baz": "string value",
          },
        },
        "status": "ONLINE",
        "username": "jsonuser",
      },
      Object {
        "age_range": "[20,30)",
        "catchphrase": "'fat' 'rat'",
        "data": null,
        "status": "ONLINE",
        "username": "dragarcia",
      },
    ]
  `)
})

test('select with head:true', async () => {
  const res = await postgrest.from('users').select('*', { head: true })
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('select with head:true, count:exact', async () => {
  const res = await postgrest.from('users').select('*', { head: true, count: 'exact' })
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": 5,
      "data": null,
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('select with head:true, count:planned', async () => {
  const res = await postgrest.from('users').select('*', { head: true, count: 'planned' })
  expect(res).toMatchInlineSnapshot(
    {
      count: expect.any(Number),
    },
    `
    Object {
      "count": Any<Number>,
      "data": null,
      "error": null,
      "status": 206,
      "statusText": "Partial Content",
    }
  `
  )
})

test('select with head:true, count:estimated', async () => {
  const res = await postgrest.from('users').select('*', { head: true, count: 'estimated' })
  expect(res).toMatchInlineSnapshot(
    {
      count: expect.any(Number),
    },
    `
    Object {
      "count": Any<Number>,
      "data": null,
      "error": null,
      "status": 206,
      "statusText": "Partial Content",
    }
  `
  )
})

test('select with count:exact', async () => {
  const res = await postgrest.from('users').select('*', { count: 'exact' })
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": 5,
      "data": Array [
        Object {
          "age_range": "[1,2)",
          "catchphrase": "'cat' 'fat'",
          "data": null,
          "status": "ONLINE",
          "username": "supabot",
        },
        Object {
          "age_range": "[25,35)",
          "catchphrase": "'bat' 'cat'",
          "data": null,
          "status": "OFFLINE",
          "username": "kiwicopple",
        },
        Object {
          "age_range": "[25,35)",
          "catchphrase": "'bat' 'rat'",
          "data": null,
          "status": "ONLINE",
          "username": "awailas",
        },
        Object {
          "age_range": "[20,30)",
          "catchphrase": "'json' 'test'",
          "data": Object {
            "foo": Object {
              "bar": Object {
                "nested": "value",
              },
              "baz": "string value",
            },
          },
          "status": "ONLINE",
          "username": "jsonuser",
        },
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

test('select with no match', async () => {
  const res = await postgrest.from('users').select().eq('username', 'missing')
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
