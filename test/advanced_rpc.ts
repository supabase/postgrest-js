import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'
export const postgrest = new PostgrestClient<Database>(REST_URL)

export const rpcQueries = {
  'function returning a setof embeded table': postgrest.rpc('get_messages', {
    channel_row: { id: 1, data: null, slug: null },
  }),
  'function double definition returning a setof embeded table': postgrest.rpc('get_messages', {
    user_row: {
      username: 'supabot',
      data: null,
      age_range: null,
      catchphrase: null,
      status: 'ONLINE',
    },
  }),
  'function returning a single row embeded table': postgrest.rpc('get_user_profile', {
    user_row: {
      username: 'supabot',
      data: null,
      age_range: null,
      catchphrase: null,
      status: 'ONLINE',
    },
  }),
  'function with scalar input': postgrest.rpc('get_messages_by_username', {
    search_username: 'supabot',
  }),
  'function with table row input': postgrest.rpc('get_user_messages', {
    user_row: {
      username: 'supabot',
      data: null,
      age_range: null,
      catchphrase: null,
      status: 'ONLINE',
    },
  }),
  'function with view row input': postgrest.rpc('get_active_user_messages', {
    active_user_row: {
      username: 'supabot',
      data: null,
      age_range: null,
      catchphrase: null,
      status: 'ONLINE',
    },
  }),
  'function returning view': postgrest.rpc('get_user_recent_messages', {
    user_row: {
      username: 'supabot',
      data: null,
      age_range: null,
      catchphrase: null,
      status: 'ONLINE',
    },
  }),
  'function with scalar input returning view': postgrest.rpc('get_recent_messages_by_username', {
    search_username: 'supabot',
  }),
  'function with scalar input with followup select': postgrest
    .rpc('get_recent_messages_by_username', {
      search_username: 'supabot',
    })
    .select('channel_id, message, users(username, catchphrase)'),
  'function with row input with followup select': postgrest
    .rpc('get_user_profile', {
      user_row: {
        username: 'supabot',
        data: null,
        age_range: null,
        catchphrase: null,
        status: 'ONLINE',
      },
    })
    .select('id, username, users(username, catchphrase)'),
  'unresolvable function with no params': postgrest.rpc('postgrest_unresolvable_function'),
  'unresolvable function with text param': postgrest.rpc('postgrest_unresolvable_function', {
    a: 'test',
  }),
  'unresolvable function with int param': postgrest.rpc('postgrest_unresolvable_function', {
    a: 1,
  }),
  'resolvable function with no params': postgrest.rpc(
    'postgrest_resolvable_with_override_function'
  ),
  'resolvable function with text param': postgrest.rpc(
    'postgrest_resolvable_with_override_function',
    {
      a: 'test',
    }
  ),
  'resolvable function with int param': postgrest.rpc(
    'postgrest_resolvable_with_override_function',
    {
      b: 1,
    }
  ),
  'resolvable function with profile_id param': postgrest.rpc(
    'postgrest_resolvable_with_override_function',
    {
      profile_id: 1,
    }
  ),
  'resolvable function with channel_id and search params': postgrest.rpc(
    'postgrest_resolvable_with_override_function',
    {
      cid: 1,
      search: 'Hello World 👋',
    }
  ),
  'resolvable function with user_row param': postgrest.rpc(
    'postgrest_resolvable_with_override_function',
    {
      user_row: {
        username: 'supabot',
        data: null,
        age_range: null,
        catchphrase: null,
        status: 'ONLINE',
      },
    }
  ),
  'polymorphic function with text param': postgrest.rpc(
    'polymorphic_function_with_different_return',
    {
      '': 'test',
    }
  ),
  'polymorphic function with bool param': postgrest.rpc(
    'polymorphic_function_with_different_return',
    {
      // @ts-expect-error should not have a function with a single unnamed params that isn't json/jsonb/text in types definitions
      '': true,
    }
  ),
  'polymorphic function with unnamed int param': postgrest.rpc(
    // @ts-expect-error should not have a function with a single unnamed params that isn't json/jsonb/text in types definitions
    'polymorphic_function_with_unnamed_integer',
    {
      '': 1,
    }
  ),
  'polymorphic function with unnamed json param': postgrest.rpc(
    'polymorphic_function_with_unnamed_json',
    {
      '': { test: 'value' },
    }
  ),
  'polymorphic function with unnamed jsonb param': postgrest.rpc(
    'polymorphic_function_with_unnamed_jsonb',
    {
      '': { test: 'value' },
    }
  ),
  'polymorphic function with unnamed text param': postgrest.rpc(
    'polymorphic_function_with_unnamed_text',
    {
      '': 'test',
    }
  ),
  'polymorphic function with no params and unnamed params definition call with no params':
    postgrest.rpc('polymorphic_function_with_no_params_or_unnamed'),
  'polymorphic function with unnamed params definition call with bool param': postgrest.rpc(
    'polymorphic_function_with_no_params_or_unnamed',
    {
      // @ts-expect-error should not have generated a type definition for the boolean
      '': true,
    }
  ),
  'polymorphic function with unnamed params definition call with text param': postgrest.rpc(
    'polymorphic_function_with_no_params_or_unnamed',
    {
      '': 'test',
    }
  ),
  'polymorphic function with unnamed default no params': postgrest.rpc(
    'polymorphic_function_with_unnamed_default'
  ),
  'polymorphic function with unnamed default int param': postgrest.rpc(
    'polymorphic_function_with_unnamed_default',
    {
      //@ts-expect-error the type definition for empty params should be text
      '': 123,
    }
  ),
  'polymorphic function with unnamed default text param': postgrest.rpc(
    'polymorphic_function_with_unnamed_default',
    {
      '': 'custom text',
    }
  ),
  'polymorphic function with unnamed default overload no params': postgrest.rpc(
    'polymorphic_function_with_unnamed_default_overload'
  ),
  'polymorphic function with unnamed default overload int param': postgrest.rpc(
    'polymorphic_function_with_unnamed_default_overload',
    {
      //@ts-expect-error the type definition for empty params should be text
      '': 123,
    }
  ),
  'polymorphic function with unnamed default overload text param': postgrest.rpc(
    'polymorphic_function_with_unnamed_default_overload',
    {
      '': 'custom text',
    }
  ),
  'polymorphic function with unnamed default overload bool param': postgrest.rpc(
    'polymorphic_function_with_unnamed_default_overload',
    {
      //@ts-expect-error
      '': true,
    }
  ),
  // @ts-expect-error the function types doesn't exist and should fail to be retrieved by cache
  // for direct rpc call
  'function with blurb_message': postgrest.rpc('blurb_messages', {
    channel_id: 1,
    data: null,
    id: 1,
    message: 'Hello World 👋',
    username: 'supabot',
  }),
  'function returning row': postgrest.rpc('function_returning_row'),
  'function returning set of rows': postgrest.rpc('function_returning_set_of_rows'),
} as const

describe('rpc', () => {
  test('function returning a setof embeded table', async () => {
    const res = await rpcQueries['function returning a setof embeded table']
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
          ],
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('function double definition returning a setof embeded table', async () => {
    const res = await rpcQueries['function double definition returning a setof embeded table']
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

  test('function returning a single row embeded table', async () => {
    const res = await rpcQueries['function returning a single row embeded table']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Array [
            Object {
              "id": 1,
              "username": "supabot",
            },
          ],
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('function with scalar input', async () => {
    const res = await rpcQueries['function with scalar input']
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

  test('function with table row input', async () => {
    const res = await rpcQueries['function with table row input']
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

  test('function with view row input', async () => {
    const res = await rpcQueries['function with view row input']
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

  test('function returning view', async () => {
    const res = await rpcQueries['function returning view']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Array [
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
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('function with scalar input returning view', async () => {
    const res = await rpcQueries['function with scalar input returning view']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Array [
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
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('function with scalar input with followup select', async () => {
    const res = await rpcQueries['function with scalar input with followup select']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Array [
            Object {
              "channel_id": 3,
              "message": "Some message on channel wihtout details",
              "users": Object {
                "catchphrase": "'cat' 'fat'",
                "username": "supabot",
              },
            },
            Object {
              "channel_id": 2,
              "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
              "users": Object {
                "catchphrase": "'cat' 'fat'",
                "username": "supabot",
              },
            },
            Object {
              "channel_id": 1,
              "message": "Hello World 👋",
              "users": Object {
                "catchphrase": "'cat' 'fat'",
                "username": "supabot",
              },
            },
          ],
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('should be able to filter before and after select rpc', async () => {
    const res = await postgrest
      .rpc('get_user_profile', {
        //@ts-expect-error will complain about missing the rest of the params
        user_row: { username: 'supabot' },
      })
      .select('id, username, users(username, catchphrase)')
      .eq('username', 'nope')

    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Array [],
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
    const res2 = await postgrest
      .rpc('get_user_profile', {
        //@ts-expect-error will complain about missing the rest of the params
        user_row: { username: 'supabot' },
      })
      // should also be able to fitler before the select
      .eq('username', 'nope')
      .select('id, username, users(username, catchphrase)')

    expect(res2).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Array [],
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('unresolvable function with text param', async () => {
    const res = await rpcQueries['unresolvable function with text param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": null,
          "error": Object {
            "code": "PGRST203",
            "details": null,
            "hint": "Try renaming the parameters or the function itself in the database so function overloading can be resolved",
            "message": "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => integer), public.postgrest_unresolvable_function(a => text)",
          },
          "status": 300,
          "statusText": "Multiple Choices",
        }
      `)
  })

  test('unresolvable function with int param', async () => {
    const res = await rpcQueries['unresolvable function with int param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": null,
          "error": Object {
            "code": "PGRST203",
            "details": null,
            "hint": "Try renaming the parameters or the function itself in the database so function overloading can be resolved",
            "message": "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => integer), public.postgrest_unresolvable_function(a => text)",
          },
          "status": 300,
          "statusText": "Multiple Choices",
        }
      `)
  })

  test('resolvable function with no params', async () => {
    const res = await rpcQueries['resolvable function with no params']
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

  test('resolvable function with text param', async () => {
    const res = await rpcQueries['resolvable function with text param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": 1,
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('resolvable function with int param', async () => {
    const res = await rpcQueries['resolvable function with int param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('resolvable function with profile_id param', async () => {
    const res = await rpcQueries['resolvable function with profile_id param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Array [
            Object {
              "id": 1,
              "username": "supabot",
            },
          ],
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('resolvable function with channel_id and search params', async () => {
    const res = await rpcQueries['resolvable function with channel_id and search params']
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
          ],
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('resolvable function with user_row param', async () => {
    const res = await rpcQueries['resolvable function with user_row param']
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

  test('polymorphic function with text param', async () => {
    const res = await rpcQueries['polymorphic function with text param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with bool param', async () => {
    const res = await rpcQueries['polymorphic function with bool param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed int param', async () => {
    const res = await rpcQueries['polymorphic function with unnamed int param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": null,
          "error": Object {
            "code": "PGRST202",
            "details": "Searched for the function public.polymorphic_function_with_unnamed_integer with parameter  or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache.",
            "hint": "Perhaps you meant to call the function public.polymorphic_function_with_unnamed_text",
            "message": "Could not find the function public.polymorphic_function_with_unnamed_integer() in the schema cache",
          },
          "status": 404,
          "statusText": "Not Found",
        }
      `)
  })

  test('polymorphic function with unnamed json param', async () => {
    const res = await rpcQueries['polymorphic function with unnamed json param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": 1,
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed jsonb param', async () => {
    const res = await rpcQueries['polymorphic function with unnamed jsonb param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": 1,
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed text param', async () => {
    const res = await rpcQueries['polymorphic function with unnamed text param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": 1,
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with no params and unnamed params definition call with no params', async () => {
    const res = await rpcQueries[
      'polymorphic function with no params and unnamed params definition call with no params'
    ]
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": 1,
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed params definition call with bool param', async () => {
    const res = await rpcQueries[
      'polymorphic function with unnamed params definition call with bool param'
    ]
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed params definition call with text param', async () => {
    const res = await rpcQueries[
      'polymorphic function with unnamed params definition call with text param'
    ]
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed default no params', async () => {
    const res = await rpcQueries['polymorphic function with unnamed default no params']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": null,
          "error": Object {
            "code": "PGRST203",
            "details": null,
            "hint": "Try renaming the parameters or the function itself in the database so function overloading can be resolved",
            "message": "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default(), public.polymorphic_function_with_unnamed_default( => text)",
          },
          "status": 300,
          "statusText": "Multiple Choices",
        }
      `)
  })

  test('polymorphic function with unnamed default int param', async () => {
    const res = await rpcQueries['polymorphic function with unnamed default int param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed default text param', async () => {
    const res = await rpcQueries['polymorphic function with unnamed default text param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed default overload no params', async () => {
    const res = await rpcQueries['polymorphic function with unnamed default overload no params']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": null,
          "error": Object {
            "code": "PGRST203",
            "details": null,
            "hint": "Try renaming the parameters or the function itself in the database so function overloading can be resolved",
            "message": "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default_overload(), public.polymorphic_function_with_unnamed_default_overload( => text)",
          },
          "status": 300,
          "statusText": "Multiple Choices",
        }
      `)
  })

  test('polymorphic function with unnamed default overload int param', async () => {
    const res = await rpcQueries['polymorphic function with unnamed default overload int param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed default overload text param', async () => {
    const res = await rpcQueries['polymorphic function with unnamed default overload text param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('polymorphic function with unnamed default overload bool param', async () => {
    // TODO: res is an union of types because we can't narrow it with an unused field
    const res = await rpcQueries['polymorphic function with unnamed default overload bool param']
    expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": "foo",
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
  })

  test('function with blurb_message', async () => {
    const res = await rpcQueries['function with blurb_message']
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": null,
        "error": Object {
          "code": "PGRST202",
          "details": "Searched for the function public.blurb_messages with parameters channel_id, data, id, message, username or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache.",
          "hint": "Perhaps you meant to call the function public.get_messages",
          "message": "Could not find the function public.blurb_messages(channel_id, data, id, message, username) in the schema cache",
        },
        "status": 404,
        "statusText": "Not Found",
      }
    `)
  })

  test('function returning row', async () => {
    const res = await rpcQueries['function returning row']
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

  test('function returning set of rows', async () => {
    const res = await rpcQueries['function returning set of rows']
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
})
