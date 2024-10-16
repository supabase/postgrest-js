import { expectAssignable } from 'tsd'
import type { ParseQuery, ParserError } from '../../src/select-query-parser/parser'
import { selectParams } from '../relationships'

// This test file is here to ensure some of our perser behave as expected
// it's useful to track down if the result type of a query is invalid becase of bad parsing
// or because of invalid matching against the final database type
// Basic select with multiple fields
{
  expectAssignable<ParseQuery<'username, email, created_at'>>([
    { type: 'field', name: 'username' },
    { type: 'field', name: 'email' },
    { type: 'field', name: 'created_at' },
  ])
}

// Select with star
{
  expectAssignable<ParseQuery<'*'>>([{ type: 'star' }])
}

{
  expectAssignable<ParseQuery<'username, *'>>([
    { type: 'field', name: 'username' },
    { type: 'star' },
  ])
}

// Select with renamed field
{
  expectAssignable<ParseQuery<'display_name:username'>>([
    { type: 'field', name: 'username', alias: 'display_name' },
  ])
}

// Select with embedded resource
{
  expectAssignable<ParseQuery<'posts(id, title, content)'>>([
    {
      type: 'field',
      name: 'posts',
      children: [
        { type: 'field', name: 'id' },
        { type: 'field', name: 'title' },
        { type: 'field', name: 'content' },
      ],
    },
  ])
}

// Select with nested embedded resources
{
  expectAssignable<ParseQuery<'posts(id, title, author(name, email))'>>([
    {
      type: 'field',
      name: 'posts',
      children: [
        { type: 'field', name: 'id' },
        { type: 'field', name: 'title' },
        {
          type: 'field',
          name: 'author',
          children: [
            { type: 'field', name: 'name' },
            { type: 'field', name: 'email' },
          ],
        },
      ],
    },
  ])
}

// Select with aggregation
{
  expectAssignable<ParseQuery<'posts(count)'>>([
    {
      type: 'field',
      name: 'posts',
      children: [{ type: 'field', name: 'count', aggregateFunction: 'count' }],
    },
  ])
}

// Select with JSON accessor
{
  expectAssignable<ParseQuery<'data->preferences->theme'>>([
    { type: 'field', name: 'data', alias: 'theme', castType: 'json' },
  ])
}

// Select with JSON accessor and text conversion
{
  expectAssignable<ParseQuery<'data->preferences->>theme'>>([
    { type: 'field', name: 'data', alias: 'theme', castType: 'text' },
  ])
}

// Select with spread
{
  expectAssignable<ParseQuery<'username, ...posts(id, title)'>>([
    {
      type: 'field',
      name: 'username',
    },
    {
      type: 'spread',
      target: {
        type: 'field',
        name: 'posts',
        children: [
          { type: 'field', name: 'id' },
          { type: 'field', name: 'title' },
        ],
      },
    },
  ])
}
{
  expectAssignable<ParseQuery<'...users (first_name, last_name)'>>([
    {
      type: 'spread',
      target: {
        type: 'field',
        name: 'users',
        children: [
          { type: 'field', name: 'first_name' },
          { type: 'field', name: 'last_name' },
        ],
      },
    },
  ])
}

// Select with inner join
{
  expectAssignable<ParseQuery<'posts!inner(id, title)'>>([
    {
      type: 'field',
      name: 'posts',
      children: [
        { type: 'field', name: 'id' },
        { type: 'field', name: 'title' },
      ],
      inner: true,
    },
  ])
}

// Select with left join
{
  expectAssignable<ParseQuery<'posts!left(id, title)'>>([
    {
      type: 'field',
      name: 'posts',
      children: [
        { type: 'field', name: 'id' },
        { type: 'field', name: 'title' },
      ],
    },
  ])
}

// Select with rename and hint
{
  expectAssignable<ParseQuery<'author:users!user_id(id, name)'>>([
    {
      type: 'field',
      name: 'users',
      alias: 'author',
      hint: 'user_id',
      children: [
        { type: 'field', name: 'id' },
        { type: 'field', name: 'name' },
      ],
    },
  ])
}

// Complex select combining multiple features
{
  expectAssignable<
    ParseQuery<'id, username, posts!left(id, title, comments(id, content)), profile->settings->>theme::text'>
  >([
    { type: 'field', name: 'id' },
    { type: 'field', name: 'username' },
    {
      type: 'field',
      name: 'posts',
      children: [
        { type: 'field', name: 'id' },
        { type: 'field', name: 'title' },
        {
          type: 'field',
          name: 'comments',
          children: [
            { type: 'field', name: 'id' },
            { type: 'field', name: 'content' },
          ],
        },
      ],
    },
    { type: 'field', name: 'profile', alias: 'theme', castType: 'text' },
  ])
}
{
  type t = ParseQuery<'id, posts(count), comments(sum:id.sum())'>
  type aggFunction = t[1]['children'][0]['aggregateFunction']
  type isCount = aggFunction extends 'count' ? true : false
  expectAssignable<isCount>(true)
  expectAssignable<ParseQuery<'id, posts(count), comments(sum:id.sum())'>>([
    { type: 'field', name: 'id' },
    {
      type: 'field',
      name: 'posts',
      children: [{ type: 'field', name: 'count', aggregateFunction: 'count' }],
    },
    {
      type: 'field',
      name: 'comments',
      children: [{ type: 'field', alias: 'sum', name: 'id', aggregateFunction: 'sum' }],
    },
  ])
}
{
  expectAssignable<ParseQuery<'id, posts(count), comments(id.sum())'>>([
    { type: 'field', name: 'id' },
    {
      type: 'field',
      name: 'posts',
      children: [{ type: 'field', name: 'count', aggregateFunction: 'count' }],
    },
    {
      type: 'field',
      name: 'comments',
      children: [{ type: 'field', name: 'id', aggregateFunction: 'sum' }],
    },
  ])
}
{
  expectAssignable<ParseQuery<'id, posts(id.count())'>>([
    { type: 'field', name: 'id' },
    {
      type: 'field',
      name: 'posts',
      children: [{ type: 'field', name: 'id', aggregateFunction: 'count' }],
    },
  ])
}
{
  expectAssignable<ParseQuery<'id, posts(aliased:id.count())'>>([
    { type: 'field', name: 'id' },
    {
      type: 'field',
      name: 'posts',
      children: [{ type: 'field', name: 'id', alias: 'aliased', aggregateFunction: 'count' }],
    },
  ])
}
{
  expectAssignable<ParseQuery<'id, posts(count())'>>([
    { type: 'field', name: 'id' },
    {
      type: 'field',
      name: 'posts',
      children: [{ type: 'field', name: 'count', aggregateFunction: 'count' }],
    },
  ])
}
{
  type t = ParseQuery<'id, posts(renamed_count:count())'>
  type aggFunction = t[1]['children'][0]['aggregateFunction']
  type isCount = aggFunction extends 'count' ? true : false
  expectAssignable<isCount>(true)
  expectAssignable<ParseQuery<'id, posts(renamed_count:count())'>>([
    { type: 'field', name: 'id' },
    {
      type: 'field',
      name: 'posts',
      children: [
        { type: 'field', alias: 'renamed_count', name: 'count', aggregateFunction: 'count' },
      ],
    },
  ])
}
{
  type t = ParseQuery<'username, messages(channels(channel_count:count()))'>
  type aggFunction = t[1]['children'][0]['children'][0]['aggregateFunction']
  type isCount = aggFunction extends 'count' ? true : false
  expectAssignable<isCount>(true)
  expectAssignable<ParseQuery<'username, messages(channels(channel_count:count()))'>>([
    { type: 'field', name: 'username' },
    {
      type: 'field',
      name: 'messages',
      children: [
        {
          type: 'field',
          name: 'channels',
          children: [
            {
              type: 'field',
              alias: 'channel_count',
              name: 'count',
              aggregateFunction: 'count',
            },
          ],
        },
      ],
    },
  ])
}
// Other than count aggregation function without column name
// should be a field like any other
{
  expectAssignable<ParseQuery<'posts(sum)'>>([
    { type: 'field', name: 'posts', children: [{ type: 'field', name: 'sum' }] },
  ])
}
// Should be considered embeded with parenthesis
{
  expectAssignable<ParseQuery<'posts(sum())'>>([
    { type: 'field', name: 'posts', children: [{ type: 'field', name: 'sum', children: [] }] },
  ])
}

// Select with nested JSON accessors
{
  expectAssignable<ParseQuery<'data->preferences->theme->color'>>([
    { type: 'field', name: 'data', alias: 'color', castType: 'json' },
  ])
}

// Select with multiple spreads
{
  expectAssignable<ParseQuery<'id, ...profile(name, email), ...settings(theme, language)'>>([
    { type: 'field', name: 'id' },
    {
      type: 'spread',
      target: {
        type: 'field',
        name: 'profile',
        children: [
          { type: 'field', name: 'name' },
          { type: 'field', name: 'email' },
        ],
      },
    },
    {
      type: 'spread',
      target: {
        type: 'field',
        name: 'settings',
        children: [
          { type: 'field', name: 'theme' },
          { type: 'field', name: 'language' },
        ],
      },
    },
  ])
}

// Select with multiple hints
{
  expectAssignable<ParseQuery<'author:users!user_id(id, name), posts!post_id(title, content)'>>([
    {
      type: 'field',
      alias: 'author',
      name: 'users',
      hint: 'user_id',
      children: [
        { type: 'field', name: 'id' },
        { type: 'field', name: 'name' },
      ],
    },
    {
      type: 'field',
      name: 'posts',
      hint: 'post_id',
      children: [
        { type: 'field', name: 'title' },
        { type: 'field', name: 'content' },
      ],
    },
  ])
}

// Select with combination of inner and left joins
{
  expectAssignable<ParseQuery<'users!inner(id, name), posts!left(title, content)'>>([
    {
      type: 'field',
      name: 'users',
      children: [
        { type: 'field', name: 'id' },
        { type: 'field', name: 'name' },
      ],
      inner: true,
    },
    {
      type: 'field',
      name: 'posts',
      children: [
        { type: 'field', name: 'title' },
        { type: 'field', name: 'content' },
      ],
    },
  ])
}

// Select with quoted identifiers
{
  expectAssignable<ParseQuery<'"user name":"complex name", "post-title":posts("content-body")'>>([
    { type: 'field', name: 'complex name', alias: 'user name' },
    {
      type: 'field',
      alias: 'post-title',
      name: 'posts',
      children: [{ type: 'field', name: 'content-body' }],
    },
  ])
}

// Select with nested aggregations and type castings
{
  expectAssignable<ParseQuery<'users(id, posts(count::int, avg_likes:likes.avg()::float))'>>([
    {
      type: 'field',
      name: 'users',
      children: [
        { type: 'field', name: 'id' },
        {
          type: 'field',
          name: 'posts',
          children: [
            { type: 'field', name: 'count', castType: 'int', aggregateFunction: 'count' },
            {
              type: 'field',
              alias: 'avg_likes',
              name: 'likes',
              castType: 'float',
              aggregateFunction: 'avg',
            },
          ],
        },
      ],
    },
  ])
}

// Invalid type cast
{
  expectAssignable<ParseQuery<'id::invalid_type'>>([
    {
      type: 'field',
      name: 'id',
      castType: 'invalid_type',
    },
  ])
}

// Select with multiple type castings
{
  expectAssignable<ParseQuery<'id::text, created_at::date, data->age::int'>>([
    { type: 'field', name: 'id', castType: 'text' },
    { type: 'field', name: 'created_at', castType: 'date' },
    { type: 'field', name: 'data', alias: 'age', castType: 'int' },
  ])
}

// Select with type casting
{
  expectAssignable<ParseQuery<'id::text, created_at::date, other::int'>>([
    { type: 'field', name: 'id', castType: 'text' },
    { type: 'field', name: 'created_at', castType: 'date' },
    { type: 'field', name: 'other', castType: 'int' },
  ])
}

// select JSON accessor
{
  expect<ParseQuery<typeof selectParams.selectJsonAccessor.select>>([
    { type: 'field', name: 'data', alias: 'bar', castType: 'json' },
    { type: 'field', name: 'data', alias: 'baz', castType: 'text' },
  ])
}

// embed resource with no fields
{
  expect<ParseQuery<typeof selectParams.selectEmbedRessourceWithNoFields.select>>([
    { type: 'field', name: 'message' },
    { type: 'field', name: 'users', children: [] },
  ])
}

// ParserError test cases
// Empty string
{
  const r: ParserError<'Empty string'> = 'Empty string' as ParserError<'Empty string'>
  expectAssignable<ParseQuery<''>>(r)
}

// Unexpected input at the end
{
  const r: ParserError<'Unexpected input: unexpected_input'> =
    'Unexpected input: unexpected_input' as ParserError<'Unexpected input: unexpected_input'>
  expectAssignable<ParseQuery<'id, name unexpected_input'>>(r)
}

// Missing closing parenthesis
{
  const r: ParserError<"Expected ')' at "> = "Expected ')' at " as ParserError<"Expected ')' at ">
  expectAssignable<ParseQuery<'users(id, name'>>(r)
}

// Incomplete JSON accessor
{
  const r: ParserError<'Unexpected input: ->'> =
    'Unexpected input: ->' as ParserError<'Unexpected input: ->'>
  expectAssignable<ParseQuery<'data->'>>(r)
}

// Invalid hint (missing identifier after !)
{
  const r: ParserError<"Expected identifier after '!' at (id, name)"> =
    "Expected identifier after '!' at (id, name)" as ParserError<"Expected identifier after '!' at (id, name)">
  expectAssignable<ParseQuery<'users!(id, name)'>>(r)
}

// Invalid spread (missing field after ...)
{
  const r: ParserError<'Unable to parse spread resource at ...::'> =
    'Unable to parse spread resource at ...::' as ParserError<'Unable to parse spread resource at ...::'>
  expectAssignable<ParseQuery<'...::'>>(r)
}

// Invalid rename (missing field after :)
{
  const r: ParserError<'Unable to parse renamed field at new_name:'> =
    'Unable to parse renamed field at new_name:' as ParserError<'Unable to parse renamed field at new_name:'>
  expectAssignable<ParseQuery<'new_name:'>>(r)
}

// Incomplete quoted identifier
{
  const r: ParserError<'Expected identifier at `"incomplete`'> =
    'Expected identifier at `"incomplete`' as ParserError<'Expected identifier at `"incomplete`'>
  expectAssignable<ParseQuery<'"incomplete'>>(r)
}

// Invalid combination of inner and left join
{
  const r: ParserError<'Expected embedded resource after `!inner`'> =
    'Expected embedded resource after `!inner`' as ParserError<'Expected embedded resource after `!inner`'>
  expectAssignable<ParseQuery<'users!inner!left(id, name)'>>(r)
}

// Missing opening parenthesis after aggregate function
{
  const r: ParserError<'Expected `()` after `.` operator `avg`'> =
    'Expected `()` after `.` operator `avg`' as ParserError<'Expected `()` after `.` operator `avg`'>
  expectAssignable<ParseQuery<'posts(likes.avg'>>(r)
}

// Invalid nested JSON accessor
{
  const r: ParserError<'Unexpected input: ->->theme'> =
    'Unexpected input: ->->theme' as ParserError<'Unexpected input: ->->theme'>
  expectAssignable<ParseQuery<'data->preferences->->theme'>>(r)
}
