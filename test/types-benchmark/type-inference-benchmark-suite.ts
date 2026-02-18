import { bench } from '@ark/attest'
import { PostgrestClient } from '../src/index'
import { Database } from './types.generated'

// Enhanced benchmarking suite for PostgREST-js type inference performance
// Based on the approach from: https://www.geldata.com/blog/an-approach-to-optimizing-typescript-type-checking-performance

// Mock client factory for consistent testing
const createMockClient = () => {
  return new PostgrestClient<Database>('http://localhost:3000')
}

// Benchmark configuration following the article's approach
const config = {
  iterations: 50,
  warmup: 5,
  threshold: 20, // 20% performance threshold
}

// ============================================================================
// BASELINE MEASUREMENT
// ============================================================================

bench.baseline(() => {
  return createMockClient().from('users').select('username')
})

// ============================================================================
// SCHEMA COMPLEXITY TESTS
// ============================================================================

// Small schema (1-2 tables)
bench('Schema Complexity: Small Schema', () => {
  return createMockClient().from('users').select('username, status')
}).types([config.iterations, 'instantiations'])

// Medium schema (3-5 tables)
bench('Schema Complexity: Medium Schema', () => {
  return createMockClient()
    .from('messages')
    .select(
      'id, message, users!messages_username_fkey(username), channels!messages_channel_id_fkey(slug)'
    )
}).types([config.iterations, 'instantiations'])

// Large schema (6+ tables with deep nesting)
bench('Schema Complexity: Large Schema', () => {
  return createMockClient().from('messages').select(`
    id, 
    message, 
    users!messages_username_fkey(
      username, 
      status, 
      user_profiles(username),
      best_friends!best_friends_first_user_fkey(second_user, users!best_friends_second_user_fkey(username))
    ), 
    channels!messages_channel_id_fkey(
      slug, 
      channel_details(details)
    )
  `)
}).types([config.iterations, 'instantiations'])

// ============================================================================
// OPERATION TYPE TESTS
// ============================================================================

// Select operations with varying complexity
bench('Operation Type: Select Basic', () => {
  return createMockClient().from('users').select()
}).types([config.iterations, 'instantiations'])

bench('Operation Type: Select With Relations', () => {
  return createMockClient()
    .from('best_friends')
    .select('id, first_user, second_user, users!best_friends_first_user_fkey(username)')
}).types([config.iterations, 'instantiations'])

bench('Operation Type: Select Deep Nesting', () => {
  return createMockClient().from('messages').select(`
    id, 
    message, 
    users!messages_username_fkey(
      username, 
      status, 
      user_profiles(username),
      best_friends!best_friends_first_user_fkey(second_user)
    ), 
    channels!messages_channel_id_fkey(
      slug, 
      channel_details(details)
    )
  `)
}).types([config.iterations, 'instantiations'])

// Update operations
bench('Operation Type: Update Simple', () => {
  return createMockClient().from('users').update({ status: 'ONLINE' })
}).types([config.iterations, 'instantiations'])

bench('Operation Type: Update With Relations', () => {
  return createMockClient().from('best_friends').update({ third_wheel: 'testuser' })
}).types([config.iterations, 'instantiations'])

// Insert operations
bench('Operation Type: Insert Simple', () => {
  return createMockClient().from('users').insert({ username: 'testuser' })
}).types([config.iterations, 'instantiations'])

bench('Operation Type: Insert With Relations', () => {
  return createMockClient()
    .from('messages')
    .insert({ message: 'test', username: 'testuser', channel_id: 1 })
}).types([config.iterations, 'instantiations'])

// RPC operations
bench('Operation Type: RPC Simple', () => {
  return createMockClient().rpc('get_status', { name_param: 'test' })
}).types([config.iterations, 'instantiations'])

bench('Operation Type: RPC With Select', () => {
  return createMockClient().rpc('get_status', { name_param: 'test' }).select('*')
}).types([config.iterations, 'instantiations'])

// ============================================================================
// RELATIONSHIP COMPLEXITY TESTS
// ============================================================================

// One-to-one relationships
bench('Relationship: One-to-One', () => {
  return createMockClient()
    .from('user_profiles')
    .select('id, username, users!user_profiles_username_fkey(username, status)')
}).types([config.iterations, 'instantiations'])

// One-to-many relationships
bench('Relationship: One-to-Many', () => {
  return createMockClient()
    .from('users')
    .select('username, status, messages!messages_username_fkey(id, message)')
}).types([config.iterations, 'instantiations'])

// Many-to-many relationships
bench('Relationship: Many-to-Many', () => {
  return createMockClient().from('products').select(`
    id, 
    name, 
    product_categories(
      categories(name, description)
    )
  `)
}).types([config.iterations, 'instantiations'])

// Self-referencing relationships
bench('Relationship: Self-Referencing', () => {
  return createMockClient()
    .from('collections')
    .select('id, description, parent_id, collections!collections_parent_id_fkey(id, description)')
}).types([config.iterations, 'instantiations'])

// ============================================================================
// AGGREGATE FUNCTION TESTS
// ============================================================================

bench('Aggregate: Single Count', () => {
  return createMockClient().from('users').select('username.count()')
}).types([config.iterations, 'instantiations'])

bench('Aggregate: Multiple Counts', () => {
  return createMockClient().from('users').select('username.count(), status.count(), data.count()')
}).types([config.iterations, 'instantiations'])

bench('Aggregate: With Relations', () => {
  return createMockClient()
    .from('messages')
    .select('id.count(), users!messages_username_fkey(username.count())')
}).types([config.iterations, 'instantiations'])

// ============================================================================
// CASTING AND TYPE OPERATIONS
// ============================================================================

bench('Casting: Basic Casting', () => {
  return createMockClient().from('users').select('username::text, status::text')
}).types([config.iterations, 'instantiations'])

bench('Casting: Complex Casting', () => {
  return createMockClient().from('users').select('username::text, status::text, data::jsonb')
}).types([config.iterations, 'instantiations'])

bench('Casting: With Relations', () => {
  return createMockClient()
    .from('messages')
    .select('id::text, message::text, users!messages_username_fkey(username::text)')
}).types([config.iterations, 'instantiations'])

// ============================================================================
// SPREAD OPERATIONS
// ============================================================================

bench('Spread: Basic Spread', () => {
  return createMockClient().from('users').select('username, ...user_profiles(*)')
}).types([config.iterations, 'instantiations'])

bench('Spread: Nested Spread', () => {
  return createMockClient()
    .from('users')
    .select('username, ...user_profiles(username), ...best_friends(*)')
}).types([config.iterations, 'instantiations'])

// ============================================================================
// FILTER CHAIN TESTS
// ============================================================================

bench('Filter Chain: Simple Filters', () => {
  return createMockClient().from('users').select('username, status').eq('status', 'ONLINE')
}).types([config.iterations, 'instantiations'])

bench('Filter Chain: Complex Filters', () => {
  return createMockClient()
    .from('users')
    .select('username, status')
    .eq('status', 'ONLINE')
    .gte('age_range', '[20,30)')
}).types([config.iterations, 'instantiations'])

bench('Filter Chain: With Relations', () => {
  return createMockClient()
    .from('messages')
    .select('id, message, users!messages_username_fkey(username)')
    .eq('channel_id', 1)
}).types([config.iterations, 'instantiations'])

// ============================================================================
// STRESS TESTS
// ============================================================================

bench('Stress Test: Maximum Nesting', () => {
  return createMockClient().from('messages').select(`
    id, 
    message, 
    users!messages_username_fkey(
      username, 
      status, 
      user_profiles(username),
      best_friends!best_friends_first_user_fkey(
        second_user, 
        users!best_friends_second_user_fkey(
          username, 
          status,
          user_profiles(username)
        )
      )
    ), 
    channels!messages_channel_id_fkey(
      slug, 
      channel_details(details)
    )
  `)
}).types([config.iterations, 'instantiations'])

bench('Stress Test: Maximum Aggregates', () => {
  return createMockClient().from('users').select(`
    username.count(), 
    status.count(), 
    data.count(),
    messages!messages_username_fkey(id.count(), message.count())
  `)
}).types([config.iterations, 'instantiations'])

bench('Stress Test: Maximum Casting', () => {
  return createMockClient().from('users').select(`
    username::text, 
    status::text, 
    data::jsonb,
    messages!messages_username_fkey(id::text, message::text)
  `)
}).types([config.iterations, 'instantiations'])

// ============================================================================
// PERFORMANCE REGRESSION TESTS
// ============================================================================

bench('Performance Regression: Deep Nesting', () => {
  return createMockClient().from('messages').select(`
    id, 
    message, 
    users!messages_username_fkey(
      username, 
      status, 
      user_profiles(username),
      best_friends!best_friends_first_user_fkey(
        second_user, 
        users!best_friends_second_user_fkey(username, status)
      )
    ), 
    channels!messages_channel_id_fkey(
      slug, 
      channel_details(details)
    )
  `)
}).types([config.iterations, 'instantiations'])

bench('Performance Regression: Complex RPC with Select', () => {
  return createMockClient()
    .rpc('get_status', { name_param: 'test' })
    .select('username, status, data')
}).types([config.iterations, 'instantiations'])

bench('Performance Regression: Many-to-Many with Aggregates', () => {
  return createMockClient().from('products').select(`
    id, 
    name, 
    product_categories.count(),
    product_categories(
      categories(name, description)
    )
  `)
}).types([config.iterations, 'instantiations'])

// Export configuration for use in other files
export { config }
