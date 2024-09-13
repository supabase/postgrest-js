import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { SelectQueryError } from '../src/select-query-parser'
import { Prettify } from '../src/types'
import { Database } from './types'
import { selectQueries } from './relationships'

// nested query with selective fields
{
  const { data, error } = await selectQueries.nestedQueryWithSelectiveFields.limit(1).single()
  if (error) {
    throw new Error(error.message)
  }
  expectType<Pick<Database['public']['Tables']['users']['Row'], 'username'>>(data)
  // we need ts-expect TypeEqual here to ensure never properties wont pass the test
  expectType<TypeEqual<Pick<Database['public']['Tables']['messages']['Row'], 'id' | 'message'>[], typeof data.messages>>(true)
}

// nested query with multiple levels and selective fields
{
  const { data, error } = await selectQueries.nestedQueryWithMultipleLevelsAndSelectiveFields.limit(1).single()
  if (error) {
    throw new Error(error.message)
  }
  // Complex nested types combination and picking make ts-expect fail
  type ExpectedType = {
      messages: Array<{
          id: number;
          message: string | null;
          channels: {
              id: number;
              slug: string | null;
          };
      }>;
      username: string;
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// query with multiple one-to-many relationships
{
  const { data, error } = await selectQueries.queryWithMultipleOneToManySelectives.limit(1).single()
  if (error) {
    throw new Error(error.message)
  }
  expectType<Pick<Database['public']['Tables']['users']['Row'], 'username'>>(data)
  expectType<TypeEqual<Array<Pick<Database['public']['Tables']['messages']['Row'], 'id'>>, typeof data.messages>>(true)
  expectType<TypeEqual<Array<Pick<Database['public']['Tables']['user_profiles']['Row'], 'id'>>, typeof data.user_profiles>>(true)
}

// many-to-one relationship
{
  const { data: message, error } = await selectQueries.manyToOne.single()
  if (error) {
    throw new Error(error.message)
  }
  expectType<Database['public']['Tables']['users']['Row'] | null>(message.user)
}

// !inner relationship
{
  const { data: message, error } = await selectQueries.inner
    .single()
  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = Prettify<
    Database['public']['Tables']['channels']['Row'] & {
      channel_details: Database['public']['Tables']['channel_details']['Row']
    }
  >

  expectType<TypeEqual<ExpectedType, typeof message.channels>>(true)
}

// one-to-many relationship
{
  const { data: user, error } = await selectQueries.oneToMany.single()
  if (error) {
    throw new Error(error.message)
  }
  expectType<Database['public']['Tables']['messages']['Row'][]>(user.messages)
}

// one-to-many relationship with selective columns
{
  const { data: user, error } = await selectQueries.oneToManySelective.single()
  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    messages: Array<Pick<Database['public']['Tables']['messages']['Row'], 'data'>>
  }
  expectType<TypeEqual<ExpectedType, typeof user>>(true)
}


// one-to-one relationship
{
  const { data: channels, error } = await selectQueries.oneToOne
    .single()
  if (error) {
    throw new Error(error.message)
  }
  expectType<Database['public']['Tables']['channel_details']['Row'] | null>(
    channels.channel_details
  )
}

// !left oneToOne
{
  const { data: oneToOne, error } = await selectQueries.leftOneToOne
    .single()

  if (error) {
    throw new Error(error.message)
  }

  expectType<Database['public']['Tables']['channels']['Row']>(oneToOne.channels)
}

// !left oneToMany
{
  const { data: oneToMany, error } = await selectQueries.leftOneToMany
    .single()

  if (error) {
    throw new Error(error.message)
  }

  expectType<TypeEqual<Array<Database['public']['Tables']['messages']['Row']>, typeof oneToMany.messages>>(true)
}

// !left zeroToOne
{
  const { data: zeroToOne, error } = await selectQueries.leftZeroToOne
    .single()

  if (error) {
    throw new Error(error.message)
  }

  expectType<Database['public']['Tables']['users']['Row'] | null>(zeroToOne.users)
}

// join over a 1-M relation with both nullables and non-nullables fields using foreign key name for hinting
{
  const { data: users, error } = await selectQueries.joinOneToManyWithFkHint
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Array<Database['public']['Tables']['best_friends']['Row']>, typeof users.first_friend_of>>(true)
}

// join over a 1-1 relation with both nullables and non-nullables fields with no hinting
{
  const { data, error } = await selectQueries.joinOneToOneWithNullablesNoHint
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<SelectQueryError<"Could not embed because more than one relationship was found for 'users' and 'best_friends' you need to hint the column with users!<columnName> ?">>(data.first_user)
}

// join over a 1-1 relation with both nullablesand non-nullables fields with column name hinting
{
  const { data, error } = await selectQueries.joinOneToOneWithNullablesColumnHint
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<Database['public']['Tables']['users']['Row'] | null>(data.first_user)
  expectType<Database['public']['Tables']['users']['Row'] | null>(data.second_user)
  expectType<Database['public']['Tables']['users']['Row'] | null>(data.third_wheel)
}

// join over a 1-M relation with both nullables and non-nullables fields with no hinting
{
  const { data, error } = await selectQueries.joinOneToManyWithNullablesNoHint
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<SelectQueryError<"Could not embed because more than one relationship was found for 'best_friends' and 'users' you need to hint the column with best_friends!<columnName> ?">>(data.first_friend_of)
}

// join over a 1-M relation with both nullables and non-nullables fields using column name for hinting
{
  const { data, error } = await selectQueries.joinOneToManyWithNullablesColumnHint
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(data.first_friend_of)
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(data.second_friend_of)
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(data.third_wheel_of)
}

// join over a 1-M relation with both nullables and non-nullables fields using column name hinting on nested relation
{
  const { data, error } = await selectQueries.joinOneToManyWithNullablesColumnHintOnNestedRelation
    .single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = Prettify<Database['public']['Tables']['best_friends']['Row'] & {
    first_user: string & Database['public']['Tables']['users']['Row']
  }>
  expectType<TypeEqual<ExpectedType[], typeof data.first_friend_of>>(true)
  expectType<TypeEqual<Array<Database['public']['Tables']['best_friends']['Row']>, typeof data.second_friend_of>>(true)
  expectType<TypeEqual<Array<Database['public']['Tables']['best_friends']['Row']>, typeof data.third_wheel_of>>(true)
}

// join over a 1-M relation with both nullables and non-nullables fields using no hinting on nested relation
{
  const { data, error } = await selectQueries.joinOneToManyWithNullablesNoHintOnNestedRelation
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<SelectQueryError<"Could not embed because more than one relationship was found for 'users' and 'best_friends' you need to hint the column with users!<columnName> ?">>(data.first_friend_of[0].first_user)
}

// !left join on one to 0-1 non-empty relation
{
  const { data, error } = await selectQueries.leftOneToOneUsers.single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Array<Pick<Database['public']['Tables']['user_profiles']['Row'], 'username'>>, typeof data.user_profiles>>(true)
}

// join on one to 0-1 non-empty relation via column name
{
  const { data, error } = await selectQueries.oneToOneUsersColumnName.single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Array<Pick<Database['public']['Tables']['user_profiles']['Row'], 'username'>>, typeof data.user_profiles>>(true)
}

// !left join on zero to one with null relation
{
  const { data, error } = await selectQueries.leftZeroToOneUserProfiles.single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Database['public']['Tables']['users']['Row'] | null, typeof data.users>>(true)
}

// !left join on zero to one with valid relation
{
  const { data, error } = await selectQueries.leftZeroToOneUserProfilesWithNullables.single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Pick<Database['public']['Tables']['users']['Row'], 'status'> | null, typeof data.users>>(true)
}

// !left join on zero to one empty relation
{
  const { data, error } = await selectQueries.leftOneToOneUsers.single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Array<Pick<Database['public']['Tables']['user_profiles']['Row'], 'username'>>, typeof data.user_profiles>>(true)
}

// join select via unique table relationship
{
  const { data, error } = await selectQueries.joinSelectViaUniqueTableRelationship.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Database['public']['Tables']['users']['Row'] | null, typeof data.users>>(true)
}

// select with aggregate count function
{
  const { data, error } = await selectQueries.selectWithAggregateCountFunction.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    username: string
    messages: Array<{
      count: number
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// join on 1-1 relation with nullables
{
  const { data, error } = await selectQueries.joinOneToOneWithNullablesFkHint
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<Database['public']['Tables']['users']['Row']>(data.first_user)
  expectType<Database['public']['Tables']['users']['Row']>(data.second_user)
  // This one might be null
  expectType<Database['public']['Tables']['users']['Row'] | null>(data.third_wheel)
}

// join over a 1-1 relation with both nullables and non-nullables fields using foreign key name for hinting
{
  const { data: bestFriends, error } = await selectQueries.joinOneToOneWithFkHint
    .single()

  if (error) {
    throw new Error(error.message)
  }

  expectType<Database['public']['Tables']['users']['Row']>(bestFriends.first_user)
  expectType<Database['public']['Tables']['users']['Row']>(bestFriends.second_user)
  // The third wheel should be nullable
  expectType<Database['public']['Tables']['users']['Row'] | null>(bestFriends.third_wheel)
}

// select with nested aggregate count function
{
  const { data, error } = await selectQueries.selectWithAggregateNestedCountFunction.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    username: string
    messages: Array<{
      channels: {
        count: number
      }
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// select with aggregate sum function on nested relation
{
  const { data, error } = await selectQueries.selectWithAggregateSumFunctionOnNestedRelation.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }

  type ExpectedType = {
    username: string
    messages: Array<{
      channels: {
        sum: number
      }
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// select with aggregate sum and spread
{
  const { data, error } = await selectQueries.selectWithAggregateSumAndSpread.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    username: string
    messages: Array<{
      channels: {
        sum: number
        details: string | null
      }
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// select with aggregate sum function
{
  const { data, error } = await selectQueries.selectWithAggregateSumFunction.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    username: string
    messages: Array<{
      sum: number
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}
// TODO: From here live the dragons and errors

// join on 1-M relation with selective fk hinting
{
  const { data, error } = await selectQueries.joinOneToManyUsersWithFkHintSelective.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Array<Pick<Database['public']['Tables']['best_friends']['Row'], 'id'>>, typeof data.first_friend_of>>(true)
  expectType<TypeEqual<Array<Database['public']['Tables']['best_friends']['Row']>, typeof data.second_friend_of>>(true)
  expectType<TypeEqual<Array<Database['public']['Tables']['best_friends']['Row']>, typeof data.third_wheel_of>>(true)
}

// join select via column
{
  const { data, error } = await selectQueries.joinSelectViaColumn.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Database['public']['Tables']['users']['Row'] | null, typeof data.username>>(true)
}

// select with aggregate count function and alias
{
  const { data, error } = await selectQueries.selectWithAggregateCountFunctionAndAlias.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    username: string
    messages: Array<{
      message_count: number
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// select with aggregate nested count function and alias
{
  const { data, error } = await selectQueries.selectWithAggregateNestedCountFunctionAndAlias.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    username: string
    messages: Array<{
      channels: {
        channel_count: number
      } | null
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// select with aggregate count and spread
{
  const { data, error } = await selectQueries.selectWithAggregateCountAndSpread.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    username: string
    messages: Array<{
      channels: {
        count: number
        details: string | null
      }
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// select with aggregate aliased sum function
{
  const { data, error } = await selectQueries.selectWithAggregateSumFunction.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    username: string
    messages: Array<{
      sum_id: number
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// select with aggregate sum and spread on nested relation
{
  const { data, error } = await selectQueries.selectWithAggregateSumAndSpreadOnNestedRelation.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = {
    username: string
    messages: Array<{
      channels: {
        sum: number
        details_sum: number
        details: string | null
      }
    }>
  }
  expectType<TypeEqual<ExpectedType, typeof data>>(true)
}

// join select via column and alias
{
  const { data, error } = await selectQueries.joinSelectViaColumnAndAlias.limit(1).single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<TypeEqual<Database['public']['Tables']['users']['Row'] | null, typeof data.user>>(true)
}


// join on 1-M relation

{
  const { data, error } = await selectQueries.joinOneToManyUsersWithFkHint
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(data.first_friend_of)
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(data.second_friend_of)
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(data.third_wheel_of)
}