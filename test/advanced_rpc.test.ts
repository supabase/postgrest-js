//@ts-nocheck
import { PostgrestClient } from '../src/index'
import { Database } from './types.override'
import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { SelectQueryError } from '../src/select-query-parser/utils'

const REST_URL = 'http://localhost:3000'
export const postgrest = new PostgrestClient<Database>(REST_URL)

type Schema = Database['public']
// TODO: blurb_message is a computed field on the messages table not included in the messages postgres record results
type UsersWithoutBlurb = Omit<Schema['Tables']['messages']['Row'], 'blurb_message'>

describe('advanced rpc', () => {
  test('function returning a setof embeded table', async () => {
    const res = await postgrest.rpc('get_messages', {
      channel_row: { id: 1, data: null, slug: null },
    })
    let result: Exclude<typeof res.data, null>
    let expected: Array<UsersWithoutBlurb>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('get_messages', {
      user_row: {
        username: 'supabot',
        data: null,
        age_range: null,
        catchphrase: null,
        status: 'ONLINE',
      },
    })
    let result: Exclude<typeof res.data, null>
    let expected: Array<UsersWithoutBlurb>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('function returning a single row embeded table', async () => {
    const res = await postgrest.rpc('get_user_profile', {
      user_row: {
        username: 'supabot',
        data: null,
        age_range: null,
        catchphrase: null,
        status: 'ONLINE',
      },
    })
    let result: Exclude<typeof res.data, null>
    let expected: Schema['Tables']['user_profiles']['Row']
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('get_messages_by_username', {
      search_username: 'supabot',
    })
    // Type assertion
    let result: Exclude<typeof res.data, null>
    let expected: Array<UsersWithoutBlurb>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
    // Runtime result
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
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('function with table row input', async () => {
    const res = await postgrest.rpc('get_user_messages', {
      user_row: {
        username: 'supabot',
        data: null,
        age_range: null,
        catchphrase: null,
        status: 'ONLINE',
      },
    })
    let result: Exclude<typeof res.data, null>
    let expected: Array<UsersWithoutBlurb>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('function with view row input', async () => {
    const res = await postgrest.rpc('get_active_user_messages', {
      active_user_row: {
        username: 'supabot',
        data: null,
        age_range: null,
        catchphrase: null,
        status: 'ONLINE',
      },
    })
    let result: Exclude<typeof res.data, null>
    let expected: Array<UsersWithoutBlurb>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('function returning view', async () => {
    const res = await postgrest.rpc('get_user_recent_messages', {
      user_row: {
        username: 'supabot',
        data: null,
        age_range: null,
        catchphrase: null,
        status: 'ONLINE',
      },
    })
    let result: Exclude<typeof res.data, null>
    let expected: Array<Schema['Views']['recent_messages']['Row']>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
            "channel_id": 3,
            "data": null,
            "id": 3,
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
    const res = await postgrest.rpc('get_recent_messages_by_username', {
      search_username: 'supabot',
    })
    let result: Exclude<typeof res.data, null>
    let expected: Array<Schema['Views']['recent_messages']['Row']>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
            "channel_id": 3,
            "data": null,
            "id": 3,
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
    const res = await postgrest
      .rpc('get_recent_messages_by_username', {
        search_username: 'supabot',
      })
      .select('channel_id, message, users(username, catchphrase)')
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      channel_id: number | null
      message: string | null
      users: {
        catchphrase: unknown
        username: string
      } | null
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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

  test('function with row input with followup select', async () => {
    const res = await postgrest
      .rpc('get_user_profile', {
        user_row: {
          username: 'supabot',
          data: null,
          age_range: null,
          catchphrase: null,
          status: 'ONLINE',
        },
      })
      .select('id, username, users(username, catchphrase)')
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      id: number
      username: string | null
      users: {
        catchphrase: unknown
        username: string
      } | null
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "id": 1,
            "username": "supabot",
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
      //@ts-expect-error will complain about missing the rest of the params
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
    const res3 = await postgrest
      .rpc('get_user_profile', {
        //@ts-expect-error will complain about missing the rest of the params
        user_row: { username: 'supabot' },
      })
      // should also be able to fitler before the select
      .eq('username', 'supabot')
      .select('username, users(username, catchphrase)')

    expect(res3).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "username": "supabot",
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

  test('unresolvable function with no params', async () => {
    const res = await postgrest.rpc('postgrest_unresolvable_function')
    let result: Exclude<typeof res.data, null>
    let expected: undefined
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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

  test('unresolvable function with text param', async () => {
    const res = await postgrest.rpc('postgrest_unresolvable_function', {
      a: 'test',
    })
    let result: Exclude<typeof res.data, null>
    // Should be an error response due to ambiguous function resolution
    let expected: SelectQueryError<'Could not choose the best candidate function between: postgrest_unresolvable_function(a => int4), postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('postgrest_unresolvable_function', {
      a: 1,
    })
    let result: Exclude<typeof res.data, null>
    // Should be an error response due to ambiguous function resolution
    let expected: SelectQueryError<'Could not choose the best candidate function between: postgrest_unresolvable_function(a => int4), postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('postgrest_resolvable_with_override_function')
    let result: Exclude<typeof res.data, null>
    let expected: undefined
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('postgrest_resolvable_with_override_function', {
      a: 'test',
    })
    let result: Exclude<typeof res.data, null>
    let expected: number
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('postgrest_resolvable_with_override_function', {
      b: 1,
    })
    let result: Exclude<typeof res.data, null>
    let expected: string
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('postgrest_resolvable_with_override_function', {
      profile_id: 1,
    })
    let result: Exclude<typeof res.data, null>
    let expected: Array<Schema['Tables']['user_profiles']['Row']>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('postgrest_resolvable_with_override_function', {
      cid: 1,
      search: 'Hello World 👋',
    })
    let result: Exclude<typeof res.data, null>
    let expected: Array<UsersWithoutBlurb>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('postgrest_resolvable_with_override_function', {
      user_row: {
        username: 'supabot',
        data: null,
        age_range: null,
        catchphrase: null,
        status: 'ONLINE',
      },
    })
    let result: Exclude<typeof res.data, null>
    let expected: Array<UsersWithoutBlurb>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('polymorphic function with text param', async () => {
    const res = await postgrest.rpc('polymorphic_function_with_different_return', {
      '': 'test',
    })
    let result: Exclude<typeof res.data, null>
    let expected: string
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_different_return', {
      // @ts-expect-error should not have a function with a single unnamed params that isn't json/jsonb/text in types definitions
      '': true,
    })
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
    const res = await postgrest.rpc(
      // @ts-expect-error should not have a function with a single unnamed params that isn't json/jsonb/text in types definitions
      'polymorphic_function_with_unnamed_integer',
      {
        '': 1,
      }
    )
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_json', {
      '': { test: 'value' },
    })
    let result: Exclude<typeof res.data, null>
    let expected: number
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_jsonb', {
      '': { test: 'value' },
    })
    let result: Exclude<typeof res.data, null>
    let expected: number
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_text', {
      '': 'test',
    })
    let result: Exclude<typeof res.data, null>
    let expected: number
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_no_params_or_unnamed')
    let result: Exclude<typeof res.data, null>
    let expected: number
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_no_params_or_unnamed', {
      // @ts-expect-error should not have generated a type definition for the boolean
      '': true,
    })
    let result: Exclude<typeof res.data, null>
    // TODO: since this call use an invalid type definition, we can't distinguish between the "no values" or the "empty"
    // property call:
    // polymorphic_function_with_no_params_or_unnamed:
    // | {
    //     Args: Record<PropertyKey, never>
    //     Returns: number
    //   }
    // | {
    //     Args: { '': string }
    //     Returns: string
    //   }
    // A type error would be raised at higher level (argument providing) time though
    let expected: string | number
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_no_params_or_unnamed', {
      '': 'test',
    })
    let result: Exclude<typeof res.data, null>
    let expected: string
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_default')
    let result: Exclude<typeof res.data, null>
    let expected: SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default( => int4), polymorphic_function_with_unnamed_default(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_default', {
      //@ts-expect-error the type definition for empty params should be text
      '': 123,
    })
    let result: Exclude<typeof res.data, null>
    // TODO: since this call use an invalid type definition, we can't distinguish between the "no values" or the "empty"
    // A type error would be raised at higher level (argument providing) time though
    let expected:
      | string
      | SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default( => int4), polymorphic_function_with_unnamed_default(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_default', {
      '': 'custom text',
    })
    let result: Exclude<typeof res.data, null>
    let expected: string
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_default_overload')
    let result: Exclude<typeof res.data, null>
    let expected: SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default_overload( => int4), polymorphic_function_with_unnamed_default_overload(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_default_overload', {
      //@ts-expect-error the type definition for empty params should be text
      '': 123,
    })
    let result: Exclude<typeof res.data, null>
    // TODO: since this call use an invalid type definition, we can't distinguish between the "no values" or the "empty"
    // A type error would be raised at higher level (argument providing) time though
    let expected:
      | string
      | SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default_overload( => int4), polymorphic_function_with_unnamed_default_overload(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_default_overload', {
      '': 'custom text',
    })
    let result: Exclude<typeof res.data, null>
    let expected: string
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('polymorphic_function_with_unnamed_default_overload', {
      //@ts-expect-error
      '': true,
    })
    let result: Exclude<typeof res.data, null>
    // TODO: since this call use an invalid type definition, we can't distinguish between the "no values" or the "empty"
    // A type error would be raised at higher level (argument providing) time though
    let expected:
      | string
      | SelectQueryError<'Could not choose the best candidate function between: polymorphic_function_with_unnamed_default_overload( => int4), polymorphic_function_with_unnamed_default_overload(). Try renaming the parameters or the function itself in the database so function overloading can be resolved'>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    // @ts-expect-error the function types doesn't exist and should fail to be retrieved by cache
    // for direct rpc call
    const res = await postgrest.rpc('blurb_messages', {
      channel_id: 1,
      data: null,
      id: 1,
      message: 'Hello World 👋',
      username: 'supabot',
    })
    let result: Exclude<typeof res.data, null>
    let expected: never
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('function_returning_row')
    let result: Exclude<typeof res.data, null>
    let expected: {
      age_range: unknown
      catchphrase: unknown
      data: unknown
      status: 'ONLINE' | 'OFFLINE' | null
      username: string
    }
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
    const res = await postgrest.rpc('function_returning_set_of_rows')
    let result: Exclude<typeof res.data, null>
    let expected: Array<{
      age_range: unknown
      catchphrase: unknown
      data: unknown
      status: 'ONLINE' | 'OFFLINE' | null
      username: string
    }>
    expectType<TypeEqual<typeof result, typeof expected>>(true)
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
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })
})
