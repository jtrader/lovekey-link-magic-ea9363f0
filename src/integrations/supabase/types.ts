export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      credit_transactions: {
        Row: {
          created_at: string
          credits: number
          customer_id: string
          description: string | null
          id: string
          stripe_payment_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          credits: number
          customer_id: string
          description?: string | null
          id?: string
          stripe_payment_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          credits?: number
          customer_id?: string
          description?: string | null
          id?: string
          stripe_payment_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_balances"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "credit_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          stripe_customer_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          stripe_customer_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          stripe_customer_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      device_presence_states: {
        Row: {
          auto_state: string
          created_at: string
          family_id: string
          is_idle: boolean
          last_heartbeat_at: string | null
          last_interaction_at: string | null
          manual_state: string | null
          manual_until: string | null
          updated_at: string
          user_id: string
          visibility_state: string
        }
        Insert: {
          auto_state?: string
          created_at?: string
          family_id: string
          is_idle?: boolean
          last_heartbeat_at?: string | null
          last_interaction_at?: string | null
          manual_state?: string | null
          manual_until?: string | null
          updated_at?: string
          user_id: string
          visibility_state?: string
        }
        Update: {
          auto_state?: string
          created_at?: string
          family_id?: string
          is_idle?: boolean
          last_heartbeat_at?: string | null
          last_interaction_at?: string | null
          manual_state?: string | null
          manual_until?: string | null
          updated_at?: string
          user_id?: string
          visibility_state?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_presence_states_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      family_invites: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string
          family_id: string
          id: string
          token: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string
          family_id: string
          id?: string
          token?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string
          family_id?: string
          id?: string
          token?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_invites_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          family_id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          family_id: string
          joined_at?: string
          user_id: string
        }
        Update: {
          family_id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      family_presence: {
        Row: {
          active_member_count: number
          family_id: string
          health: string
          id: string
          status_line: string
          support_needed_count: number
          updated_at: string
        }
        Insert: {
          active_member_count?: number
          family_id: string
          health: string
          id?: string
          status_line: string
          support_needed_count?: number
          updated_at?: string
        }
        Update: {
          active_member_count?: number
          family_id?: string
          health?: string
          id?: string
          status_line?: string
          support_needed_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_presence_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: true
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_moments: {
        Row: {
          actor_user_id: string | null
          burn_receipt_hash: string | null
          contact_label: string
          created_at: string
          event_summary: string
          event_type: string
          family_id: string
          follow_through_met: boolean
          id: string
          source_event_id: string | null
          token_payload: Json | null
          updated_at: string
          validated_at: string | null
          validation_delay_until: string
          validation_reason: string | null
          validation_status: string
        }
        Insert: {
          actor_user_id?: string | null
          burn_receipt_hash?: string | null
          contact_label: string
          created_at?: string
          event_summary: string
          event_type: string
          family_id: string
          follow_through_met?: boolean
          id?: string
          source_event_id?: string | null
          token_payload?: Json | null
          updated_at?: string
          validated_at?: string | null
          validation_delay_until?: string
          validation_reason?: string | null
          validation_status?: string
        }
        Update: {
          actor_user_id?: string | null
          burn_receipt_hash?: string | null
          contact_label?: string
          created_at?: string
          event_summary?: string
          event_type?: string
          family_id?: string
          follow_through_met?: boolean
          id?: string
          source_event_id?: string | null
          token_payload?: Json | null
          updated_at?: string
          validated_at?: string | null
          validation_delay_until?: string
          validation_reason?: string | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_moments_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      presence_states: {
        Row: {
          family_id: string
          id: string
          label: string
          mood_ring: string
          needs_support: boolean
          node_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          family_id: string
          id?: string
          label: string
          mood_ring: string
          needs_support?: boolean
          node_id: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          family_id?: string
          id?: string
          label?: string
          mood_ring?: string
          needs_support?: boolean
          node_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "presence_states_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          onboarded: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          onboarded?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarded?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          created_at: string
          credits_deducted: number
          customer_id: string
          fulfilled_at: string | null
          id: string
          notes: string | null
          service: string
          status: string
        }
        Insert: {
          created_at?: string
          credits_deducted: number
          customer_id: string
          fulfilled_at?: string | null
          id?: string
          notes?: string | null
          service: string
          status?: string
        }
        Update: {
          created_at?: string
          credits_deducted?: number
          customer_id?: string
          fulfilled_at?: string | null
          id?: string
          notes?: string | null
          service?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_balances"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "redemptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      rsp_consent_events: {
        Row: {
          actor_user_id: string
          consent_state: string | null
          context: string | null
          created_at: string
          event_type: string
          family_id: string
          id: string
          metadata: Json
          signal_type: string | null
        }
        Insert: {
          actor_user_id: string
          consent_state?: string | null
          context?: string | null
          created_at?: string
          event_type: string
          family_id: string
          id?: string
          metadata?: Json
          signal_type?: string | null
        }
        Update: {
          actor_user_id?: string
          consent_state?: string | null
          context?: string | null
          created_at?: string
          event_type?: string
          family_id?: string
          id?: string
          metadata?: Json
          signal_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsp_consent_events_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      rsp_validation_events: {
        Row: {
          burn_receipt_hash: string | null
          created_at: string
          event_token_payload: Json
          family_id: string
          hub_moment_id: string
          id: string
          reason: string
          source_event_id: string | null
          status_from: string | null
          status_to: string
          validated_at: string | null
        }
        Insert: {
          burn_receipt_hash?: string | null
          created_at?: string
          event_token_payload?: Json
          family_id: string
          hub_moment_id: string
          id?: string
          reason: string
          source_event_id?: string | null
          status_from?: string | null
          status_to: string
          validated_at?: string | null
        }
        Update: {
          burn_receipt_hash?: string | null
          created_at?: string
          event_token_payload?: Json
          family_id?: string
          hub_moment_id?: string
          id?: string
          reason?: string
          source_event_id?: string | null
          status_from?: string | null
          status_to?: string
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsp_validation_events_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsp_validation_events_hub_moment_id_fkey"
            columns: ["hub_moment_id"]
            isOneToOne: false
            referencedRelation: "hub_moments"
            referencedColumns: ["id"]
          },
        ]
      }
      support_requests: {
        Row: {
          category: string
          created_at: string
          family_id: string
          id: string
          message: string | null
          requester_user_id: string
          route_summary: string | null
          urgency: string
        }
        Insert: {
          category: string
          created_at?: string
          family_id: string
          id?: string
          message?: string | null
          requester_user_id: string
          route_summary?: string | null
          urgency?: string
        }
        Update: {
          category?: string
          created_at?: string
          family_id?: string
          id?: string
          message?: string | null
          requester_user_id?: string
          route_summary?: string | null
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      customer_balances: {
        Row: {
          customer_id: string | null
          email: string | null
          name: string | null
          total_credits: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_family_invite: { Args: { _token: string }; Returns: string }
      get_invite_by_token: {
        Args: { _token: string }
        Returns: {
          expires_at: string
          family_id: string
          family_name: string
          id: string
          used_at: string
        }[]
      }
      is_family_member: {
        Args: { _family_id: string; _user_id: string }
        Returns: boolean
      }
      validate_due_hub_moments: {
        Args: { _family_id: string; _limit?: number }
        Returns: {
          burn_receipt_hash: string
          hub_moment_id: string
          validation_reason: string
          validation_status: string
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
