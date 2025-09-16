import { bench } from '@ark/attest'
import { PostgrestClient } from '../src/index'
import { Database } from './types.generated'

// Create a mock client for type inference testing
const createMockClient = () => {
  return new PostgrestClient<Database>('http://localhost:3000')
}

// ============================================================================
// BASELINE MEASUREMENT
// ============================================================================

bench.baseline(() => {
  return createMockClient().from('users').select('username')
})

// ============================================================================
// SIMPLE OPERATIONS BENCHMARKS
// ============================================================================

bench('Simple Select: Basic', () => {
  return createMockClient().from('users').select()
}).types([50, 'instantiations'])

bench('Simple Select: Single Column', () => {
  return createMockClient().from('users').select('username')
}).types([50, 'instantiations'])

bench('Simple Select: Multiple Columns', () => {
  return createMockClient().from('users').select('username, status, data')
}).types([50, 'instantiations'])

bench('Simple Select: With Alias', () => {
  return createMockClient().from('users').select('name:username, user_status:status')
}).types([50, 'instantiations'])

bench('Simple Update: Basic', () => {
  return createMockClient().from('users').update({ status: 'ONLINE' })
}).types([50, 'instantiations'])

bench('Simple Update: Multiple Fields', () => {
  return createMockClient()
    .from('users')
    .update({ status: 'ONLINE', data: { test: true } })
}).types([50, 'instantiations'])

bench('Simple Insert: Basic', () => {
  return createMockClient().from('users').insert({ username: 'testuser' })
}).types([50, 'instantiations'])

bench('Simple Insert: With Optional Fields', () => {
  return createMockClient()
    .from('users')
    .insert({ username: 'testuser', status: 'ONLINE', data: { test: true } })
}).types([50, 'instantiations'])

bench('Simple RPC: Basic', () => {
  return createMockClient().rpc('get_status', { name_param: 'test' })
}).types([50, 'instantiations'])

// ============================================================================
// MEDIUM COMPLEXITY BENCHMARKS
// ============================================================================

bench('Medium Select: With Relations', () => {
  return createMockClient()
    .from('best_friends')
    .select('id, first_user, second_user, users!best_friends_first_user_fkey(username, status)')
}).types([50, 'instantiations'])

bench('Medium Select: Nested Relations', () => {
  return createMockClient()
    .from('messages')
    .select(
      'id, message, users!messages_username_fkey(username), channels!messages_channel_id_fkey(slug)'
    )
}).types([50, 'instantiations'])

bench('Medium Select: With Aggregates', () => {
  return createMockClient().from('users').select('username.count(), status')
}).types([50, 'instantiations'])

bench('Medium Select: Complex Aliases', () => {
  return createMockClient()
    .from('users')
    .select('user_name:username, user_data:data, status_info:status')
}).types([50, 'instantiations'])

bench('Medium Update: With Relations', () => {
  return createMockClient().from('best_friends').update({ third_wheel: 'testuser' })
}).types([50, 'instantiations'])

bench('Medium Insert: With Relations', () => {
  return createMockClient()
    .from('messages')
    .insert({ message: 'test', username: 'testuser', channel_id: 1 })
}).types([50, 'instantiations'])

// ============================================================================
// HIGH COMPLEXITY BENCHMARKS
// ============================================================================

bench('Complex Select: Deep Nesting', () => {
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
}).types([50, 'instantiations'])

bench('Complex Select: Multiple Aggregates', () => {
  return createMockClient().from('users').select('username.count(), status.count(), data.count()')
}).types([50, 'instantiations'])

bench('Complex Select: Complex Casting', () => {
  return createMockClient().from('users').select('username::text, status::text, data::jsonb')
}).types([50, 'instantiations'])

bench('Complex Select: Spread Operations', () => {
  return createMockClient().from('users').select('username, ...user_profiles(*)')
}).types([50, 'instantiations'])

bench('Complex Update: Complex Relations', () => {
  return createMockClient()
    .from('best_friends')
    .update({ third_wheel: 'testuser' })
    .eq('first_user', 'testuser')
}).types([50, 'instantiations'])

// ============================================================================
// EDGE CASES AND STRESS TESTS
// ============================================================================

bench('Edge Case Select: All Columns', () => {
  return createMockClient().from('users').select('*')
}).types([50, 'instantiations'])

bench('Edge Case Select: Empty Select', () => {
  return createMockClient().from('users').select('')
}).types([50, 'instantiations'])

bench('Edge Case Select: Self Referencing', () => {
  return createMockClient()
    .from('collections')
    .select('id, description, parent_id, collections!collections_parent_id_fkey(id, description)')
}).types([50, 'instantiations'])

bench('Edge Case Select: Many to Many', () => {
  return createMockClient().from('products').select(`
    id, 
    name, 
    product_categories(
      categories(name, description)
    )
  `)
}).types([50, 'instantiations'])

bench('Edge Case RPC: With Select', () => {
  return createMockClient().rpc('get_status', { name_param: 'test' }).select('*')
}).types([50, 'instantiations'])

bench('Edge Case RPC: Complex RPC', () => {
  return createMockClient().rpc('get_status', { name_param: 'test' }).select('username, status')
}).types([50, 'instantiations'])

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
}).types([50, 'instantiations'])

bench('Performance Regression: Complex RPC with Select', () => {
  return createMockClient()
    .rpc('get_status', { name_param: 'test' })
    .select('username, status, data')
}).types([50, 'instantiations'])

bench('Performance Regression: Many-to-Many with Aggregates', () => {
  return createMockClient().from('products').select(`
    id, 
    name, 
    product_categories.count(),
    product_categories(
      categories(name, description)
    )
  `)
}).types([50, 'instantiations'])
