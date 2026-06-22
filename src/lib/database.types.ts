export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: '14.5';
    };
    public: {
        Tables: {
            actions: {
                Row: {
                    configuration: Json | null;
                    id: string;
                    type: string;
                };
                Insert: {
                    configuration?: Json | null;
                    id?: string;
                    type: string;
                };
                Update: {
                    configuration?: Json | null;
                    id?: string;
                    type?: string;
                };
                Relationships: [];
            };
            cards: {
                Row: {
                    about: string | null;
                    closed_at: string | null;
                    cost: number | null;
                    created_at: string | null;
                    currency: string | null;
                    customer_id: string | null;
                    deleted_at: string | null;
                    financial_state: string | null;
                    hex_color: string | null;
                    id: string;
                    position: number;
                    process_id: string | null;
                    profit: number | null;
                    stage_id: string | null;
                    state: string | null;
                    title: string;
                    updated_at: string | null;
                    value: number | null;
                };
                Insert: {
                    about?: string | null;
                    closed_at?: string | null;
                    cost?: number | null;
                    created_at?: string | null;
                    currency?: string | null;
                    customer_id?: string | null;
                    deleted_at?: string | null;
                    financial_state?: string | null;
                    hex_color?: string | null;
                    id?: string;
                    position: number;
                    process_id?: string | null;
                    profit?: number | null;
                    stage_id?: string | null;
                    state?: string | null;
                    title: string;
                    updated_at?: string | null;
                    value?: number | null;
                };
                Update: {
                    about?: string | null;
                    closed_at?: string | null;
                    cost?: number | null;
                    created_at?: string | null;
                    currency?: string | null;
                    customer_id?: string | null;
                    deleted_at?: string | null;
                    financial_state?: string | null;
                    hex_color?: string | null;
                    id?: string;
                    position?: number;
                    process_id?: string | null;
                    profit?: number | null;
                    stage_id?: string | null;
                    state?: string | null;
                    title?: string;
                    updated_at?: string | null;
                    value?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'cards_customer_id_fkey';
                        columns: ['customer_id'];
                        isOneToOne: false;
                        referencedRelation: 'customers';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'cards_process_id_fkey';
                        columns: ['process_id'];
                        isOneToOne: false;
                        referencedRelation: 'processes';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'cards_stage_id_fkey';
                        columns: ['stage_id'];
                        isOneToOne: false;
                        referencedRelation: 'stages';
                        referencedColumns: ['id'];
                    },
                ];
            };
            customer_origins: {
                Row: {
                    created_at: string | null;
                    created_by: string | null;
                    id: string;
                    name: string;
                    source: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    name: string;
                    source?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    name?: string;
                    source?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'customer_origins_created_by_fkey';
                        columns: ['created_by'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            customer_states: {
                Row: {
                    created_at: string | null;
                    created_by: string | null;
                    hex_color: string;
                    id: string;
                    name: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    created_by?: string | null;
                    hex_color: string;
                    id?: string;
                    name: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    created_by?: string | null;
                    hex_color?: string;
                    id?: string;
                    name?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'customer_states_created_by_fkey';
                        columns: ['created_by'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            customers: {
                Row: {
                    created_at: string | null;
                    custom_data: Json | null;
                    email: string;
                    hex_color: string | null;
                    id: string;
                    name: string;
                    origin_id: string | null;
                    owner_id: string | null;
                    phone: string | null;
                    state_id: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    custom_data?: Json | null;
                    email: string;
                    hex_color?: string | null;
                    id?: string;
                    name: string;
                    origin_id?: string | null;
                    owner_id?: string | null;
                    phone?: string | null;
                    state_id?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    custom_data?: Json | null;
                    email?: string;
                    hex_color?: string | null;
                    id?: string;
                    name?: string;
                    origin_id?: string | null;
                    owner_id?: string | null;
                    phone?: string | null;
                    state_id?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'customers_origin_id_fkey';
                        columns: ['origin_id'];
                        isOneToOne: false;
                        referencedRelation: 'customer_origins';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'customers_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'customers_state_id_fkey';
                        columns: ['state_id'];
                        isOneToOne: false;
                        referencedRelation: 'customer_states';
                        referencedColumns: ['id'];
                    },
                ];
            };
            processes: {
                Row: {
                    hex_color: string;
                    id: string;
                    name: string;
                };
                Insert: {
                    hex_color: string;
                    id?: string;
                    name: string;
                };
                Update: {
                    hex_color?: string;
                    id?: string;
                    name?: string;
                };
                Relationships: [];
            };
            stages: {
                Row: {
                    description: string | null;
                    entry_action_id: string | null;
                    exit_action_id: string | null;
                    id: string;
                    name: string;
                    position: number;
                    process_id: string | null;
                };
                Insert: {
                    description?: string | null;
                    entry_action_id?: string | null;
                    exit_action_id?: string | null;
                    id?: string;
                    name: string;
                    position: number;
                    process_id?: string | null;
                };
                Update: {
                    description?: string | null;
                    entry_action_id?: string | null;
                    exit_action_id?: string | null;
                    id?: string;
                    name?: string;
                    position?: number;
                    process_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'stages_entry_action_id_fkey';
                        columns: ['entry_action_id'];
                        isOneToOne: false;
                        referencedRelation: 'actions';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'stages_exit_action_id_fkey';
                        columns: ['exit_action_id'];
                        isOneToOne: false;
                        referencedRelation: 'actions';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'stages_process_id_fkey';
                        columns: ['process_id'];
                        isOneToOne: false;
                        referencedRelation: 'processes';
                        referencedColumns: ['id'];
                    },
                ];
            };
            users: {
                Row: {
                    created_at: string | null;
                    email: string;
                    id: string;
                    name: string;
                    password_hash: string;
                    permission_level: number | null;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    email: string;
                    id?: string;
                    name: string;
                    password_hash: string;
                    permission_level?: number | null;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    email?: string;
                    id?: string;
                    name?: string;
                    password_hash?: string;
                    permission_level?: number | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
    keyof Database,
    'public'
>];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
            DefaultSchema['Views'])
      ? (DefaultSchema['Tables'] &
            DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema['Enums']
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
      ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema['CompositeTypes']
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
        : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
      ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
      : never;

export const Constants = {
    public: {
        Enums: {},
    },
} as const;
