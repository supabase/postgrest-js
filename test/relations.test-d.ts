import { expectType } from 'tsd'
import { PostgrestClient, PostgrestSingleResponse } from '../src/index'
import { SelectQueryError } from '../src/select-query-parser'
import { Prettify } from '../src/types'
import { Database } from './types'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

// many-to-one relationship
{
  const { data: message, error } = await postgrest.from('messages').select('user:users(*)').single()
  if (error) {
    throw new Error(error.message)
  }
  expectType<Database['public']['Tables']['users']['Row'] | null>(message.user)
}

// !inner relationship
{
  const { data: message, error } = await postgrest
    .from('messages')
    .select('channels!inner(*, channel_details!inner(*))')
    .single()
  if (error) {
    throw new Error(error.message)
  }
  type ExpectedType = Prettify<
    Database['public']['Tables']['channels']['Row'] & {
      channel_details: Database['public']['Tables']['channel_details']['Row']
    }
  >

  expectType<ExpectedType>(message.channels)
}

// one-to-many relationship
{
  const { data: user, error } = await postgrest.from('users').select('messages(*)').single()
  if (error) {
    throw new Error(error.message)
  }
  expectType<Database['public']['Tables']['messages']['Row'][]>(user.messages)
}

// referencing missing column
{
  const res = await postgrest.from('users').select('username, dat')
  expectType<PostgrestSingleResponse<SelectQueryError<`Referencing missing column \`dat\``>[]>>(res)
}

// one-to-one relationship
{
  const { data: channels, error } = await postgrest
    .from('channels')
    .select('channel_details(*)')
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
  const { data: oneToOne, error } = await postgrest
    .from('channel_details')
    .select('channels!left(*)')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // TODO: this should never be nullable
  expectType<Database['public']['Tables']['channels']['Row'] | null>(oneToOne.channels)
}

// !left oneToMany
{
  const { data: oneToMany, error } = await postgrest
    .from('users')
    .select('messages!left(*)')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  expectType<Array<Database['public']['Tables']['messages']['Row']>>(oneToMany.messages)
}

// !left zeroToOne
{
  const { data: zeroToOne, error } = await postgrest
    .from('user_profiles')
    .select('users!left(*)')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  expectType<Database['public']['Tables']['users']['Row'] | null>(zeroToOne.users)
}

// join over a 1-1 relation with both nullables and non-nullables fields using foreign key name for hinting
{
  const { data: bestFriends, error } = await postgrest
    .from('best_friends')
    .select(
      'first_user:users!best_friends_first_user_fkey(*), second_user:users!best_friends_second_user_fkey(*), third_wheel:users!best_friends_third_wheel_fkey(*)'
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // TODO: Those two fields shouldn't be nullables
  expectType<Database['public']['Tables']['users']['Row'] | null>(bestFriends.first_user)
  expectType<Database['public']['Tables']['users']['Row'] | null>(bestFriends.second_user)
  // The third wheel should be nullable
  expectType<Database['public']['Tables']['users']['Row'] | null>(bestFriends.third_wheel)
}
// join over a 1-M relation with both nullables and non-nullables fields using foreign key name for hinting
{
  const { data: users, error } = await postgrest
    .from('users')
    .select(
      `first_friend_of:best_friends_first_user_fkey(*),
      second_friend_of:best_friends_second_user_fkey(*),
      third_wheel_of:best_friends_third_wheel_fkey(*)`
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }
  // TODO: type properly the result for this kind of queries
  expectType<Array<{}>>(users.first_friend_of)
}

// join over a 1-1 relation with both nullables and non-nullables fields with no hinting
{
  const { data: bestFriends, error } = await postgrest
    .from('best_friends')
    .select('first_user:users!first_user(*), second_user:users(*)')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  expectType<Database['public']['Tables']['users']['Row'] | null>(bestFriends.first_user)
  expectType<
    SelectQueryError<"Could not embed because more than one relationship was found for 'users' and 'best_friends' you need to hint the column with users!<columnName> ?">
  >(bestFriends.second_user)
}

// join over a 1-1 relation with both nullables and non-nullables fields with column name hinting
{
  const { data: bestFriends, error } = await postgrest
    .from('best_friends')
    .select(
      'first_user:users!first_user(*), second_user:users!second_user(*), third_wheel:users!third_wheel(*)'
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // TODO: Those two fields shouldn't be nullables
  expectType<Database['public']['Tables']['users']['Row'] | null>(bestFriends.first_user)
  expectType<Database['public']['Tables']['users']['Row'] | null>(bestFriends.second_user)
  // The third wheel should be nullable
  expectType<Database['public']['Tables']['users']['Row'] | null>(bestFriends.third_wheel)
}

// join over a 1-M relation with both nullables and non-nullables fields using column name for hinting
{
  const { data: users, error } = await postgrest
    .from('users')
    .select(
      `first_friend_of:best_friends_first_user_fkey(*),
      second_friend_of:best_friends_second_user_fkey(*),
      third_wheel_of:best_friends_third_wheel_fkey(*)`
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }
  // TODO: type properly the result for this kind of queries
  expectType<Array<{}>>(users.first_friend_of)
}
// join over a 1-M relation with both nullables and non-nullables fields with no hinting should raise a SelectQueryError
{
  const { data: users, error } = await postgrest
    .from('users')
    .select(
      `first_friend_of:best_friends!first_user(*),
      second_friend_of:best_friends(*)`
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(users.first_friend_of)
  expectType<
    SelectQueryError<"Could not embed because more than one relationship was found for 'best_friends' and 'users' you need to hint the column with best_friends!<columnName> ?">
  >(users.second_friend_of)
}

// join over a 1-M relation with both nullables and non-nullables fields using column name for hinting
{
  const { data: users, error } = await postgrest
    .from('users')
    .select(
      `first_friend_of:best_friends!first_user(*),
      second_friend_of:best_friends!second_user(*),
      third_wheel_of:best_friends!third_wheel(*)`
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(users.first_friend_of)
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(users.second_friend_of)
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(users.third_wheel_of)
}

// join over a 1-M relation with both nullables and non-nullables fields using no hinting on nested relation
{
  const { data: users, error } = await postgrest
    .from('users')
    .select(
      `first_friend_of:best_friends!first_user(*, first_user:users!left(*)), second_friend_of:best_friends!second_user(*), third_wheel_of:best_friends!third_wheel(*)`
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }
  expectType<
    SelectQueryError<"Could not embed because more than one relationship was found for 'users' and 'best_friends' you need to hint the column with users!<columnName> ?">
  >(users.first_friend_of[0].first_user)
  expectType<Array<Database['public']['Tables']['best_friends']['Row']>>(users.second_friend_of)
}
