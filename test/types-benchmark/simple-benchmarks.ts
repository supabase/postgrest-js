import { bench } from '@ark/attest'
import { PostgrestClient } from '../../src/index'
import { Database } from '../types.generated'

// Create a mock client for type inference testing
const createMockClient = () => {
  return new PostgrestClient<Database>('http://localhost:3000')
}

// Simple benchmarks that should work
bench('Simple Select: Basic', () => {
  return createMockClient().from('users').select()
}).types([870, 'instantiations'])

bench('Simple Select: Single Column', () => {
  return createMockClient().from('users').select('username')
}).types([7, 'instantiations'])

bench('Simple Update: Basic', () => {
  return createMockClient().from('users').update({ status: 'ONLINE' })
}).types([56, 'instantiations'])

bench('Simple Insert: Basic', () => {
  return createMockClient().from('users').insert({ username: 'testuser' })
}).types([56, 'instantiations'])

bench('Simple RPC: Basic', () => {
  return createMockClient().rpc('get_status', { name_param: 'test' })
}).types([53, 'instantiations'])
