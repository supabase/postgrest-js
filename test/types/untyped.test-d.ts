import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import { PostgrestClient } from '../../src/index'

const REST_URL = 'http://localhost:3000'
const untypedPostgrest = new PostgrestClient(REST_URL)

// Default client without types provided should work with any
{
  const { data } = await untypedPostgrest.from('user_profile').select()
  expectType<TypeEqual<typeof data, any[] | null>>(true)
}

// basic embeding
{
  const { data } = await untypedPostgrest
    .from('user_profile')
    .select(
      'user_id, some_embed(*), another_embed(first_field, second_field, renamed:field), aninnerembed!inner(id, name)'
    )
    .single()
  let result: Exclude<typeof data, null>
  let expected: {
    user_id: any
    some_embed: any[]
    another_embed: {
      first_field: any
      second_field: any
      renamed: any
    }[]
    aninnerembed: {
      id: any
      name: any
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// spread operator with stars should return any
{
  const { data } = await untypedPostgrest
    .from('user_profile')
    .select('user_id, some_embed(*), ...spreadstars(*)')
    .single()
  let result: Exclude<typeof data, null>
  let expected: any
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// nested spread operator with stars should return any
{
  const { data } = await untypedPostgrest
    .from('user_profile')
    .select('user_id, some_embed(*), some_other(id, ...spreadstars(*))')
    .single()
  let result: Exclude<typeof data, null>
  let expected: {
    user_id: any
    some_embed: any[]
    some_other: any[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// rpc without types should return any
{
  const { data } = await untypedPostgrest
    .rpc('user_profile')
    .select('user_id, some_embed(*)')
    .single()
  let result: Exclude<typeof data, null>
  let expected: {
    user_id: any
    some_embed: any[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// check for nested operators
{
  const { data } = await untypedPostgrest
    .from('user_profile')
    .select(
      'user_id, some_embed(*), another_embed(first_field, second_field, renamed:field), aninnerembed!inner(id, name), ...spreadwithfields(field_spread, another)'
    )
    .single()
  let result: Exclude<typeof data, null>
  let expected: {
    user_id: any
    some_embed: any[]
    another_embed: {
      first_field: any
      second_field: any
      renamed: any
    }[]
    aninnerembed: {
      id: any
      name: any
    }[]
    field_spread: any
    another: any
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}

// embedding renaming
{
  const { data } = await untypedPostgrest
    .from('projects')
    .select('status,service:services(service_api_keys(*))')
    .single()
  let result: Exclude<typeof data, null>
  let expected: {
    status: any
    service: {
      service_api_keys: any[]
    }[]
  }
  expectType<TypeEqual<typeof result, typeof expected>>(true)
}
