import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'

test('custom fetch function', async () => {
  const customFetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: () => Promise.resolve('[]'),
    })
  )

  const postgrestWithCustomFetch = new PostgrestClient<Database>(REST_URL, {
    fetch: customFetch,
  })

  await postgrestWithCustomFetch.from('users').select()

  expect(customFetch).toHaveBeenCalledWith(
    expect.stringContaining(REST_URL),
    expect.objectContaining({
      method: 'GET',
      headers: expect.any(Object),
    })
  )
})

test('handles undefined global fetch', async () => {
  // Store original fetch
  const originalFetch = globalThis.fetch
  // Delete global fetch to simulate environments where it's undefined
  delete (globalThis as any).fetch

  try {
    const postgrestClient = new PostgrestClient<Database>(REST_URL)
    const result = await postgrestClient.from('users').select()
    expect(result).toMatchInlineSnapshot(`
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
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
    // Test passes if we reach here without errors, as it means nodeFetch was used
  } finally {
    // Restore original fetch
    globalThis.fetch = originalFetch
  }
})

test('handles array error with 404 status', async () => {
  // Mock the fetch response to return an array error with 404
  const customFetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: () => Promise.resolve('[]'),
    })
  )

  const postgrestWithCustomFetch = new PostgrestClient<Database>(REST_URL, {
    fetch: customFetch,
  })

  const res = await postgrestWithCustomFetch.from('users').select()

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

test('handles empty body with 404 status', async () => {
  // Mock the fetch response to return an empty body with 404
  const customFetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: () => Promise.resolve(''),
    })
  )

  const postgrestWithCustomFetch = new PostgrestClient<Database>(REST_URL, {
    fetch: customFetch,
  })

  const res = await postgrestWithCustomFetch.from('users').select()

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

test('maybeSingle handles zero rows error', async () => {
  const customFetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: false,
      status: 406,
      statusText: 'Not Acceptable',
      text: () =>
        Promise.resolve(
          JSON.stringify({
            code: 'PGRST116',
            details: '0 rows',
            hint: null,
            message: 'JSON object requested, multiple (or no) rows returned',
          })
        ),
    })
  )

  const postgrestWithCustomFetch = new PostgrestClient<Database>(REST_URL, {
    fetch: customFetch,
  })

  const res = await postgrestWithCustomFetch.from('users').select().maybeSingle()

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

test('connection error w/o throwing', async () => {
  const postgrest = new PostgrestClient<Database>('http://foo.invalid')
  let isErrorCaught = false
  await postgrest
    .from('users')
    .select()
    .then(undefined, () => {
      isErrorCaught = true
    })
  expect(isErrorCaught).toBe(false)
})

test('connection error w/ throwOnError', async () => {
  const postgrest = new PostgrestClient<Database>('http://foo.invalid')
  let isErrorCaught = false
  await postgrest
    .from('users')
    .select()
    .throwOnError()
    .then(undefined, () => {
      isErrorCaught = true
    })
  expect(isErrorCaught).toBe(true)
})
