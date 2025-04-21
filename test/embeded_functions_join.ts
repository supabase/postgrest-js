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
  embeded_function_with_blurb_message: {
    from: 'users',
    select: 'username, user_messages:get_user_messages(id,message,blurb_message)',
  },
  embeded_function_returning_row: {
    from: 'channels',
    select: 'id, user:function_returning_row(*)',
  },
  embeded_function_returning_set_of_rows: {
    from: 'channels',
    select: 'id, users:function_returning_set_of_rows(*)',
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
  embeded_function_with_blurb_message: postgrest
    .from(selectParams.embeded_function_with_blurb_message.from)
    .select(selectParams.embeded_function_with_blurb_message.select),
  embeded_function_returning_row: postgrest
    .from(selectParams.embeded_function_returning_row.from)
    .select(selectParams.embeded_function_returning_row.select),
  embeded_function_returning_set_of_rows: postgrest
    .from(selectParams.embeded_function_returning_set_of_rows.from)
    .select(selectParams.embeded_function_returning_set_of_rows.select),
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

  test('function with blurb_message', async () => {
    const res = await selectQueries.embeded_function_with_blurb_message
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Array [
          Object {
            "user_messages": Array [
              Object {
                "blurb_message": "Hel",
                "id": 1,
                "message": "Hello World 👋",
              },
              Object {
                "blurb_message": "Per",
                "id": 2,
                "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
              },
              Object {
                "blurb_message": "Som",
                "id": 4,
                "message": "Some message on channel wihtout details",
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

  test('function returning row', async () => {
    const res = await selectQueries.embeded_function_returning_row
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": null,
        "error": Object {
          "code": "PGRST200",
          "details": "Searched for a foreign key relationship between 'channels' and 'function_returning_row' in the schema 'public', but no matches were found.",
          "hint": null,
          "message": "Could not find a relationship between 'channels' and 'function_returning_row' in the schema cache",
        },
        "status": 400,
        "statusText": "Bad Request",
      }
    `)
  })

  test('function returning set of rows', async () => {
    const res = await selectQueries.embeded_function_returning_set_of_rows
    expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": null,
        "error": Object {
          "code": "PGRST200",
          "details": "Searched for a foreign key relationship between 'channels' and 'function_returning_set_of_rows' in the schema 'public', but no matches were found.",
          "hint": null,
          "message": "Could not find a relationship between 'channels' and 'function_returning_set_of_rows' in the schema cache",
        },
        "status": 400,
        "statusText": "Bad Request",
      }
    `)
  })
})
