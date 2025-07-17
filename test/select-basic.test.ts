import { PostgrestClient } from '../src/index'
import { CustomUserDataType, Database } from './types.override'

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
          "catchphrase": "'fat' 'rat'",
          "data": null,
          "status": "ONLINE",
          "username": "dragarcia",
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
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "OFFLINE",
          "username": "testuser",
        },
        Object {
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "ONLINE",
          "username": "testuser1",
        },
        Object {
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "ONLINE",
          "username": "testuser2",
        },
        Object {
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "ONLINE",
          "username": "testuser3",
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
          "catchphrase": "'fat' 'rat'",
          "data": null,
          "status": "ONLINE",
          "username": "dragarcia",
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
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "OFFLINE",
          "username": "testuser",
        },
        Object {
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "ONLINE",
          "username": "testuser1",
        },
        Object {
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "ONLINE",
          "username": "testuser2",
        },
        Object {
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "ONLINE",
          "username": "testuser3",
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
        "details": "Results contain 9 rows, application/vnd.pgrst.object+json requires 1 row",
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
        "details": "The result contains 9 rows",
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
          "username": "dragarcia",
        },
        Object {
          "non_updatable_column": 1,
          "username": "jsonuser",
        },
        Object {
          "non_updatable_column": 1,
          "username": "testuser",
        },
        Object {
          "non_updatable_column": 1,
          "username": "testuser1",
        },
        Object {
          "non_updatable_column": 1,
          "username": "testuser2",
        },
        Object {
          "non_updatable_column": 1,
          "username": "testuser3",
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
        "catchphrase": "'fat' 'rat'",
        "data": null,
        "status": "ONLINE",
        "username": "dragarcia",
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
        "age_range": null,
        "catchphrase": null,
        "data": null,
        "status": "OFFLINE",
        "username": "testuser",
      },
      Object {
        "age_range": null,
        "catchphrase": null,
        "data": null,
        "status": "ONLINE",
        "username": "testuser1",
      },
      Object {
        "age_range": null,
        "catchphrase": null,
        "data": null,
        "status": "ONLINE",
        "username": "testuser2",
      },
      Object {
        "age_range": null,
        "catchphrase": null,
        "data": null,
        "status": "ONLINE",
        "username": "testuser3",
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
      "count": 9,
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
      "count": 9,
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
          "catchphrase": "'fat' 'rat'",
          "data": null,
          "status": "ONLINE",
          "username": "dragarcia",
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
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "OFFLINE",
          "username": "testuser",
        },
        Object {
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "ONLINE",
          "username": "testuser1",
        },
        Object {
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "ONLINE",
          "username": "testuser2",
        },
        Object {
          "age_range": null,
          "catchphrase": null,
          "data": null,
          "status": "ONLINE",
          "username": "testuser3",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
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
