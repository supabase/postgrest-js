import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'
import {
  DeduplicateRelationships,
  FindMatchingFunctionByArgs,
} from '../../src/select-query-parser/utils'
import { RpcRowType } from '../../src/PostgrestClient'
// Deduplicate exact sames relationships
{
  type rels = [
    {
      foreignKeyName: 'test_fkey'
      columns: ['project_id']
      referencedRelation: 'project_subscriptions'
      referencedColumns: ['project_id']
    },
    {
      foreignKeyName: 'test_fkey'
      columns: ['project_id']
      referencedRelation: 'projects'
      referencedColumns: ['id']
    },
    {
      foreignKeyName: 'test_fkey'
      columns: ['project_id']
      referencedRelation: 'projects'
      referencedColumns: ['id']
    },
    {
      foreignKeyName: 'test_fkey'
      columns: ['project_id']
      referencedRelation: 'sls_physical_backups_monitoring'
      referencedColumns: ['project_id']
    }
  ]
  type expected = [
    {
      foreignKeyName: 'test_fkey'
      columns: ['project_id']
      referencedRelation: 'project_subscriptions'
      referencedColumns: ['project_id']
    },
    {
      foreignKeyName: 'test_fkey'
      columns: ['project_id']
      referencedRelation: 'projects'
      referencedColumns: ['id']
    },
    {
      foreignKeyName: 'test_fkey'
      columns: ['project_id']
      referencedRelation: 'sls_physical_backups_monitoring'
      referencedColumns: ['project_id']
    }
  ]

  type result = DeduplicateRelationships<rels>
  expectType<TypeEqual<result, expected>>(true)
}

// Tests we find the right function definition when the function is an union (override declarations)
{
  type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

  type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            age_range: unknown | null
            catchphrase: unknown | null
            data: Json | null
            username: string
          }
        }
      }
    }
  }
  type FnUnion =
    | {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    | {
        Args: { a: string }
        Returns: number
      }
    | {
        Args: { b: number }
        Returns: string
      }
    | {
        Args: { cid: number; search?: string }
        Returns: {
          channel_id: number
          data: Json | null
          id: number
          message: string | null
          username: string
        }[]
        SetofOptions: {
          from: '*'
          to: 'messages'
          isOneToOne: false
        }
      }
    | {
        Args: { profile_id: number }
        Returns: {
          id: number
          username: string | null
        }[]
        SetofOptions: {
          from: '*'
          to: 'user_profiles'
          isOneToOne: false
        }
      }
    | {
        Args: { user_row: Database['public']['Tables']['users']['Row'] }
        Returns: {
          channel_id: number
          data: Json | null
          id: number
          message: string | null
          username: string
        }[]
        SetofOptions: {
          from: 'users'
          to: 'messages'
          isOneToOne: false
        }
      }
  {
    // Test 1: No arguments matching
    type NoArgsMatch = FindMatchingFunctionByArgs<FnUnion, {}>
    type r = TypeEqual<
      NoArgsMatch,
      {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    >
    expectType<r>(true)
  }

  {
    // Test 2: Single string argument matching
    type StringArgMatch = FindMatchingFunctionByArgs<FnUnion, { a: 'test' }>
    type r = TypeEqual<
      StringArgMatch,
      {
        Args: { a: string }
        Returns: number
      }
    >
    expectType<r>(true)
  }

  {
    // Test 3: Single number argument matching
    type NumberArgMatch = FindMatchingFunctionByArgs<FnUnion, { b: 42 }>
    type r = TypeEqual<
      NumberArgMatch,
      {
        Args: { b: number }
        Returns: string
      }
    >
    expectType<r>(true)
  }

  {
    // Test 5: Matching with SetofFunction and complex argument (user_row)
    type ComplexArgMatch = FindMatchingFunctionByArgs<
      FnUnion,
      {
        user_row: {
          age_range: null
          catchphrase: null
          data: {}
          username: 'test-username'
        }
      }
    >
    type r = TypeEqual<
      ComplexArgMatch,
      {
        Args: {
          user_row: {
            age_range: unknown | null
            catchphrase: unknown | null
            data: Json
            username: string
          }
        }
        Returns: {
          channel_id: number
          data: Json
          id: number
          message: string | null
          username: string
        }[]
        SetofOptions: {
          from: 'users'
          to: 'messages'
          isOneToOne: false
        }
      }
    >
    expectType<r>(true)
  }

  {
    // Test 6: Invalid arguments should result in never
    type InvalidMatch = FindMatchingFunctionByArgs<FnUnion, { invalid: string }>
    type r = TypeEqual<InvalidMatch, never>
    expectType<r>(true)
  }

  {
    // Test 7: Partial arguments should work if no missing required
    type PartialMatch = FindMatchingFunctionByArgs<FnUnion, { cid: 2 }>
    expectType<
      TypeEqual<
        PartialMatch,
        {
          Args: {
            cid: number
            search?: string
          }
          Returns: {
            channel_id: number
            data: Json
            id: number
            message: string | null
            username: string
          }[]
          SetofOptions: {
            from: '*'
            to: 'messages'
            isOneToOne: false
          }
        }
      >
    >(true)
    type PartialMatchValued = FindMatchingFunctionByArgs<FnUnion, { cid: 2; search: 'somevalue' }>
    expectType<
      TypeEqual<
        PartialMatchValued,
        {
          Args: {
            cid: number
            search?: string
          }
          Returns: {
            channel_id: number
            data: Json
            id: number
            message: string | null
            username: string
          }[]
          SetofOptions: {
            from: '*'
            to: 'messages'
            isOneToOne: false
          }
        }
      >
    >(true)
    type PartialMatchMissingRequired = FindMatchingFunctionByArgs<FnUnion, { search: 'somevalue' }>
    expectType<TypeEqual<PartialMatchMissingRequired, never>>(true)
  }

  {
    // Test 8: Extra arguments should result in never
    type ExtraArgsMatch = FindMatchingFunctionByArgs<FnUnion, { a: string; extra: boolean }>
    type r = TypeEqual<ExtraArgsMatch, never>
    expectType<r>(true)
  }
}

// Test we are able to use the proper type when the function is a single declaration
{
  type FnSingle = {
    Args: Record<PropertyKey, never>
    Returns: undefined
  }
  type SingleMatch = FindMatchingFunctionByArgs<FnSingle, Record<PropertyKey, never>>
  type r = TypeEqual<
    SingleMatch,
    {
      Args: Record<PropertyKey, never>
      Returns: undefined
    }
  >
  expectType<r>(true)
}

{
  type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

  type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            age_range: unknown | null
            catchphrase: unknown | null
            data: Json | null
            username: string
          }
          Update: {}
          Insert: {}
          Relationships: []
        }
        channels: {
          Row: {
            data: Json | null
            id: number
            slug: string | null
          }
          Insert: {
            data?: Json | null
            id?: number
            slug?: string | null
          }
          Update: {
            data?: Json | null
            id?: number
            slug?: string | null
          }
          Relationships: []
        }
      }
      Functions: {
        function_with_array_param: {
          Args: { param: string[] }
          Returns: undefined
        }
        function_with_optional_param: {
          Args: { param?: string }
          Returns: string
        }
        get_active_user_messages: {
          Args: {
            active_user_row: Database['public']['Views']['active_users']['Row']
          }
          Returns: {
            channel_id: number
            data: Json | null
            id: number
            message: string | null
            username: string
          }[]
          SetofOptions: {
            from: 'active_users'
            to: 'messages'
            isOneToOne: false
          }
        }
        get_messages:
          | {
              Args: {
                channel_row: Database['public']['Tables']['channels']['Row']
              }
              Returns: {
                channel_id: number
                data: Json | null
                id: number
                message: string | null
                username: string
              }[]
              SetofOptions: {
                from: 'channels'
                to: 'messages'
                isOneToOne: false
              }
            }
          | {
              Args: { user_row: Database['public']['Tables']['users']['Row'] }
              Returns: {
                channel_id: number
                data: Json | null
                id: number
                message: string | null
                username: string
              }[]
              SetofOptions: {
                from: 'users'
                to: 'messages'
                isOneToOne: false
              }
            }
        get_messages_by_username: {
          Args: { search_username: string }
          Returns: {
            channel_id: number
            data: Json | null
            id: number
            message: string | null
            username: string
          }[]
          SetofOptions: {
            from: '*'
            to: 'messages'
            isOneToOne: false
          }
        }
        get_recent_messages_by_username: {
          Args: { search_username: string }
          Returns: {
            channel_id: number | null
            data: Json | null
            id: number | null
            message: string | null
            username: string | null
          }[]
          SetofOptions: {
            from: '*'
            to: 'recent_messages'
            isOneToOne: false
          }
        }
        get_status: {
          Args: { name_param: string }
          Returns: Database['public']['Enums']['user_status']
        }
        get_user_first_message: {
          Args: {
            active_user_row: Database['public']['Views']['active_users']['Row']
          }
          Returns: {
            channel_id: number | null
            data: Json | null
            id: number | null
            message: string | null
            username: string | null
          }
          SetofOptions: {
            from: 'active_users'
            to: 'recent_messages'
            isOneToOne: true
          }
        }
        get_user_messages: {
          Args: { user_row: Database['public']['Tables']['users']['Row'] }
          Returns: {
            channel_id: number
            data: Json | null
            id: number
            message: string | null
            username: string
          }[]
          SetofOptions: {
            from: 'users'
            to: 'messages'
            isOneToOne: false
          }
        }
        get_user_profile: {
          Args: { user_row: Database['public']['Tables']['users']['Row'] }
          Returns: {
            id: number
            username: string | null
          }
          SetofOptions: {
            from: 'users'
            to: 'user_profiles'
            isOneToOne: true
          }
        }
        get_user_profile_non_nullable: {
          Args: { user_row: Database['public']['Tables']['users']['Row'] }
          Returns: {
            id: number
            username: string | null
          }
          SetofOptions: {
            from: 'users'
            to: 'user_profiles'
            isOneToOne: true
          }
        }
        get_user_recent_messages:
          | {
              Args: {
                active_user_row: Database['public']['Views']['active_users']['Row']
              }
              Returns: {
                channel_id: number | null
                data: Json | null
                id: number | null
                message: string | null
                username: string | null
              }[]
              SetofOptions: {
                from: 'active_users'
                to: 'recent_messages'
                isOneToOne: false
              }
            }
          | {
              Args: { user_row: Database['public']['Tables']['users']['Row'] }
              Returns: {
                channel_id: number | null
                data: Json | null
                id: number | null
                message: string | null
                username: string | null
              }[]
              SetofOptions: {
                from: 'users'
                to: 'recent_messages'
                isOneToOne: false
              }
            }
        get_username_and_status: {
          Args: { name_param: string }
          Returns: {
            status: Database['public']['Enums']['user_status']
            username: string
          }[]
        }
        offline_user: {
          Args: { name_param: string }
          Returns: Database['public']['Enums']['user_status']
        }
        polymorphic_function_with_different_return: {
          Args: { '': string }
          Returns: undefined
        }
        polymorphic_function_with_no_params_or_unnamed: {
          Args: { '': boolean }
          Returns: number
        }
        polymorphic_function_with_unnamed_integer: {
          Args: { '': number }
          Returns: number
        }
        polymorphic_function_with_unnamed_json: {
          Args: { '': Json }
          Returns: number
        }
        polymorphic_function_with_unnamed_jsonb: {
          Args: { '': Json }
          Returns: number
        }
        polymorphic_function_with_unnamed_text: {
          Args: { '': string }
          Returns: number
        }
        postgrest_resolvable_with_override_function:
          | {
              Args: Record<PropertyKey, never>
              Returns: undefined
            }
          | {
              Args: { a: string }
              Returns: number
            }
          | {
              Args: { b: number }
              Returns: string
            }
          | {
              Args: { cid: number; search?: string }
              Returns: {
                channel_id: number
                data: Json | null
                id: number
                message: string | null
                username: string
              }[]
              SetofOptions: {
                from: '*'
                to: 'messages'
                isOneToOne: false
              }
            }
          | {
              Args: { profile_id: number }
              Returns: {
                id: number
                username: string | null
              }[]
              SetofOptions: {
                from: '*'
                to: 'user_profiles'
                isOneToOne: false
              }
            }
          | {
              Args: { user_row: Database['public']['Tables']['users']['Row'] }
              Returns: {
                channel_id: number
                data: Json | null
                id: number
                message: string | null
                username: string
              }[]
              SetofOptions: {
                from: 'users'
                to: 'messages'
                isOneToOne: false
              }
            }
        postgrest_unresolvable_function:
          | {
              Args: { a: unknown }
              Returns: {
                error: true
              } & 'Could not choose the best candidate function between: postgrest_unresolvable_function(a => int4), postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved'
            }
          | {
              Args: Record<PropertyKey, never>
              Returns: undefined
            }
        void_func: {
          Args: Record<PropertyKey, never>
          Returns: undefined
        }
      }
      Enums: {
        user_status: 'ONLINE' | 'OFFLINE'
      }
      CompositeTypes: {
        [_ in never]: never
      }
      Views: {
        active_users: {
          Row: {
            age_range: unknown | null
            catchphrase: unknown | null
            data: Json | null
            status: Database['public']['Enums']['user_status'] | null
            username: string | null
          }
          Insert: {
            age_range?: unknown | null
            catchphrase?: unknown | null
            data?: Json | null
            status?: Database['public']['Enums']['user_status'] | null
            username?: string | null
          }
          Update: {
            age_range?: unknown | null
            catchphrase?: unknown | null
            data?: Json | null
            status?: Database['public']['Enums']['user_status'] | null
            username?: string | null
          }
          Relationships: []
        }
        recent_messages: {
          Row: {
            channel_id: number | null
            data: Json | null
            id: number | null
            message: string | null
            username: string | null
          }
          Relationships: []
        }
      }
    }
  }
  type Schema = Database['public']
  const fnRpc = <
    FnName extends string & keyof Schema['Functions'],
    Args extends Schema['Functions'][FnName]['Args']
  >(
    _fn: FnName,
    _args: Args = {} as Args
  ): RpcRowType<Schema, FnName, Args> => true as any

  // Test 1: No arguments case
  const noArgsRes = fnRpc('postgrest_resolvable_with_override_function', {})
  expectType<TypeEqual<typeof noArgsRes, undefined>>(true)

  // Test 2: String argument 'a'
  const stringArgRes = fnRpc('postgrest_resolvable_with_override_function', { a: 'test' })
  expectType<TypeEqual<typeof stringArgRes, number>>(true)

  // Test 3: Number argument 'b'
  const numberArgRes = fnRpc('postgrest_resolvable_with_override_function', { b: 42 })
  expectType<TypeEqual<typeof numberArgRes, string>>(true)

  // Test 4: Channel search with required and optional params
  const channelSearchReqOnly = fnRpc('postgrest_resolvable_with_override_function', { cid: 123 })
  const channelSearchWithOpt = fnRpc('postgrest_resolvable_with_override_function', {
    cid: 123,
    search: 'query',
  })
  type ChannelSearchReturn = {
    channel_id: number
    data: Json | null
    id: number
    message: string | null
    username: string
  }[]
  expectType<TypeEqual<typeof channelSearchReqOnly, ChannelSearchReturn>>(true)
  expectType<TypeEqual<typeof channelSearchWithOpt, ChannelSearchReturn>>(true)

  // Test 5: Profile lookup
  const profileRes = fnRpc('postgrest_resolvable_with_override_function', { profile_id: 456 })
  type ProfileReturn = {
    id: number
    username: string | null
  }[]
  expectType<TypeEqual<typeof profileRes, ProfileReturn>>(true)

  // Test 6: Complex user_row argument
  const userRowRes = fnRpc('postgrest_resolvable_with_override_function', {
    user_row: {
      age_range: null,
      catchphrase: null,
      data: { some: 'data' },
      username: 'testuser',
    },
  })
  type UserRowReturn = {
    channel_id: number
    data: Json | null
    id: number
    message: string | null
    username: string
  }[]
  expectType<TypeEqual<typeof userRowRes, UserRowReturn>>(true)

  // Test 7: Invalid cases - these should cause type errors
  // @ts-expect-error - Invalid argument name
  fnRpc('postgrest_resolvable_with_override_function', { invalid: 'arg' })

  // @ts-expect-error - Missing required argument
  fnRpc('postgrest_resolvable_with_override_function', { search: 'query' })

  // @ts-expect-error - Wrong argument type
  fnRpc('postgrest_resolvable_with_override_function', { a: 42 })

  // Call with extra arguement should result in a never
  const extraArgsRes = fnRpc('postgrest_resolvable_with_override_function', {
    a: 'test',
    extra: true,
  })
  expectType<TypeEqual<typeof extraArgsRes, never>>(true)
}

{
  type Schema = any
  const fnRpc = <
    FnName extends string & keyof Schema['Functions'],
    Args extends Schema['Functions'][FnName]['Args']
  >(
    _fn: FnName,
    _args: Args = {} as Args
  ): RpcRowType<Schema, FnName, Args> => true as any
  const extraArgsRes = fnRpc('postgrest_resolvable_with_override_function', {
    a: 'test',
    extra: true,
  })
  expectType<TypeEqual<typeof extraArgsRes, any>>(true)
}
