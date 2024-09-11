export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      files: {
        Row: {
          created_at: string
          id: number
          name: string
          owner_id: string
          path: string
          size: number
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          owner_id: string
          path: string
          size: number
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          owner_id?: string
          path?: string
          size?: number
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'files_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'user_share_info'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'files_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      shared_files: {
        Row: {
          created_at: string
          file_id: number
          id: number
          shared_by: string
          shared_with: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_id: number
          id?: number
          shared_by: string
          shared_with?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_id?: number
          id?: number
          shared_by?: string
          shared_with?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'shared_files_file_id_fkey'
            columns: ['file_id']
            isOneToOne: false
            referencedRelation: 'files'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shared_files_shared_by_fkey'
            columns: ['shared_by']
            isOneToOne: false
            referencedRelation: 'user_share_info'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shared_files_shared_by_fkey'
            columns: ['shared_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shared_files_shared_with_fkey'
            columns: ['shared_with']
            isOneToOne: false
            referencedRelation: 'user_share_info'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shared_files_shared_with_fkey'
            columns: ['shared_with']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      user_share_info: {
        Row: {
          avatar_url: string | null
          email: string | null
          id: string | null
          name: string | null
        }
        Insert: {
          avatar_url?: never
          email?: string | null
          id?: string | null
          name?: never
        }
        Update: {
          avatar_url?: never
          email?: string | null
          id?: string | null
          name?: never
        }
        Relationships: []
      }
    }
    Functions: {
      is_file_shared_with_user: {
        Args: {
          file_path: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never
