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
  embeded_setof_row_one_function_not_nullable: {
    from: 'users',
    select: 'username, user_called_profile_not_null:get_user_profile_non_nullable(*)',
  },
  embeded_setof_row_one_function_with_fields_selection: {
    from: 'users',
    select: 'username, user_called_profile:get_user_profile(username)',
  },
  embeded_setof_function_with_fields_selection_with_sub_linking: {
    from: 'channels',
    select: 'id, all_channels_messages:get_messages(id,message,channels(id,slug))',
  },
  embeded_function_with_table_row_input: {
    from: 'users',
    select: 'username, user_messages:get_user_messages(*)',
  },
  embeded_function_with_view_row_input: {
    from: 'active_users',
    select: 'username, active_user_messages:get_active_user_messages(*)',
  },
  embeded_function_returning_view: {
    from: 'users',
    select: 'username, recent_messages:get_user_recent_messages(*)',
  },
  embeded_function_with_view_input_returning_view: {
    from: 'active_users',
    select: 'username, recent_messages:get_user_recent_messages(*)',
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
  embeded_setof_row_one_function_not_nullable: postgrest
    .from(selectParams.embeded_setof_row_one_function_not_nullable.from)
    .select(selectParams.embeded_setof_row_one_function_not_nullable.select),
  embeded_setof_row_one_function_with_fields_selection: postgrest
    .from(selectParams.embeded_setof_row_one_function_with_fields_selection.from)
    .select(selectParams.embeded_setof_row_one_function_with_fields_selection.select),
  embeded_setof_function_with_fields_selection_with_sub_linking: postgrest
    .from(selectParams.embeded_setof_function_with_fields_selection_with_sub_linking.from)
    .select(selectParams.embeded_setof_function_with_fields_selection_with_sub_linking.select),
  embeded_function_with_table_row_input: postgrest
    .from(selectParams.embeded_function_with_table_row_input.from)
    .select(selectParams.embeded_function_with_table_row_input.select),
  embeded_function_with_view_row_input: postgrest
    .from(selectParams.embeded_function_with_view_row_input.from)
    .select(selectParams.embeded_function_with_view_row_input.select),
  embeded_function_returning_view: postgrest
    .from(selectParams.embeded_function_returning_view.from)
    .select(selectParams.embeded_function_returning_view.select),
  embeded_function_with_view_input_returning_view: postgrest
    .from(selectParams.embeded_function_with_view_input_returning_view.from)
    .select(selectParams.embeded_function_with_view_input_returning_view.select),
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

  test('function embedded table with fields selection and sub linking', async () => {
    const res = await selectQueries.embeded_setof_function_with_fields_selection_with_sub_linking
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "all_channels_messages": Array [
              Object {
                "channels": Object {
                  "id": 1,
                  "slug": "public",
                },
                "id": 1,
                "message": "Hello World 👋",
              },
            ],
            "id": 1,
          },
          Object {
            "all_channels_messages": Array [
              Object {
                "channels": Object {
                  "id": 2,
                  "slug": "random",
                },
                "id": 2,
                "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
              },
            ],
            "id": 2,
          },
          Object {
            "all_channels_messages": Array [
              Object {
                "channels": Object {
                  "id": 3,
                  "slug": "other",
                },
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

  test('function with table row input', async () => {
    const res = await selectQueries.embeded_function_with_table_row_input
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "user_messages": Array [
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
            "user_messages": Array [],
            "username": "kiwicopple",
          },
          Object {
            "user_messages": Array [],
            "username": "awailas",
          },
          Object {
            "user_messages": Array [],
            "username": "jsonuser",
          },
          Object {
            "user_messages": Array [],
            "username": "dragarcia",
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('function with view row input', async () => {
    const res = await selectQueries.embeded_function_with_view_row_input
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "active_user_messages": Array [
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
            "active_user_messages": Array [],
            "username": "awailas",
          },
          Object {
            "active_user_messages": Array [],
            "username": "jsonuser",
          },
          Object {
            "active_user_messages": Array [],
            "username": "dragarcia",
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('function returning view', async () => {
    const res = await selectQueries.embeded_function_returning_view
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "recent_messages": Array [
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
            "username": "supabot",
          },
          Object {
            "recent_messages": Array [],
            "username": "kiwicopple",
          },
          Object {
            "recent_messages": Array [],
            "username": "awailas",
          },
          Object {
            "recent_messages": Array [],
            "username": "jsonuser",
          },
          Object {
            "recent_messages": Array [],
            "username": "dragarcia",
          },
        ],
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
  })

  test('function with view input returning view', async () => {
    const res = await selectQueries.embeded_function_with_view_input_returning_view
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "recent_messages": Array [
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
            "username": "supabot",
          },
          Object {
            "recent_messages": Array [],
            "username": "awailas",
          },
          Object {
            "recent_messages": Array [],
            "username": "jsonuser",
          },
          Object {
            "recent_messages": Array [],
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
  'function with scalar input': postgrest.rpc('get_messages_by_username', {
    search_username: 'supabot',
  }),
  'function with table row input': postgrest.rpc('get_user_messages', {
    //@ts-expect-error will complain about missing the rest of the params
    user_row: { username: 'supabot' },
  }),
  'function with view row input': postgrest.rpc('get_active_user_messages', {
    //@ts-expect-error will complain about missing the rest of the params
    active_user_row: { username: 'supabot', status: 'ONLINE' },
  }),
  'function returning view': postgrest.rpc('get_user_recent_messages', {
    //@ts-expect-error will complain about missing the rest of the params
    user_row: { username: 'supabot' },
  }),
  'function with scalar input returning view': postgrest.rpc('get_recent_messages_by_username', {
    search_username: 'supabot',
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
})
