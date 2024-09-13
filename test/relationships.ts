import { PostgrestClient } from '../src/index'
import { Database } from './types'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

const userColumn: 'catchphrase' | 'username' = 'username'

export const selectQueries = {
  manyToOne: postgrest.from('messages').select('user:users(*)'),
  inner: postgrest.from('messages').select('channels!inner(*, channel_details!inner(*))'),
  oneToMany: postgrest.from('users').select('messages(*)'),
  oneToManySelective: postgrest.from('users').select('messages(data)'),
  oneToOne: postgrest.from('channels').select('channel_details(*)'),
  leftOneToOne: postgrest.from('channel_details').select('channels!left(*)'),
  leftOneToMany: postgrest.from('users').select('messages!left(*)'),
  leftZeroToOne: postgrest.from('user_profiles').select('users!left(*)'),
  leftOneToOneUsers: postgrest.from('users').select('user_profiles!left(username)'),
  oneToOneUsersColumnName: postgrest.from('users').select('user_profiles(username)'),
  leftZeroToOneUserProfiles: postgrest.from('user_profiles').select('*,users!left(*)'),
  leftZeroToOneUserProfilesWithNullables: postgrest
    .from('user_profiles')
    .select('*,users!left(status)'),
  joinOneToOne: postgrest.from('channel_details').select('channels!left(id)'),
  joinOneToMany: postgrest.from('users').select('messages!left(username)'),
  joinZeroToOne: postgrest.from('user_profiles').select('users!left(status)'),
  joinOneToOneWithFkHint: postgrest
    .from('best_friends')
    .select(
      'first_user:users!best_friends_first_user_fkey(*), second_user:users!best_friends_second_user_fkey(*), third_wheel:users!best_friends_third_wheel_fkey(*)'
    ),
  joinOneToManyWithFkHint: postgrest.from('users')
    .select(`first_friend_of:best_friends!best_friends_first_user_fkey(*),
        second_friend_of:best_friends!best_friends_second_user_fkey(*),
        third_wheel_of:best_friends!best_friends_third_wheel_fkey(*)`),
  joinOneToManyUsersWithFkHint: postgrest.from('users').select(
    `first_friend_of:best_friends_first_user_fkey(*),
        second_friend_of:best_friends_second_user_fkey(*),
        third_wheel_of:best_friends_third_wheel_fkey(*)`
  ),
  joinOneToManyUsersWithFkHintSelective: postgrest.from('users').select(
    `first_friend_of:best_friends_first_user_fkey(id),
        second_friend_of:best_friends_second_user_fkey(*),
        third_wheel_of:best_friends_third_wheel_fkey(*)`
  ),
  joinOneToOneWithNullablesFkHint: postgrest
    .from('best_friends')
    .select(
      'first_user:users!best_friends_first_user_fkey(*), second_user:users!best_friends_second_user_fkey(*), third_wheel:users!best_friends_third_wheel_fkey(*)'
    ),
  joinOneToOneWithNullablesNoHint: postgrest
    .from('best_friends')
    .select('first_user:users(*), second_user:users(*), third_wheel:users(*)'),
  joinOneToOneWithNullablesColumnHint: postgrest
    .from('best_friends')
    .select(
      'first_user:users!first_user(*), second_user:users!second_user(*), third_wheel:users!third_wheel(*)'
    ),
  joinOneToManyWithNullablesNoHint: postgrest
    .from('users')
    .select(
      'first_friend_of:best_friends(*), second_friend_of:best_friends(*), third_wheel_of:best_friends(*)'
    ),
  joinOneToManyWithNullablesColumnHint: postgrest
    .from('users')
    .select(
      'first_friend_of:best_friends!first_user(*), second_friend_of:best_friends!second_user(*), third_wheel_of:best_friends!third_wheel(*)'
    ),
  joinOneToManyWithNullablesColumnHintOnNestedRelation: postgrest
    .from('users')
    .select(
      'first_friend_of:best_friends!first_user(*, first_user:users!first_user(*)), second_friend_of:best_friends!second_user(*), third_wheel_of:best_friends!third_wheel(*)'
    ),
  joinOneToManyWithNullablesNoHintOnNestedRelation: postgrest
    .from('users')
    .select(
      'first_friend_of:best_friends!first_user(*, first_user:users(*)), second_friend_of:best_friends!second_user(*), third_wheel_of:best_friends!third_wheel(*)'
    ),
  joinSelectViaColumn: postgrest.from('user_profiles').select('username(*)'),
  joinSelectViaColumnSelective: postgrest.from('user_profiles').select('username(status)'),
  joinSelectViaColumnAndAlias: postgrest.from('user_profiles').select('user:username(*)'),
  joinSelectViaUniqueTableRelationship: postgrest.from('user_profiles').select('users(*)'),
  queryWithMultipleOneToManySelectives: postgrest
    .from('users')
    .select('username, messages(id), user_profiles(id)'),
  nestedQueryWithMultipleLevelsAndSelectiveFields: postgrest
    .from('users')
    .select('username, messages(id, message, channels(id, slug))'),
  nestedQueryWithSelectiveFields: postgrest.from('users').select('username, messages(id, message)'),
  selectionWithStringTemplating: postgrest.from('users').select(`status, ${userColumn}`),
  selectWithAggregateCountFunction: postgrest.from('users').select('username, messages(count)'),
  selectWithAggregateCountFunctionAndAlias: postgrest
    .from('users')
    .select('username, messages(message_count:count())'),
  selectWithAggregateNestedCountFunction: postgrest
    .from('users')
    .select('username, messages(channels(count))'),
  selectWithAggregateNestedCountFunctionAndAlias: postgrest
    .from('users')
    .select('username, messages(channels(channel_count:count()))'),
  selectWithAggregateSumFunction: postgrest.from('users').select('username, messages(id.sum())'),
  selectWithAggregateAliasedSumFunction: postgrest
    .from('users')
    .select('username, messages(sum_id:id.sum())'),
  selectWithAggregateSumFunctionOnNestedRelation: postgrest
    .from('users')
    .select('username, messages(channels(id.sum()))'),
}

test('nested query with selective fields', async () => {
  const { data, error } = await selectQueries.nestedQueryWithSelectiveFields.limit(1).single()
  expect(error).toBeNull()
  expect(data).toMatchInlineSnapshot(`
    Object {
      "messages": Array [
        Object {
          "id": 1,
          "message": "Hello World 👋",
        },
        Object {
          "id": 2,
          "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
        },
      ],
      "username": "supabot",
    }
  `)
})

test('nested query with multiple levels and selective fields', async () => {
  const { data, error } = await selectQueries.nestedQueryWithMultipleLevelsAndSelectiveFields
    .limit(1)
    .single()
  expect(error).toBeNull()
  expect(data).toMatchInlineSnapshot(`
    Object {
      "messages": Array [
        Object {
          "channels": Object {
            "id": 1,
            "slug": "public",
          },
          "id": 1,
          "message": "Hello World 👋",
        },
        Object {
          "channels": Object {
            "id": 2,
            "slug": "random",
          },
          "id": 2,
          "message": "Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.",
        },
      ],
      "username": "supabot",
    }
  `)
})

test('query with multiple one-to-many relationships', async () => {
  const { data, error } = await selectQueries.queryWithMultipleOneToManySelectives.limit(1).single()
  expect(error).toBeNull()
  expect(data).toMatchInlineSnapshot(`
    Object {
      "messages": Array [
        Object {
          "id": 1,
        },
        Object {
          "id": 2,
        },
      ],
      "user_profiles": Array [
        Object {
          "id": 1,
        },
      ],
      "username": "supabot",
    }
  `)
})

test('many-to-one relationship', async () => {
  const { data: message, error } = await selectQueries.manyToOne.limit(1).single()
  expect(error).toBeNull()
  expect(message).toBeDefined()
  expect(message!.user).toBeDefined()
  expect(typeof message!.user).toBe('object')
  expect(message).toMatchInlineSnapshot(`
    Object {
      "user": Object {
        "age_range": "[1,2)",
        "catchphrase": "'cat' 'fat'",
        "data": null,
        "status": "ONLINE",
        "username": "supabot",
      },
    }
  `)
})

test('!inner relationship', async () => {
  const { data: message, error } = await selectQueries.inner.limit(1).single()
  expect(error).toBeNull()
  expect(message).toBeDefined()
  expect(message!.channels).toBeDefined()
  expect(typeof message!.channels).toBe('object')
  expect(message!.channels.channel_details).toBeDefined()
  expect(typeof message!.channels.channel_details).toBe('object')
  expect(message).toMatchInlineSnapshot(`
    Object {
      "channels": Object {
        "channel_details": Object {
          "details": "Details for public channel",
          "id": 1,
        },
        "data": null,
        "id": 1,
        "slug": "public",
      },
    }
  `)
})

test('one-to-many relationship', async () => {
  const { data: user, error } = await selectQueries.oneToMany.limit(1).single()
  expect(error).toBeNull()
  expect(user).toBeDefined()
  expect(Array.isArray(user!.messages)).toBe(true)
  expect(user).toMatchInlineSnapshot(`
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
    }
  `)
})

test('one-to-many relationship with selective columns', async () => {
  const { data: user, error } = await selectQueries.oneToManySelective.limit(1).single()
  expect(error).toBeNull()
  expect(user).toBeDefined()
  expect(Array.isArray(user!.messages)).toBe(true)
  expect(user).toMatchInlineSnapshot(`
    Object {
      "messages": Array [
        Object {
          "data": null,
        },
        Object {
          "data": null,
        },
      ],
    }
  `)
})

test('one-to-one relationship', async () => {
  const { data: channels, error } = await selectQueries.oneToOne.limit(1).single()
  expect(error).toBeNull()
  expect(channels).toBeDefined()
  expect(channels!.channel_details).toBeDefined()
  expect(typeof channels!.channel_details).toBe('object')
})

test('!left oneToOne', async () => {
  const { data: oneToOne, error } = await selectQueries.leftOneToOne.limit(1).single()

  expect(error).toBeNull()
  expect(oneToOne).toBeDefined()
  expect(oneToOne!.channels).toBeDefined()
  expect(typeof oneToOne!.channels).toBe('object')
})

test('!left oneToMany', async () => {
  const { data: oneToMany, error } = await selectQueries.leftOneToMany.limit(1).single()

  expect(error).toBeNull()
  expect(oneToMany).toBeDefined()
  expect(Array.isArray(oneToMany!.messages)).toBe(true)
  expect(oneToMany).toMatchInlineSnapshot(`
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
    }
  `)
})

test('!left zeroToOne', async () => {
  const { data: zeroToOne, error } = await selectQueries.leftZeroToOne.limit(1).single()

  expect(error).toBeNull()
  expect(zeroToOne).toBeDefined()
  expect(zeroToOne!.users).toBeDefined()
  expect(typeof zeroToOne!.users).toBe('object')
})

test('join over a 1-1 relation with both nullables and non-nullables fields using foreign key name for hinting', async () => {
  const { data: bestFriends, error } = await selectQueries.joinOneToOneWithFkHint.limit(1).single()

  expect(error).toBeNull()
  expect(bestFriends).toBeDefined()
  expect(bestFriends!.first_user).toBeDefined()
  expect(bestFriends!.second_user).toBeDefined()
  expect(bestFriends!.third_wheel).toBeDefined()
  expect(typeof bestFriends!.first_user).toBe('object')
  expect(typeof bestFriends!.second_user).toBe('object')
  expect(typeof bestFriends!.third_wheel).toBe('object')
})

test('join over a 1-M relation with both nullables and non-nullables fields using foreign key name for hinting', async () => {
  const { data: users, error } = await selectQueries.joinOneToManyWithFkHint.limit(1).single()

  expect(error).toBeNull()
  expect(users).toBeDefined()
  expect(Array.isArray(users!.first_friend_of)).toBe(true)
  expect(Array.isArray(users!.second_friend_of)).toBe(true)
  expect(Array.isArray(users!.third_wheel_of)).toBe(true)
  expect(typeof users!.first_friend_of[0]).toBe('object')
})

test('join on 1-M relation', async () => {
  const res = await selectQueries.joinOneToManyUsersWithFkHint
    .eq('username', 'supabot')
    .limit(1)
    .single()
  expect(Array.isArray(res.data?.first_friend_of)).toBe(true)
  expect(Array.isArray(res.data?.second_friend_of)).toBe(true)
  expect(Array.isArray(res.data?.third_wheel_of)).toBe(true)
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "first_friend_of": Array [
            Object {
              "first_user": "supabot",
              "id": 1,
              "second_user": "kiwicopple",
              "third_wheel": "awailas",
            },
            Object {
              "first_user": "supabot",
              "id": 2,
              "second_user": "awailas",
              "third_wheel": null,
            },
          ],
          "second_friend_of": Array [],
          "third_wheel_of": Array [],
        },
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('join on 1-1 relation with nullables', async () => {
  const res = await selectQueries.joinOneToOneWithNullablesFkHint.order('id').limit(1).single()
  expect(Array.isArray(res.data?.first_user)).toBe(false)
  expect(Array.isArray(res.data?.second_user)).toBe(false)
  expect(Array.isArray(res.data?.third_wheel)).toBe(false)
  // TODO: This should return null only if the column is actually nullable thoses are not
  expect(res.data?.first_user?.username).not.toBeNull()
  expect(res.data?.second_user?.username).not.toBeNull()
  // TODO: This column however is nullable
  expect(res.data?.third_wheel?.username).not.toBeNull()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "first_user": Object {
            "age_range": "[1,2)",
            "catchphrase": "'cat' 'fat'",
            "data": null,
            "status": "ONLINE",
            "username": "supabot",
          },
          "second_user": Object {
            "age_range": "[25,35)",
            "catchphrase": "'bat' 'cat'",
            "data": null,
            "status": "OFFLINE",
            "username": "kiwicopple",
          },
          "third_wheel": Object {
            "age_range": "[25,35)",
            "catchphrase": "'bat' 'rat'",
            "data": null,
            "status": "ONLINE",
            "username": "awailas",
          },
        },
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('join over a 1-1 relation with both nullables and non-nullables fields with no hinting', async () => {
  const { error } = await selectQueries.joinOneToOneWithNullablesNoHint.single()

  expect(error).toMatchInlineSnapshot(`
    Object {
      "code": "PGRST201",
      "details": Array [
        Object {
          "cardinality": "many-to-one",
          "embedding": "best_friends with users",
          "relationship": "best_friends_first_user_fkey using best_friends(first_user) and users(username)",
        },
        Object {
          "cardinality": "many-to-one",
          "embedding": "best_friends with users",
          "relationship": "best_friends_second_user_fkey using best_friends(second_user) and users(username)",
        },
        Object {
          "cardinality": "many-to-one",
          "embedding": "best_friends with users",
          "relationship": "best_friends_third_wheel_fkey using best_friends(third_wheel) and users(username)",
        },
      ],
      "hint": "Try changing 'users' to one of the following: 'users!best_friends_first_user_fkey', 'users!best_friends_second_user_fkey', 'users!best_friends_third_wheel_fkey'. Find the desired relationship in the 'details' key.",
      "message": "Could not embed because more than one relationship was found for 'best_friends' and 'users'",
    }
  `)
})

test('join over a 1-1 relation with both nullablesand non-nullables fields with column name hinting', async () => {
  const { data: bestFriends, error } = await selectQueries.joinOneToOneWithNullablesColumnHint
    .limit(1)
    .single()
  expect(error).toBeNull()
  expect(bestFriends).toBeDefined()
  expect(bestFriends!.first_user).toBeDefined()
  expect(bestFriends!.second_user).toBeDefined()
  expect(bestFriends!.third_wheel).toBeDefined()
  expect(typeof bestFriends!.first_user).toBe('object')
  expect(typeof bestFriends!.second_user).toBe('object')
  expect(typeof bestFriends!.third_wheel).toBe('object')
})

test('join over a 1-M relation with both nullables and non-nullables fields with no hinting', async () => {
  const { error } = await selectQueries.joinOneToManyWithNullablesNoHint.limit(1).single()
  expect(error).toMatchInlineSnapshot(`
    Object {
      "code": "PGRST201",
      "details": Array [
        Object {
          "cardinality": "one-to-many",
          "embedding": "users with best_friends",
          "relationship": "best_friends_first_user_fkey using users(username) and best_friends(first_user)",
        },
        Object {
          "cardinality": "one-to-many",
          "embedding": "users with best_friends",
          "relationship": "best_friends_second_user_fkey using users(username) and best_friends(second_user)",
        },
        Object {
          "cardinality": "one-to-many",
          "embedding": "users with best_friends",
          "relationship": "best_friends_third_wheel_fkey using users(username) and best_friends(third_wheel)",
        },
      ],
      "hint": "Try changing 'best_friends' to one of the following: 'best_friends!best_friends_first_user_fkey', 'best_friends!best_friends_second_user_fkey', 'best_friends!best_friends_third_wheel_fkey'. Find the desired relationship in the 'details' key.",
      "message": "Could not embed because more than one relationship was found for 'users' and 'best_friends'",
    }
  `)
})

test('join over a 1-M relation with both nullables and non-nullables fields using column name for hinting', async () => {
  const { data: users, error } = await selectQueries.joinOneToManyWithNullablesColumnHint
    .limit(1)
    .single()
  expect(error).toBeNull()
  expect(users).toBeDefined()
  expect(Array.isArray(users!.first_friend_of)).toBe(true)
  expect(Array.isArray(users!.second_friend_of)).toBe(true)
  expect(Array.isArray(users!.third_wheel_of)).toBe(true)
})

test('join over a 1-M relation with both nullables and non-nullables fields using column name hinting on nested relation', async () => {
  const { data: users, error } =
    await selectQueries.joinOneToManyWithNullablesColumnHintOnNestedRelation.limit(1).single()
  expect(error).toBeNull()
  expect(users).toBeDefined()
  expect(Array.isArray(users!.first_friend_of)).toBe(true)
  expect(Array.isArray(users!.second_friend_of)).toBe(true)
  expect(Array.isArray(users!.third_wheel_of)).toBe(true)
  expect(typeof users?.first_friend_of[0]?.first_user).toBe('object')
})

test('join over a 1-M relation with both nullables and non-nullables fields using no hinting on nested relation', async () => {
  const { error } = await selectQueries.joinOneToManyWithNullablesNoHintOnNestedRelation
    .limit(1)
    .single()
  expect(error).toMatchInlineSnapshot(`
    Object {
      "code": "PGRST201",
      "details": Array [
        Object {
          "cardinality": "many-to-one",
          "embedding": "best_friends with users",
          "relationship": "best_friends_first_user_fkey using best_friends(first_user) and users(username)",
        },
        Object {
          "cardinality": "many-to-one",
          "embedding": "best_friends with users",
          "relationship": "best_friends_second_user_fkey using best_friends(second_user) and users(username)",
        },
        Object {
          "cardinality": "many-to-one",
          "embedding": "best_friends with users",
          "relationship": "best_friends_third_wheel_fkey using best_friends(third_wheel) and users(username)",
        },
      ],
      "hint": "Try changing 'users' to one of the following: 'users!best_friends_first_user_fkey', 'users!best_friends_second_user_fkey', 'users!best_friends_third_wheel_fkey'. Find the desired relationship in the 'details' key.",
      "message": "Could not embed because more than one relationship was found for 'best_friends' and 'users'",
    }
  `)
})

test('!left join on one to 0-1 non-empty relation', async () => {
  const res = await selectQueries.leftOneToOneUsers.eq('username', 'supabot').limit(1).single()
  expect(Array.isArray(res.data?.user_profiles)).toBe(true)
  expect(res.data?.user_profiles[0].username).not.toBeNull()
  expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Object {
            "user_profiles": Array [
              Object {
                "username": "supabot",
              },
            ],
          },
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
})

test('join on one to 0-1 non-empty relation via column name', async () => {
  const res = await selectQueries.oneToOneUsersColumnName
    .eq('username', 'supabot')
    .limit(1)
    .single()
  expect(res.error).toBeNull()
  expect(Array.isArray(res.data?.user_profiles)).toBe(true)
  expect(res.data?.user_profiles[0].username).not.toBeNull()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "user_profiles": Array [
            Object {
              "username": "supabot",
            },
          ],
        },
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('!left join on zero to one with null relation', async () => {
  const res = await selectQueries.leftZeroToOneUserProfiles.eq('id', 2).limit(1).single()
  expect(Array.isArray(res.data?.users)).toBe(false)
  expect(res.data?.users).toBeNull()

  expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Object {
            "id": 2,
            "username": null,
            "users": null,
          },
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
})

test('!left join on zero to one with valid relation', async () => {
  const res = await selectQueries.leftZeroToOneUserProfilesWithNullables
    .eq('id', 1)
    .limit(1)
    .single()
  expect(Array.isArray(res.data?.users)).toBe(false)
  // TODO: This should be nullable indeed
  expect(res.data?.users?.status).not.toBeNull()

  expect(res).toMatchInlineSnapshot(`
        Object {
          "count": null,
          "data": Object {
            "id": 1,
            "username": "supabot",
            "users": Object {
              "status": "ONLINE",
            },
          },
          "error": null,
          "status": 200,
          "statusText": "OK",
        }
      `)
})

test('!left join on zero to one empty relation', async () => {
  const res = await selectQueries.leftOneToOneUsers.eq('username', 'dragarcia').limit(1).single()
  expect(res.data).toBeNull()
})

test('join on 1-M relation with selective fk hinting', async () => {
  const res = await selectQueries.joinOneToManyUsersWithFkHintSelective.limit(1).single()
  expect(Array.isArray(res.data?.first_friend_of)).toBe(true)
  expect(Array.isArray(res.data?.second_friend_of)).toBe(true)
  expect(Array.isArray(res.data?.third_wheel_of)).toBe(true)
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "first_friend_of": Array [
            Object {
              "id": 1,
            },
            Object {
              "id": 2,
            },
          ],
          "second_friend_of": Array [],
          "third_wheel_of": Array [],
        },
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('join select via column', async () => {
  const res = await selectQueries.joinSelectViaColumn.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "username": Object {
            "age_range": "[1,2)",
            "catchphrase": "'cat' 'fat'",
            "data": null,
            "status": "ONLINE",
            "username": "supabot",
          },
        },
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('join select via column selective', async () => {
  const res = await selectQueries.joinSelectViaColumnSelective.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "username": Object {
            "status": "ONLINE",
          },
        },
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('join select via column and alias', async () => {
  const res = await selectQueries.joinSelectViaColumnAndAlias.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "user": Object {
            "age_range": "[1,2)",
            "catchphrase": "'cat' 'fat'",
            "data": null,
            "status": "ONLINE",
            "username": "supabot",
          },
        },
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('join select via unique table relationship', async () => {
  const res = await selectQueries.joinSelectViaUniqueTableRelationship.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
      Object {
        "count": null,
        "data": Object {
          "users": Object {
            "age_range": "[1,2)",
            "catchphrase": "'cat' 'fat'",
            "data": null,
            "status": "ONLINE",
            "username": "supabot",
          },
        },
        "error": null,
        "status": 200,
        "statusText": "OK",
      }
    `)
})

test('join select via column with string templating', async () => {
  const res = await selectQueries.selectionWithStringTemplating.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "status": "ONLINE",
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('select with aggregate count function', async () => {
  const res = await selectQueries.selectWithAggregateCountFunction.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "count": 2,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('select with aggregate count function and alias', async () => {
  const res = await selectQueries.selectWithAggregateCountFunctionAndAlias.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "message_count": 2,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('select with aggregate nested count function', async () => {
  const res = await selectQueries.selectWithAggregateNestedCountFunction.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "channels": Object {
              "count": 1,
            },
          },
          Object {
            "channels": Object {
              "count": 1,
            },
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('select with aggregate nested count function and alias', async () => {
  const res = await selectQueries.selectWithAggregateNestedCountFunctionAndAlias.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "channels": Object {
              "channel_count": 1,
            },
          },
          Object {
            "channels": Object {
              "channel_count": 1,
            },
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('select with aggregate sum function', async () => {
  const res = await selectQueries.selectWithAggregateSumFunction.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "sum": 3,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('select with aggregate aliased sum function', async () => {
  const res = await selectQueries.selectWithAggregateAliasedSumFunction.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "sum_id": 3,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('select with aggregate sum function on nested relation', async () => {
  const res = await selectQueries.selectWithAggregateSumFunctionOnNestedRelation.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "channels": Object {
              "sum": 1,
            },
          },
          Object {
            "channels": Object {
              "sum": 2,
            },
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})
