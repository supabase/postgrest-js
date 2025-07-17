import { expectType } from 'tsd'
import { PostgrestClient } from '../../src/index'
import { Database } from '../types.override'
import { Database as DatabaseWithOptions } from '../types.override-with-options-postgrest13'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)
const postgrestWithOptions = new PostgrestClient<DatabaseWithOptions>(REST_URL)

// table invalid type
{
  // @ts-expect-error not a string
  postgrest.from(42)
  // @ts-expect-error invalid table
  postgrest.from('nonexistent_table')
}

// PostgrestBuilder's children retains class when using inherited methods
{
  const x = postgrest.from('channels').select()
  const y = x.throwOnError()
  const z = x.setHeader('', '')
  expectType<typeof y extends typeof x ? true : false>(true)
  expectType<typeof z extends typeof x ? true : false>(true)
}

// cannot update non-updatable views
{
  // @ts-expect-error non_updatable_view
  postgrest.from('non_updatable_view').update({ non_updatable_column: 0 })
}

// cannot update non-updatable columns
{
  // @ts-expect-error non_updatable_column
  postgrest.from('updatable_view').update({ non_updatable_column: 0 })
}

// Check that client options __InternalSupabase isn't considered like the other schemas
{
  await postgrestWithOptions
    // @ts-expect-error supabase internal shouldn't be available as one of the selectable schema
    .schema('__InternalSupabase')
}
