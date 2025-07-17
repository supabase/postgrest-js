import { expectType } from 'tsd'
import { PostgrestClient } from '../../src/index'
import { Json } from '../../src/select-query-parser/types'
import { Database } from '../types.override'
import type { MergeDeep } from 'type-fest'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient<Database>(REST_URL)

// json accessor in select query
{
  const result = await postgrest.from('users').select('data->foo->bar, data->foo->>baz').single()
  if (result.error) {
    throw new Error(result.error.message)
  }
  expectType<Json>(result.data.bar)
  expectType<string>(result.data.baz)
}

// Json Accessor with custom types overrides
{
  const result = await postgrest
    .schema('personal')
    .from('users')
    .select('data->bar->baz, data->en, data->bar')
  if (result.error) {
    throw new Error(result.error.message)
  }
  expectType<
    {
      baz: number
      en: 'ONE' | 'TWO' | 'THREE'
      bar: {
        baz: number
      }
    }[]
  >(result.data)
}

// Custom JSON type definitions and operations
{
  type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

  type Database = {
    public: {
      Tables: {
        foo: {
          Row: {
            created_at: string | null
            bar: Json
            id: string
            baz: Json
            game_id: string
            updated_at: string | null
            user_id: string | null
          }
          Insert: {
            created_at?: string | null
            bar: Json
            id?: string
            baz: Json
            game_id: string
            updated_at?: string | null
            user_id?: string | null
          }
          Update: {
            created_at?: string | null
            bar?: Json
            id?: string
            baz?: Json
            game_id?: string
            updated_at?: string | null
            user_id?: string | null
          }
          Relationships: []
        }
      }
      Views: {}
      Functions: {}
      Enums: {}
      CompositeTypes: {
        [_ in never]: never
      }
    }
  }

  type Custom = {
    version: number
    events: Array<{
      type: string
      [x: string]: any
    }>
  }

  type DatabaseOverride = MergeDeep<
    Database,
    {
      public: {
        Tables: {
          foo: {
            Row: {
              bar: Custom
              baz: Custom
            }
            Insert: {
              bar: Custom
              baz: Custom
            }
            Update: {
              bar?: Custom
              baz?: Custom
            }
          }
        }
      }
    }
  >

  const jsonPostgrest = new PostgrestClient<Database>('http://localhost:3000')
  const jsonPostgrestOverride = new PostgrestClient<DatabaseOverride>('http://localhost:3000')

  // Basic types with postgres jsonpath selector
  const res = await jsonPostgrest.from('foo').select('id, bar, baz').eq('bar->version', 31).single()

  const bar = {} as Json
  const baz = {} as Json
  if (res.error) {
    throw new Error(res.error.message)
  }
  const result = await jsonPostgrest
    .from('foo')
    .update({
      bar,
      baz,
    })
    .eq('bar->version', 31)
  expectType<null>(result.data)

  // Extended types with postgres jsonpath selector
  const resExtended = await jsonPostgrestOverride
    .from('foo')
    .select('id, bar, baz')
    .eq('bar->version', 31)
    .single()

  const barCustom = {} as Custom
  const bazCustom = {} as Custom
  if (resExtended.error) {
    throw new Error(resExtended.error.message)
  }
  const resultExtended = await jsonPostgrestOverride
    .from('foo')
    .update({
      bar: barCustom,
      baz: bazCustom,
    })
    .eq('bar->version', resExtended.data.bar.version)
  expectType<null>(resultExtended.data)
}
