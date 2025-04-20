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
      // @ts-expect-error should not have the unnamed boolean type definition
      '': true,
    }
  ),
  'polymorphic function with unnamed int param': postgrest.rpc(
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
        "data": "toto",
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
        "data": null,
        "error": null,
        "status": 204,
        "statusText": "No Content",
      }
    `)
  })

  test('polymorphic function with bool param', async () => {
    const res = await rpcQueries['polymorphic function with bool param']
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
})
