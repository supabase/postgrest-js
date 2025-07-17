import { PostgrestClient } from '../src/index'
import { Database, CustomUserDataType } from './types.override'
import { Database as DatabaseWithOptions13 } from './types.override-with-options-postgrest13'
import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { Json } from '../src/select-query-parser/types'
import { SelectQueryError } from '../src/select-query-parser/utils'
import { Prettify } from '../src/types'

const REST_URL = 'http://localhost:3000'
export const postgrest = new PostgrestClient<Database>(REST_URL)
const REST_URL_13 = 'http://localhost:3001'
const postgrest13 = new PostgrestClient<Database, { PostgrestVersion: '13' }>(REST_URL_13)
const postgrest13FromDatabaseTypes = new PostgrestClient<DatabaseWithOptions13>(REST_URL_13)

const userColumn: 'catchphrase' | 'username' = 'username'

export const selectParams = {
  oneToManySelective: { from: 'users', select: 'messages(data)' },
  oneToOne: { from: 'channels', select: 'channel_details(*)' },
  leftOneToOne: { from: 'channel_details', select: 'channels!left(*)' },
  leftOneToMany: { from: 'users', select: 'messages!left(*)' },
  leftZeroToOne: { from: 'user_profiles', select: 'users!left(*)' },
  leftOneToOneUsers: { from: 'users', select: 'user_profiles!left(username)' },
  oneToOneUsersColumnName: { from: 'users', select: 'user_profiles(username)' },
  leftZeroToOneUserProfiles: { from: 'user_profiles', select: '*,users!left(*)' },
  leftZeroToOneUserProfilesWithNullables: { from: 'user_profiles', select: '*,users!left(status)' },
  joinOneToOne: { from: 'channel_details', select: 'channels!left(id)' },
  joinOneToMany: { from: 'users', select: 'messages!left(username)' },
  joinZeroToOne: { from: 'user_profiles', select: 'users!left(status)' },
  joinOneToOneWithFkHint: {
    from: 'best_friends',
    select:
      'first_user:users!best_friends_first_user_fkey(*), second_user:users!best_friends_second_user_fkey(*), third_wheel:users!best_friends_third_wheel_fkey(*)',
  },
  joinOneToManyWithFkHint: {
    from: 'users',
    select: `first_friend_of:best_friends!best_friends_first_user_fkey(*),
        second_friend_of:best_friends!best_friends_second_user_fkey(*),
        third_wheel_of:best_friends!best_friends_third_wheel_fkey(*)`,
  },
  joinOneToManyUsersWithFkHint: {
    from: 'users',
    select: `first_friend_of:best_friends_first_user_fkey(*),
        second_friend_of:best_friends_second_user_fkey(*),
        third_wheel_of:best_friends_third_wheel_fkey(*)`,
  },
  joinOneToManyUsersWithFkHintSelective: {
    from: 'users',
    select: `first_friend_of:best_friends_first_user_fkey(id),
        second_friend_of:best_friends_second_user_fkey(*),
        third_wheel_of:best_friends_third_wheel_fkey(*)`,
  },
  joinOneToOneWithNullablesFkHint: {
    from: 'best_friends',
    select:
      'first_user:users!best_friends_first_user_fkey(*), second_user:users!best_friends_second_user_fkey(*), third_wheel:users!best_friends_third_wheel_fkey(*)',
  },
  joinOneToOneWithNullablesNoHint: {
    from: 'best_friends',
    select: 'first_user:users(*), second_user:users(*), third_wheel:users(*)',
  },
  joinOneToOneWithNullablesColumnHint: {
    from: 'best_friends',
    select:
      'first_user:users!first_user(*), second_user:users!second_user(*), third_wheel:users!third_wheel(*)',
  },
  joinOneToManyWithNullablesNoHint: {
    from: 'users',
    select:
      'first_friend_of:best_friends(*), second_friend_of:best_friends(*), third_wheel_of:best_friends(*)',
  },
  joinOneToManyWithNullablesColumnHint: {
    from: 'users',
    select:
      'first_friend_of:best_friends!first_user(*), second_friend_of:best_friends!second_user(*), third_wheel_of:best_friends!third_wheel(*)',
  },
  joinOneToManyWithNullablesColumnHintOnNestedRelation: {
    from: 'users',
    select:
      'first_friend_of:best_friends!first_user(*, first_user:users!first_user(*)), second_friend_of:best_friends!second_user(*), third_wheel_of:best_friends!third_wheel(*)',
  },
  joinOneToManyWithNullablesNoHintOnNestedRelation: {
    from: 'users',
    select:
      'first_friend_of:best_friends!first_user(*, first_user:users(*)), second_friend_of:best_friends!second_user(*), third_wheel_of:best_friends!third_wheel(*)',
  },
  joinSelectViaColumn: { from: 'user_profiles', select: 'username(*)' },
  joinSelectViaColumnSelective: { from: 'user_profiles', select: 'username(status)' },
  joinSelectViaColumnAndAlias: { from: 'user_profiles', select: 'user:username(*)' },
  joinSelectViaUniqueTableRelationship: { from: 'user_profiles', select: 'users(*)' },
  joinSelectViaColumnHint: { from: 'best_friends', select: 'users!first_user(*)' },
  joinSelectViaColumnHintTwice: {
    from: 'best_friends',
    select: 'users!first_user(*), users!second_user(*)',
  },
  typeCastingQuery: { from: 'best_friends', select: 'id::text' },
  joinSelectViaViewNameRelationship: { from: 'user_profiles', select: 'updatable_view(*)' },

  selectionWithStringTemplating: { from: 'users', select: `status, ${userColumn}` },
  selectWithAggregateCountFunction: { from: 'users', select: 'username, messages(count)' },
  selectWithAggregateCountOnAColumnFunction: {
    from: 'users',
    select: 'username, messages(id.count())',
  },
  selectWithAggregateSumFunctionWithoutColumn: { from: 'users', select: 'username, messages(sum)' },
  selectWithAggregateCountFunctionAndAlias: {
    from: 'users',
    select: 'username, messages(message_count:count())',
  },
  selectWithAggregateNestedCountFunction: {
    from: 'users',
    select: 'username, messages(channels(count))',
  },
  selectWithAggregateNestedCountFunctionAndAlias: {
    from: 'users',
    select: 'username, messages(channels(channel_count:count()))',
  },
  selectWithAggregateCountAndSpread: {
    from: 'users',
    select: 'username, messages(channels(count(), ...channel_details(details)))',
  },
  selectWithAggregateSumFunction: { from: 'users', select: 'username, messages(id.sum())' },
  selectWithAggregateAliasedSumFunction: {
    from: 'users',
    select: 'username, messages(sum_id:id.sum())',
  },
  selectWithAggregateSumFunctionOnNestedRelation: {
    from: 'users',
    select: 'username, messages(channels(id.sum()))',
  },
  selectWithAggregateSumAndSpread: {
    from: 'users',
    select: 'username, messages(channels(id.sum(), ...channel_details(details)))',
  },
  selectWithAggregateSumAndSpreadOnNestedRelation: {
    from: 'users',
    select:
      'username, messages(channels(id.sum(), ...channel_details(details_sum:id.sum(), details)))',
  },
  selectWithSpreadOnNestedRelation: {
    from: 'messages',
    select: 'id, channels(id, ...channel_details(details_id:id, details))',
  },
  selectSpreadOnManyRelation: {
    from: 'channels',
    select: 'channel_id:id, ...messages(id, message)',
  },
  selectWithDuplicatesFields: {
    from: 'channels',
    select: 'id, id, id',
  },
  selectEmbedRessourceWithNoFields: {
    from: 'messages',
    select: 'message, users()',
  },
  selectJsonAccessor: {
    from: 'users',
    select: 'data->foo->bar, data->foo->>baz',
  },
  typecastingAndAggregate: {
    from: 'messages',
    select:
      'message, users.count(), casted_message:message::int4, casted_count:users.count()::text',
  },
  innerJoinOnManyRelation: {
    from: 'channels',
    select: 'id, messages!channel_id!inner(id, username)',
  },
  selfReferenceRelation: {
    from: 'collections',
    select: '*, collections(*)',
  },
  selfReferenceRelationViaColumn: {
    from: 'collections',
    select: '*, parent_id(*)',
  },
  aggregateOnMissingColumnWithAlias: {
    from: 'users',
    select: 'alias:missing_column.count()',
  },
  manyToManyWithJoinTable: {
    from: 'products',
    select: '*, categories(*)',
  },
  nestedQueryWithSelectiveFieldsAndInnerJoin: {
    from: 'users',
    select:
      'msgs:messages(id, ...message_details(created_at, channel!inner(id, slug, owner:users(*))))',
  },
} as const

export const selectQueries = {
  oneToManySelective: postgrest
    .from(selectParams.oneToManySelective.from)
    .select(selectParams.oneToManySelective.select),
  oneToOne: postgrest.from(selectParams.oneToOne.from).select(selectParams.oneToOne.select),
  leftOneToOne: postgrest
    .from(selectParams.leftOneToOne.from)
    .select(selectParams.leftOneToOne.select),
  leftOneToMany: postgrest
    .from(selectParams.leftOneToMany.from)
    .select(selectParams.leftOneToMany.select),
  leftZeroToOne: postgrest
    .from(selectParams.leftZeroToOne.from)
    .select(selectParams.leftZeroToOne.select),
  leftOneToOneUsers: postgrest
    .from(selectParams.leftOneToOneUsers.from)
    .select(selectParams.leftOneToOneUsers.select),
  oneToOneUsersColumnName: postgrest
    .from(selectParams.oneToOneUsersColumnName.from)
    .select(selectParams.oneToOneUsersColumnName.select),
  leftZeroToOneUserProfiles: postgrest
    .from(selectParams.leftZeroToOneUserProfiles.from)
    .select(selectParams.leftZeroToOneUserProfiles.select),
  leftZeroToOneUserProfilesWithNullables: postgrest
    .from(selectParams.leftZeroToOneUserProfilesWithNullables.from)
    .select(selectParams.leftZeroToOneUserProfilesWithNullables.select),
  joinOneToOne: postgrest
    .from(selectParams.joinOneToOne.from)
    .select(selectParams.joinOneToOne.select),
  joinOneToMany: postgrest
    .from(selectParams.joinOneToMany.from)
    .select(selectParams.joinOneToMany.select),
  joinZeroToOne: postgrest
    .from(selectParams.joinZeroToOne.from)
    .select(selectParams.joinZeroToOne.select),
  joinOneToOneWithFkHint: postgrest
    .from(selectParams.joinOneToOneWithFkHint.from)
    .select(selectParams.joinOneToOneWithFkHint.select),
  joinOneToManyWithFkHint: postgrest
    .from(selectParams.joinOneToManyWithFkHint.from)
    .select(selectParams.joinOneToManyWithFkHint.select),
  joinOneToManyUsersWithFkHint: postgrest
    .from(selectParams.joinOneToManyUsersWithFkHint.from)
    .select(selectParams.joinOneToManyUsersWithFkHint.select),
  joinOneToManyUsersWithFkHintSelective: postgrest
    .from(selectParams.joinOneToManyUsersWithFkHintSelective.from)
    .select(selectParams.joinOneToManyUsersWithFkHintSelective.select),
  joinOneToOneWithNullablesFkHint: postgrest
    .from(selectParams.joinOneToOneWithNullablesFkHint.from)
    .select(selectParams.joinOneToOneWithNullablesFkHint.select),
  joinOneToOneWithNullablesNoHint: postgrest
    .from(selectParams.joinOneToOneWithNullablesNoHint.from)
    .select(selectParams.joinOneToOneWithNullablesNoHint.select),
  joinOneToOneWithNullablesColumnHint: postgrest
    .from(selectParams.joinOneToOneWithNullablesColumnHint.from)
    .select(selectParams.joinOneToOneWithNullablesColumnHint.select),
  joinOneToManyWithNullablesNoHint: postgrest
    .from(selectParams.joinOneToManyWithNullablesNoHint.from)
    .select(selectParams.joinOneToManyWithNullablesNoHint.select),
  joinOneToManyWithNullablesColumnHint: postgrest
    .from(selectParams.joinOneToManyWithNullablesColumnHint.from)
    .select(selectParams.joinOneToManyWithNullablesColumnHint.select),
  joinOneToManyWithNullablesColumnHintOnNestedRelation: postgrest
    .from(selectParams.joinOneToManyWithNullablesColumnHintOnNestedRelation.from)
    .select(selectParams.joinOneToManyWithNullablesColumnHintOnNestedRelation.select),
  joinOneToManyWithNullablesNoHintOnNestedRelation: postgrest
    .from(selectParams.joinOneToManyWithNullablesNoHintOnNestedRelation.from)
    .select(selectParams.joinOneToManyWithNullablesNoHintOnNestedRelation.select),
  joinSelectViaColumn: postgrest
    .from(selectParams.joinSelectViaColumn.from)
    .select(selectParams.joinSelectViaColumn.select),
  joinSelectViaColumnSelective: postgrest
    .from(selectParams.joinSelectViaColumnSelective.from)
    .select(selectParams.joinSelectViaColumnSelective.select),
  joinSelectViaColumnAndAlias: postgrest
    .from(selectParams.joinSelectViaColumnAndAlias.from)
    .select(selectParams.joinSelectViaColumnAndAlias.select),
  joinSelectViaUniqueTableRelationship: postgrest
    .from(selectParams.joinSelectViaUniqueTableRelationship.from)
    .select(selectParams.joinSelectViaUniqueTableRelationship.select),
  joinSelectViaColumnHint: postgrest
    .from(selectParams.joinSelectViaColumnHint.from)
    .select(selectParams.joinSelectViaColumnHint.select),
  joinSelectViaColumnHintTwice: postgrest
    .from(selectParams.joinSelectViaColumnHintTwice.from)
    .select(selectParams.joinSelectViaColumnHintTwice.select),
  typeCastingQuery: postgrest
    .from(selectParams.typeCastingQuery.from)
    .select(selectParams.typeCastingQuery.select),
  joinSelectViaViewNameRelationship: postgrest
    .from(selectParams.joinSelectViaViewNameRelationship.from)
    .select(selectParams.joinSelectViaViewNameRelationship.select),
  selectionWithStringTemplating: postgrest
    .from(selectParams.selectionWithStringTemplating.from)
    .select(selectParams.selectionWithStringTemplating.select),
  selectWithAggregateCountFunction: postgrest
    .from(selectParams.selectWithAggregateCountFunction.from)
    .select(selectParams.selectWithAggregateCountFunction.select),
  selectWithAggregateCountOnAColumnFunction: postgrest
    .from(selectParams.selectWithAggregateCountOnAColumnFunction.from)
    .select(selectParams.selectWithAggregateCountOnAColumnFunction.select),
  selectWithAggregateSumFunctionWithoutColumn: postgrest
    .from(selectParams.selectWithAggregateSumFunctionWithoutColumn.from)
    .select(selectParams.selectWithAggregateSumFunctionWithoutColumn.select),
  selectWithAggregateCountFunctionAndAlias: postgrest
    .from(selectParams.selectWithAggregateCountFunctionAndAlias.from)
    .select(selectParams.selectWithAggregateCountFunctionAndAlias.select),
  selectWithAggregateNestedCountFunction: postgrest
    .from(selectParams.selectWithAggregateNestedCountFunction.from)
    .select(selectParams.selectWithAggregateNestedCountFunction.select),
  selectWithAggregateNestedCountFunctionAndAlias: postgrest
    .from(selectParams.selectWithAggregateNestedCountFunctionAndAlias.from)
    .select(selectParams.selectWithAggregateNestedCountFunctionAndAlias.select),
  selectWithAggregateCountAndSpread: postgrest
    .from(selectParams.selectWithAggregateCountAndSpread.from)
    .select(selectParams.selectWithAggregateCountAndSpread.select),
  selectWithAggregateSumFunction: postgrest
    .from(selectParams.selectWithAggregateSumFunction.from)
    .select(selectParams.selectWithAggregateSumFunction.select),
  selectWithAggregateAliasedSumFunction: postgrest
    .from(selectParams.selectWithAggregateAliasedSumFunction.from)
    .select(selectParams.selectWithAggregateAliasedSumFunction.select),
  selectWithAggregateSumFunctionOnNestedRelation: postgrest
    .from(selectParams.selectWithAggregateSumFunctionOnNestedRelation.from)
    .select(selectParams.selectWithAggregateSumFunctionOnNestedRelation.select),
  selectWithAggregateSumAndSpread: postgrest
    .from(selectParams.selectWithAggregateSumAndSpread.from)
    .select(selectParams.selectWithAggregateSumAndSpread.select),
  selectWithAggregateSumAndSpreadOnNestedRelation: postgrest
    .from(selectParams.selectWithAggregateSumAndSpreadOnNestedRelation.from)
    .select(selectParams.selectWithAggregateSumAndSpreadOnNestedRelation.select),
  selectWithSpreadOnNestedRelation: postgrest
    .from(selectParams.selectWithSpreadOnNestedRelation.from)
    .select(selectParams.selectWithSpreadOnNestedRelation.select),
  selectSpreadOnManyRelation: postgrest
    .from(selectParams.selectSpreadOnManyRelation.from)
    .select(selectParams.selectSpreadOnManyRelation.select),
  selectSpreadOnManyRelation13: postgrest13
    .from(selectParams.selectSpreadOnManyRelation.from)
    .select(selectParams.selectSpreadOnManyRelation.select),
  selectSpreadOnManyRelation13FromDatabaseType: postgrest13FromDatabaseTypes
    .from(selectParams.selectSpreadOnManyRelation.from)
    .select(selectParams.selectSpreadOnManyRelation.select),
  selectWithDuplicatesFields: postgrest
    .from(selectParams.selectWithDuplicatesFields.from)
    .select(selectParams.selectWithDuplicatesFields.select),
  selectEmbedRessourceWithNoFields: postgrest
    .from(selectParams.selectEmbedRessourceWithNoFields.from)
    .select(selectParams.selectEmbedRessourceWithNoFields.select),
  selectJsonAccessor: postgrest
    .from(selectParams.selectJsonAccessor.from)
    .select(selectParams.selectJsonAccessor.select),
  typecastingAndAggregate: postgrest
    .from(selectParams.typecastingAndAggregate.from)
    .select(selectParams.typecastingAndAggregate.select),
  innerJoinOnManyRelation: postgrest
    .from(selectParams.innerJoinOnManyRelation.from)
    .select(selectParams.innerJoinOnManyRelation.select),
  selfReferenceRelation: postgrest
    .from(selectParams.selfReferenceRelation.from)
    .select(selectParams.selfReferenceRelation.select),
  selfReferenceRelationViaColumn: postgrest
    .from(selectParams.selfReferenceRelationViaColumn.from)
    .select(selectParams.selfReferenceRelationViaColumn.select),
  aggregateOnMissingColumnWithAlias: postgrest
    .from(selectParams.aggregateOnMissingColumnWithAlias.from)
    .select(selectParams.aggregateOnMissingColumnWithAlias.select),
  manyToManyWithJoinTable: postgrest
    .from(selectParams.manyToManyWithJoinTable.from)
    .select(selectParams.manyToManyWithJoinTable.select),
  nestedQueryWithSelectiveFieldsAndInnerJoin: postgrest
    .from(selectParams.nestedQueryWithSelectiveFieldsAndInnerJoin.from)
    .select(selectParams.nestedQueryWithSelectiveFieldsAndInnerJoin.select),
} as const

test('nested query with selective fields', async () => {
  const res = await postgrest
    .from('users')
    .select('username, messages(id, message)')
    .limit(1)
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
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
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: {
      id: number
      message: string | null
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('nested query with multiple levels and selective fields', async () => {
  const res = await postgrest
    .from('users')
    .select('username, messages(id, message, channels(id, slug))')
    .limit(1)
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
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
          Object {
            "channels": Object {
              "id": 3,
              "slug": "other",
            },
            "id": 4,
            "message": "Some message on channel wihtout details",
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    messages: Array<{
      id: number
      message: string | null
      channels: {
        id: number
        slug: string | null
      }
    }>
    username: string
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('query with multiple one-to-many relationships', async () => {
  const res = await postgrest
    .from('users')
    .select('username, messages(id), user_profiles(id)')
    .limit(1)
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "id": 1,
          },
          Object {
            "id": 2,
          },
          Object {
            "id": 4,
          },
        ],
        "user_profiles": Array [
          Object {
            "id": 1,
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

test('many-to-one relationship', async () => {
  const res = await postgrest.from('messages').select('user:users(*)').limit(1).single()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    user: Database['public']['Tables']['users']['Row']
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('!inner relationship', async () => {
  const res = await postgrest
    .from('messages')
    .select('channels!inner(*, channel_details!inner(*))')
    .limit(1)
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "channels": Object {
          "channel_details": Object {
            "details": "Details for public channel",
            "id": 1,
          },
          "data": null,
          "id": 1,
          "slug": "public",
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  type ExpectedType = Prettify<
    Database['public']['Tables']['channels']['Row'] & {
      channel_details: Database['public']['Tables']['channel_details']['Row']
    }
  >
  let expected: {
    channels: ExpectedType
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('!inner relationship on nullable relation', async () => {
  const res = await postgrest.from('booking').select('id, hotel!inner(id, name)')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "hotel": Object {
            "id": 1,
            "name": "Sunset Resort",
          },
          "id": 1,
        },
        Object {
          "hotel": Object {
            "id": 1,
            "name": "Sunset Resort",
          },
          "id": 2,
        },
        Object {
          "hotel": Object {
            "id": 2,
            "name": "Mountain View Hotel",
          },
          "id": 3,
        },
        Object {
          "hotel": Object {
            "id": 3,
            "name": "Beachfront Inn",
          },
          "id": 5,
        },
        Object {
          "hotel": Object {
            "id": 1,
            "name": "Sunset Resort",
          },
          "id": 6,
        },
        Object {
          "hotel": Object {
            "id": 4,
            "name": null,
          },
          "id": 8,
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: Array<{
    id: number
    hotel: {
      id: number
      name: string | null
    }
  }>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('one-to-many relationship', async () => {
  const res = await postgrest.from('users').select('messages(*)').limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
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
          Object {
            "channel_id": 3,
            "data": null,
            "id": 4,
            "message": "Some message on channel wihtout details",
            "username": "supabot",
          },
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    messages: Database['public']['Tables']['messages']['Row'][]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('one-to-many relationship with selective columns', async () => {
  const res = await selectQueries.oneToManySelective.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "data": null,
          },
          Object {
            "data": null,
          },
          Object {
            "data": null,
          },
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    messages: Array<Pick<Database['public']['Tables']['messages']['Row'], 'data'>>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('one-to-one relationship', async () => {
  const res = await selectQueries.oneToOne.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "channel_details": Object {
          "details": "Details for public channel",
          "id": 1,
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    channel_details: Database['public']['Tables']['channel_details']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('!left oneToOne', async () => {
  const res = await selectQueries.leftOneToOne.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "channels": Object {
          "data": null,
          "id": 1,
          "slug": "public",
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    channels: Database['public']['Tables']['channels']['Row']
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('!left oneToMany', async () => {
  const res = await selectQueries.leftOneToMany.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
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
          Object {
            "channel_id": 3,
            "data": null,
            "id": 4,
            "message": "Some message on channel wihtout details",
            "username": "supabot",
          },
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    messages: Array<Database['public']['Tables']['messages']['Row']>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('!left zeroToOne', async () => {
  const res = await selectQueries.leftZeroToOne.limit(1).single()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    users: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join over a 1-1 relation with both nullables and non-nullables fields using foreign key name for hinting', async () => {
  const res = await selectQueries.joinOneToOneWithFkHint.limit(1).single()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_user: Database['public']['Tables']['users']['Row']
    second_user: Database['public']['Tables']['users']['Row']
    third_wheel: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join over a 1-M relation with both nullables and non-nullables fields using foreign key name for hinting', async () => {
  const res = await selectQueries.joinOneToManyWithFkHint.limit(1).single()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    second_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    third_wheel_of: Array<Database['public']['Tables']['best_friends']['Row']>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join on 1-M relation', async () => {
  const res = await selectQueries.joinOneToManyUsersWithFkHint
    .eq('username', 'supabot')
    .limit(1)
    .single()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    second_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    third_wheel_of: Array<Database['public']['Tables']['best_friends']['Row']>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join on 1-1 relation with nullables', async () => {
  const res = await selectQueries.joinOneToOneWithNullablesFkHint.order('id').limit(1).single()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_user: Database['public']['Tables']['users']['Row']
    second_user: Database['public']['Tables']['users']['Row']
    third_wheel: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join over a 1-1 relation with both nullables and non-nullables fields with no hinting', async () => {
  const res = await selectQueries.joinOneToOneWithNullablesNoHint.single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
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
      },
      "status": 300,
      "statusText": "Multiple Choices",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_user: SelectQueryError<"Could not embed because more than one relationship was found for 'users' and 'best_friends' you need to hint the column with users!<columnName> ?">
    second_user: SelectQueryError<"Could not embed because more than one relationship was found for 'users' and 'best_friends' you need to hint the column with users!<columnName> ?">
    third_wheel: SelectQueryError<"Could not embed because more than one relationship was found for 'users' and 'best_friends' you need to hint the column with users!<columnName> ?">
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join over a 1-1 relation with both nullablesand non-nullables fields with column name hinting', async () => {
  const res = await selectQueries.joinOneToOneWithNullablesColumnHint.limit(1).single()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_user: Database['public']['Tables']['users']['Row']
    second_user: Database['public']['Tables']['users']['Row']
    third_wheel: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join over a 1-M relation with both nullables and non-nullables fields with no hinting', async () => {
  const res = await selectQueries.joinOneToManyWithNullablesNoHint.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
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
      },
      "status": 300,
      "statusText": "Multiple Choices",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_friend_of: SelectQueryError<"Could not embed because more than one relationship was found for 'best_friends' and 'users' you need to hint the column with best_friends!<columnName> ?">
    second_friend_of: SelectQueryError<"Could not embed because more than one relationship was found for 'best_friends' and 'users' you need to hint the column with best_friends!<columnName> ?">
    third_wheel_of: SelectQueryError<"Could not embed because more than one relationship was found for 'best_friends' and 'users' you need to hint the column with best_friends!<columnName> ?">
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join over a 1-M relation with both nullables and non-nullables fields using column name for hinting', async () => {
  const res = await selectQueries.joinOneToManyWithNullablesColumnHint.limit(1).single()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    second_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    third_wheel_of: Array<Database['public']['Tables']['best_friends']['Row']>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join over a 1-M relation with both nullables and non-nullables fields using column name hinting on nested relation', async () => {
  const res = await selectQueries.joinOneToManyWithNullablesColumnHintOnNestedRelation
    .limit(1)
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "first_friend_of": Array [
          Object {
            "first_user": Object {
              "age_range": "[1,2)",
              "catchphrase": "'cat' 'fat'",
              "data": null,
              "status": "ONLINE",
              "username": "supabot",
            },
            "id": 1,
            "second_user": "kiwicopple",
            "third_wheel": "awailas",
          },
          Object {
            "first_user": Object {
              "age_range": "[1,2)",
              "catchphrase": "'cat' 'fat'",
              "data": null,
              "status": "ONLINE",
              "username": "supabot",
            },
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
  let result: Exclude<typeof res.data, null>
  type ExpectedType = Prettify<
    Database['public']['Tables']['best_friends']['Row'] & {
      first_user: string & Database['public']['Tables']['users']['Row']
    }
  >
  let expected: {
    first_friend_of: ExpectedType[]
    second_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    third_wheel_of: Array<Database['public']['Tables']['best_friends']['Row']>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join over a 1-M relation with both nullables and non-nullables fields using no hinting on nested relation', async () => {
  const res = await selectQueries.joinOneToManyWithNullablesNoHintOnNestedRelation.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
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
      },
      "status": 300,
      "statusText": "Multiple Choices",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_friend_of: Array<{
      id: number
      second_user: string
      third_wheel: string | null
      first_user: SelectQueryError<"Could not embed because more than one relationship was found for 'users' and 'best_friends' you need to hint the column with users!<columnName> ?">
    }>
    second_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    third_wheel_of: Array<Database['public']['Tables']['best_friends']['Row']>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    user_profiles: Array<Pick<Database['public']['Tables']['user_profiles']['Row'], 'username'>>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    user_profiles: Array<Pick<Database['public']['Tables']['user_profiles']['Row'], 'username'>>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
    username: string | null
    users: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
    username: string | null
    users: Pick<Database['public']['Tables']['users']['Row'], 'status'> | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('!left join on zero to one empty relation', async () => {
  const res = await selectQueries.leftOneToOneUsers.eq('username', 'dragarcia').limit(1).single()
  expect(res.data).toBeNull()
  let result: Exclude<typeof res.data, null>
  let expected: {
    user_profiles: Array<Pick<Database['public']['Tables']['user_profiles']['Row'], 'username'>>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    first_friend_of: Array<Pick<Database['public']['Tables']['best_friends']['Row'], 'id'>>
    second_friend_of: Array<Database['public']['Tables']['best_friends']['Row']>
    third_wheel_of: Array<Database['public']['Tables']['best_friends']['Row']>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: {
      status: Database['public']['Enums']['user_status'] | null
    } | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    user: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    users: Database['public']['Tables']['users']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})
test('join select via view name relationship', async () => {
  const res = await selectQueries.joinSelectViaViewNameRelationship.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "updatable_view": Object {
          "non_updatable_column": 1,
          "username": "supabot",
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    updatable_view: Database['public']['Views']['updatable_view']['Row'] | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    status: Database['public']['Enums']['user_status'] | null
    username: string
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with aggregate count function', async () => {
  const res = await selectQueries.selectWithAggregateCountFunction.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "count": 3,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      count: number
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with aggregate count on a column function', async () => {
  const res = await selectQueries.selectWithAggregateCountOnAColumnFunction.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "count": 3,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      count: number
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with aggregate sum function without column should error', async () => {
  const res = await selectQueries.selectWithAggregateSumFunctionWithoutColumn.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
        "code": "42703",
        "details": null,
        "hint": null,
        "message": "column messages_1.sum does not exist",
      },
      "status": 400,
      "statusText": "Bad Request",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: SelectQueryError<"column 'sum' does not exist on 'messages'.">[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with aggregate count function and alias', async () => {
  const res = await selectQueries.selectWithAggregateCountFunctionAndAlias.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "message_count": 3,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      message_count: number
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      channels: {
        count: number
      }
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      channels: {
        channel_count: number
      }
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with aggregate count and spread', async () => {
  const res = await selectQueries.selectWithAggregateCountAndSpread.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "channels": Object {
              "count": 1,
              "details": "Details for public channel",
            },
          },
          Object {
            "channels": Object {
              "count": 1,
              "details": "Details for random channel",
            },
          },
          Object {
            "channels": Object {
              "count": 1,
              "details": null,
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      channels: {
        count: number
        details: string | null
      }
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with aggregate sum function', async () => {
  const res = await selectQueries.selectWithAggregateSumFunction.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "sum": 7,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      sum: number
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with aggregate aliased sum function', async () => {
  const res = await selectQueries.selectWithAggregateAliasedSumFunction.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "sum_id": 7,
          },
        ],
        "username": "supabot",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      sum_id: number
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
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
          Object {
            "channels": Object {
              "sum": 3,
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      channels: {
        sum: number
      }
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with aggregate sum and spread', async () => {
  const res = await selectQueries.selectWithAggregateSumAndSpread.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "channels": Object {
              "details": "Details for public channel",
              "sum": 1,
            },
          },
          Object {
            "channels": Object {
              "details": "Details for random channel",
              "sum": 2,
            },
          },
          Object {
            "channels": Object {
              "details": null,
              "sum": 3,
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      channels: {
        sum: number
        details: string | null
      }
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with aggregate sum and spread on nested relation', async () => {
  const res = await selectQueries.selectWithAggregateSumAndSpreadOnNestedRelation.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "messages": Array [
          Object {
            "channels": Object {
              "details": "Details for public channel",
              "details_sum": 1,
              "sum": 1,
            },
          },
          Object {
            "channels": Object {
              "details": "Details for random channel",
              "details_sum": 2,
              "sum": 2,
            },
          },
          Object {
            "channels": Object {
              "details": null,
              "details_sum": null,
              "sum": 3,
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    username: string
    messages: Array<{
      channels: {
        sum: number
        details_sum: number | null
        details: string | null
      }
    }>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with spread on nested relation', async () => {
  const res = await selectQueries.selectWithSpreadOnNestedRelation.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "channels": Object {
            "details": "Details for public channel",
            "details_id": 1,
            "id": 1,
          },
          "id": 1,
        },
        Object {
          "channels": Object {
            "details": "Details for random channel",
            "details_id": 2,
            "id": 2,
          },
          "id": 2,
        },
        Object {
          "channels": Object {
            "details": null,
            "details_id": null,
            "id": 3,
          },
          "id": 4,
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
    channels: {
      id: number
      details_id: number | null
      details: string | null
    }
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select with type casting query', async () => {
  const res = await selectQueries.typeCastingQuery.limit(1).single()

  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "id": "1",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: string
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join with column hinting', async () => {
  const res = await selectQueries.joinSelectViaColumnHint.limit(1).single()
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
  let result: Exclude<typeof res.data, null>
  let expected: {
    users: {
      age_range: unknown | null
      catchphrase: unknown | null
      data: CustomUserDataType | null
      status: Database['public']['Enums']['user_status'] | null
      username: string
    }
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('join with same dest twice column hinting', async () => {
  const res = await selectQueries.joinSelectViaColumnHintTwice.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
        "code": "42712",
        "details": null,
        "hint": null,
        "message": "table name \\"best_friends_users_1\\" specified more than once",
      },
      "status": 400,
      "statusText": "Bad Request",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    users: SelectQueryError<'table "best_friends" specified more than once use hinting for desambiguation'>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select spread on many relation', async () => {
  const res = await selectQueries.selectSpreadOnManyRelation.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
        "code": "PGRST119",
        "details": "'channels' and 'messages' do not form a many-to-one or one-to-one relationship",
        "hint": null,
        "message": "A spread operation on 'messages' is not possible",
      },
      "status": 400,
      "statusText": "Bad Request",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    channel_id: number
    messages: SelectQueryError<'"channels" and "messages" do not form a many-to-one or one-to-one relationship spread not possible'>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select spread on many relation postgrest13', async () => {
  const res = await selectQueries.selectSpreadOnManyRelation13.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "channel_id": 1,
        "id": Array [
          1,
        ],
        "message": Array [
          "Hello World 👋",
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    channel_id: number
    id: Array<number>
    message: Array<string | null>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select spread on many relation postgrest13FromDatabaseTypes', async () => {
  const res = await selectQueries.selectSpreadOnManyRelation13FromDatabaseType.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "channel_id": 1,
        "id": Array [
          1,
        ],
        "message": Array [
          "Hello World 👋",
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    channel_id: number
    id: Array<number>
    message: Array<string | null>
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('multiple times the same column in selection', async () => {
  const res = await selectQueries.selectWithDuplicatesFields.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "id": 1,
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('embed resource with no fields', async () => {
  const res = await selectQueries.selectEmbedRessourceWithNoFields.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "message": "Hello World 👋",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
`)
  let result: Exclude<typeof res.data, null>
  let expected: {
    message: string | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('select JSON accessor', async () => {
  const res = await selectQueries.selectJsonAccessor
    .limit(1)
    .filter('username', 'eq', 'jsonuser')
    .single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "bar": Object {
          "nested": "value",
        },
        "baz": "string value",
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
`)
  let result: Exclude<typeof res.data, null>
  let expected: {
    bar: Json
    baz: string
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('typecasting and aggregate', async () => {
  const res = await selectQueries.typecastingAndAggregate.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
        "code": "42703",
        "details": null,
        "hint": null,
        "message": "column messages.users does not exist",
      },
      "status": 400,
      "statusText": "Bad Request",
    }
`)
  let result: Exclude<typeof res.data, null>
  let expected: SelectQueryError<`column 'users' does not exist on 'messages'.`>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('inner join on many relation', async () => {
  const res = await selectQueries.innerJoinOnManyRelation.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "id": 1,
        "messages": Array [
          Object {
            "id": 1,
            "username": "supabot",
          },
        ],
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
    messages: {
      id: number
      username: string
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('self reference relation', async () => {
  const res = await selectQueries.selfReferenceRelation.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "collections": Array [
          Object {
            "description": "Child of Root",
            "id": 2,
            "parent_id": 1,
          },
          Object {
            "description": "Another Child of Root",
            "id": 3,
            "parent_id": 1,
          },
        ],
        "description": "Root Collection",
        "id": 1,
        "parent_id": null,
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
    description: string | null
    parent_id: number | null
    collections: {
      id: number
      description: string | null
      parent_id: number | null
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('self reference relation via column', async () => {
  const res = await selectQueries.selfReferenceRelationViaColumn.eq('id', 2).limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "description": "Child of Root",
        "id": 2,
        "parent_id": Object {
          "description": "Root Collection",
          "id": 1,
          "parent_id": null,
        },
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    description: string | null
    id: number
    parent_id:
      | (number & {
          description: string | null
          id: number
          parent_id: number | null
        })
      | null
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('aggregate on missing column with alias', async () => {
  const res = await selectQueries.aggregateOnMissingColumnWithAlias.eq('id', 2).limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
        "code": "42703",
        "details": null,
        "hint": null,
        "message": "column users.missing_column does not exist",
      },
      "status": 400,
      "statusText": "Bad Request",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: SelectQueryError<`column 'missing_column' does not exist on 'users'.`>
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('many-to-many with join table', async () => {
  const res = await selectQueries.manyToManyWithJoinTable.eq('id', 1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Object {
        "categories": Array [
          Object {
            "description": "Electronic devices and gadgets",
            "id": 1,
            "name": "Electronics",
          },
          Object {
            "description": "Computer and computer accessories",
            "id": 2,
            "name": "Computers",
          },
        ],
        "description": "High-performance laptop",
        "id": 1,
        "name": "Laptop",
        "price": 999.99,
      },
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    id: number
    name: string
    description: string | null
    price: number
    categories: {
      id: number
      name: string
      description: string | null
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('nested query with selective fields and inner join should error on non existing relation', async () => {
  const res = await selectQueries.nestedQueryWithSelectiveFieldsAndInnerJoin.limit(1).single()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": Object {
        "code": "PGRST200",
        "details": "Searched for a foreign key relationship between 'messages' and 'message_details' in the schema 'public', but no matches were found.",
        "hint": null,
        "message": "Could not find a relationship between 'messages' and 'message_details' in the schema cache",
      },
      "status": 400,
      "statusText": "Bad Request",
    }
  `)
  let result: Exclude<typeof res.data, null>
  let expected: {
    msgs: {
      id: number
      message_details: SelectQueryError<'could not find the relation between messages and message_details'>
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})
