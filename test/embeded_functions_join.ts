import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'
export const postgrest = new PostgrestClient<Database>(REST_URL)

export const selectParams = {
  embeded_setof_function: { from: 'channels', select: 'id, all_channels_messages:get_messages(*)' },
  embeded_setof_function_fields_selection: {
    from: 'channels',
    select: 'id, all_channels_messages:get_messages(id,message)',
  },
  embeded_setof_function_double_definition: {
    from: 'users',
    select: 'username, all_user_messages:get_messages(*)',
  },
  embeded_setof_function_double_definition_fields_selection: {
    from: 'users',
    select: 'username, all_user_messages:get_messages(id,message)',
  },
  embeded_setof_row_one_function: {
    from: 'users',
    select: 'username, user_called_profile:get_user_profile(*)',
  },
  embeded_setof_row_one_function_with_fields_selection: {
    from: 'users',
    select: 'username, user_called_profile:get_user_profile(username)',
  },
} as const

export const selectQueries = {
  embeded_setof_function: postgrest
    .from(selectParams.embeded_setof_function.from)
    .select(selectParams.embeded_setof_function.select),
  embeded_setof_function_fields_selection: postgrest
    .from(selectParams.embeded_setof_function_fields_selection.from)
    .select(selectParams.embeded_setof_function_fields_selection.select),
  embeded_setof_function_double_definition: postgrest
    .from(selectParams.embeded_setof_function_double_definition.from)
    .select(selectParams.embeded_setof_function_double_definition.select),
  embeded_setof_function_double_definition_fields_selection: postgrest
    .from(selectParams.embeded_setof_function_double_definition_fields_selection.from)
    .select(selectParams.embeded_setof_function_double_definition_fields_selection.select),
  embeded_setof_row_one_function: postgrest
    .from(selectParams.embeded_setof_row_one_function.from)
    .select(selectParams.embeded_setof_row_one_function.select),
  embeded_setof_row_one_function_with_fields_selection: postgrest
    .from(selectParams.embeded_setof_row_one_function_with_fields_selection.from)
    .select(selectParams.embeded_setof_row_one_function_with_fields_selection.select),
} as const

describe('select', () => {
  test('function returning a setof embeded table', async () => {
    const res = await selectQueries.embeded_setof_function
    expect(res).toMatchInlineSnapshot(`
          Object {
            "count": null,
            "data": Array [
              Object {
                "all_channels_messages": Array [
                  Object {
                    "channel_id": 1,
                    "data": null,
                    "id": 1,
                    "message": "Hello World 👋",
                    "username": "supabot",
                  },
                ],
                "id": 1,
              },
              Object {
                "all_channels_messages": Array [
                  Object {
                    "channel_id": 2,
                    "data": null,
                    "id": 2,
                    "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
                    "username": "supabot",
                  },
                ],
                "id": 2,
              },
              Object {
                "all_channels_messages": Array [
                  Object {
                    "channel_id": 3,
                    "data": null,
                    "id": 4,
                    "message": "Some message on channel wihtout details",
                    "username": "supabot",
                  },
                ],
                "id": 3,
              },
            ],
            "error": null,
            "status": 200,
            "statusText": "OK",
          }
      `)
  })

  test('function returning a setof embeded table with fields selection', async () => {
    const res = await selectQueries.embeded_setof_function_fields_selection
    expect(res).toMatchInlineSnapshot(`
          Object {
            "count": null,
            "data": Array [
              Object {
                "all_channels_messages": Array [
                  Object {
                    "id": 1,
                    "message": "Hello World 👋",
                  },
                ],
                "id": 1,
              },
              Object {
                "all_channels_messages": Array [
                  Object {
                    "id": 2,
                    "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
                  },
                ],
                "id": 2,
              },
              Object {
                "all_channels_messages": Array [
                  Object {
                    "id": 4,
                    "message": "Some message on channel wihtout details",
                  },
                ],
                "id": 3,
              },
            ],
            "error": null,
            "status": 200,
            "statusText": "OK",
          }
      `)
  })

  test('function double definition returning a setof embeded table', async () => {
    const res = await selectQueries.embeded_setof_function_double_definition
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "all_user_messages": Array [
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
            "username": "supabot",
          },
          Object {
            "all_user_messages": Array [],
            "username": "kiwicopple",
          },
          Object {
            "all_user_messages": Array [],
            "username": "awailas",
          },
          Object {
            "all_user_messages": Array [],
            "username": "jsonuser",
          },
          Object {
            "all_user_messages": Array [],
            "username": "dragarcia",
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('function double definition returning a setof embeded table with fields selection', async () => {
    const res = await selectQueries.embeded_setof_function_double_definition_fields_selection
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "all_user_messages": Array [
              Object {
                "id": 1,
                "message": "Hello World 👋",
              },
              Object {
                "id": 2,
                "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
              },
              Object {
                "id": 4,
                "message": "Some message on channel wihtout details",
              },
            ],
            "username": "supabot",
          },
          Object {
            "all_user_messages": Array [],
            "username": "kiwicopple",
          },
          Object {
            "all_user_messages": Array [],
            "username": "awailas",
          },
          Object {
            "all_user_messages": Array [],
            "username": "jsonuser",
          },
          Object {
            "all_user_messages": Array [],
            "username": "dragarcia",
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('function returning a single row embeded table', async () => {
    const res = await selectQueries.embeded_setof_row_one_function
    expect(res).toMatchInlineSnapshot(`
          Object {
            "count": null,
            "data": Array [
              Object {
                "user_called_profile": Object {
                  "id": 1,
                  "username": "supabot",
                },
                "username": "supabot",
              },
              Object {
                "user_called_profile": null,
                "username": "kiwicopple",
              },
              Object {
                "user_called_profile": null,
                "username": "awailas",
              },
              Object {
                "user_called_profile": null,
                "username": "jsonuser",
              },
              Object {
                "user_called_profile": null,
                "username": "dragarcia",
              },
            ],
            "error": null,
            "status": 200,
            "statusText": "OK",
          }
      `)
  })

  test('function returning a single row embeded table with fields selection', async () => {
    const res = await selectQueries.embeded_setof_row_one_function_with_fields_selection
    expect(res).toMatchInlineSnapshot(`
          Object {
            "count": null,
            "data": Array [
              Object {
                "user_called_profile": Object {
                  "username": "supabot",
                },
                "username": "supabot",
              },
              Object {
                "user_called_profile": null,
                "username": "kiwicopple",
              },
              Object {
                "user_called_profile": null,
                "username": "awailas",
              },
              Object {
                "user_called_profile": null,
                "username": "jsonuser",
              },
              Object {
                "user_called_profile": null,
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

export const rpcQueries = {
  'function returning a setof embeded table': postgrest.rpc('get_messages', {
    //@ts-expect-error will complain about missing the rest of the params
    channel_row: { id: 1 },
  }),
  'function double definition returning a setof embeded table': postgrest.rpc('get_messages', {
    //@ts-expect-error will complain about missing the rest of the params
    user_row: { username: 'supabot' },
  }),
  'function returning a single row embeded table': postgrest.rpc('get_user_profile', {
    //@ts-expect-error will complain about missing the rest of the params
    user_row: { username: 'supabot' },
  }),
}

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
})
