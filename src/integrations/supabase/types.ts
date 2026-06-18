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
      calendar_availability_windows: {
        Row: {
          availability: string
          connection_id: string | null
          created_at: string
          ends_at: string
          external_event_hash: string | null
          family_id: string
          id: string
          share_label: string
          source_protocol: string
          starts_at: string
          updated_at: string
          user_id: string
          visibility_level: string
        }
        Insert: {
          availability?: string
          connection_id?: string | null
          created_at?: string
          ends_at: string
          external_event_hash?: string | null
          family_id: string
          id?: string
          share_label?: string
          source_protocol?: string
          starts_at: string
          updated_at?: string
          user_id: string
          visibility_level?: string
        }
        Update: {
          availability?: string
          connection_id?: string | null
          created_at?: string
          ends_at?: string
          external_event_hash?: string | null
          family_id?: string
          id?: string
          share_label?: string
          source_protocol?: string
          starts_at?: string
          updated_at?: string
          user_id?: string
          visibility_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_availability_windows_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "calendar_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_availability_windows_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_connections: {
        Row: {
          availability_granularity: string
          created_at: string
          credential_ref: string | null
          display_name: string
          family_id: string
          id: string
          include_event_titles: boolean
          last_synced_at: string | null
          protocol: string
          provider: string
          source_label: string | null
          status: string
          sync_cursor: string | null
          sync_direction: string
          updated_at: string
          user_id: string
        }
        Insert: {
          availability_granularity?: string
          created_at?: string
          credential_ref?: string | null
          display_name: string
          family_id: string
          id?: string
          include_event_titles?: boolean
          last_synced_at?: string | null
          protocol: string
          provider: string
          source_label?: string | null
          status?: string
          sync_cursor?: string | null
          sync_direction?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          availability_granularity?: string
          created_at?: string
          credential_ref?: string | null
          display_name?: string
          family_id?: string
          id?: string
          include_event_titles?: boolean
          last_synced_at?: string | null
          protocol?: string
          provider?: string
          source_label?: string | null
          status?: string
          sync_cursor?: string | null
          sync_direction?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_connections_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_sync_logs: {
        Row: {
          connection_id: string | null
          created_at: string
          family_id: string
          id: string
          message: string | null
          status: string
          user_id: string
          windows_imported: number
        }
        Insert: {
          connection_id?: string | null
          created_at?: string
          family_id: string
          id?: string
          message?: string | null
          status: string
          user_id: string
          windows_imported?: number
        }
        Update: {
          connection_id?: string | null
          created_at?: string
          family_id?: string
          id?: string
          message?: string | null
          status?: string
          user_id?: string
          windows_imported?: number
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sync_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "calendar_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_sync_logs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
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
          hub_type: string
          hub_visibility: string
          id: string
          latitude: number | null
          location_accuracy_meters: number | null
          location_captured_at: string | null
          location_label: string | null
          longitude: number | null
          name: string
          public_join_mode: string
          public_password_hash: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          hub_type?: string
          hub_visibility?: string
          id?: string
          latitude?: number | null
          location_accuracy_meters?: number | null
          location_captured_at?: string | null
          location_label?: string | null
          longitude?: number | null
          name: string
          public_join_mode?: string
          public_password_hash?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          hub_type?: string
          hub_visibility?: string
          id?: string
          latitude?: number | null
          location_accuracy_meters?: number | null
          location_captured_at?: string | null
          location_label?: string | null
          longitude?: number | null
          name?: string
          public_join_mode?: string
          public_password_hash?: string | null
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
          is_hub_admin: boolean
          joined_at: string
          member_kind: string
          role_label: string
          user_id: string
          visibility_state: string
        }
        Insert: {
          family_id: string
          is_hub_admin?: boolean
          joined_at?: string
          member_kind?: string
          role_label?: string
          user_id: string
          visibility_state?: string
        }
        Update: {
          family_id?: string
          is_hub_admin?: boolean
          joined_at?: string
          member_kind?: string
          role_label?: string
          user_id?: string
          visibility_state?: string
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
      hub_chat_messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          family_id: string
          id: string
          message_type: string
          metadata: Json
          sender_label: string
          sender_user_id: string | null
          visibility_level: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          family_id: string
          id?: string
          message_type?: string
          metadata?: Json
          sender_label?: string
          sender_user_id?: string | null
          visibility_level?: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          family_id?: string
          id?: string
          message_type?: string
          metadata?: Json
          sender_label?: string
          sender_user_id?: string | null
          visibility_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "hub_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_chat_messages_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          family_id: string
          id: string
          participant_key: string
          participant_label: string
          participant_role: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          family_id: string
          id?: string
          participant_key: string
          participant_label: string
          participant_role?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          family_id?: string
          id?: string
          participant_key?: string
          participant_label?: string
          participant_role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hub_conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "hub_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_conversation_participants_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_conversations: {
        Row: {
          conversation_type: string
          created_at: string
          created_by: string
          family_id: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          conversation_type?: string
          created_at?: string
          created_by: string
          family_id: string
          id?: string
          title?: string
          updated_at?: string
        }
        Update: {
          conversation_type?: string
          created_at?: string
          created_by?: string
          family_id?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_conversations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_event_participants: {
        Row: {
          created_at: string
          created_by: string
          event_id: string
          family_id: string
          id: string
          invited_user_id: string | null
          participant_key: string
          participant_label: string
          participant_role: string | null
          response_status: string
          updated_at: string
          visibility_level: string
        }
        Insert: {
          created_at?: string
          created_by: string
          event_id: string
          family_id: string
          id?: string
          invited_user_id?: string | null
          participant_key: string
          participant_label: string
          participant_role?: string | null
          response_status?: string
          updated_at?: string
          visibility_level?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          event_id?: string
          family_id?: string
          id?: string
          invited_user_id?: string | null
          participant_key?: string
          participant_label?: string
          participant_role?: string | null
          response_status?: string
          updated_at?: string
          visibility_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "hub_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_event_participants_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_events: {
        Row: {
          created_at: string
          created_by: string
          event_type: string
          family_id: string
          id: string
          starts_at: string | null
          status: string
          support_context: string | null
          title: string
          updated_at: string
          visibility_level: string
        }
        Insert: {
          created_at?: string
          created_by: string
          event_type?: string
          family_id: string
          id?: string
          starts_at?: string | null
          status?: string
          support_context?: string | null
          title: string
          updated_at?: string
          visibility_level?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          event_type?: string
          family_id?: string
          id?: string
          starts_at?: string | null
          status?: string
          support_context?: string | null
          title?: string
          updated_at?: string
          visibility_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_events_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
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
      location_hotspots: {
        Row: {
          created_at: string
          family_id: string
          hotspot_type: string
          id: string
          latitude: number
          longitude: number
          name: string
          radius_meters: number
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          created_at?: string
          family_id: string
          hotspot_type?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          radius_meters?: number
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          created_at?: string
          family_id?: string
          hotspot_type?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          radius_meters?: number
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_hotspots_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      location_presence_states: {
        Row: {
          accuracy_meters: number | null
          availability: string
          created_at: string
          distance_to_hotspot_meters: number | null
          dwell_minutes: number
          family_id: string
          inferred_state: string
          is_tracking: boolean
          last_signal_at: string | null
          nearest_hotspot_id: string | null
          nearest_hotspot_name: string | null
          nearest_hotspot_type: string | null
          speed_kmh: number | null
          status_label: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_meters?: number | null
          availability?: string
          created_at?: string
          distance_to_hotspot_meters?: number | null
          dwell_minutes?: number
          family_id: string
          inferred_state?: string
          is_tracking?: boolean
          last_signal_at?: string | null
          nearest_hotspot_id?: string | null
          nearest_hotspot_name?: string | null
          nearest_hotspot_type?: string | null
          speed_kmh?: number | null
          status_label?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_meters?: number | null
          availability?: string
          created_at?: string
          distance_to_hotspot_meters?: number | null
          dwell_minutes?: number
          family_id?: string
          inferred_state?: string
          is_tracking?: boolean
          last_signal_at?: string | null
          nearest_hotspot_id?: string | null
          nearest_hotspot_name?: string | null
          nearest_hotspot_type?: string | null
          speed_kmh?: number | null
          status_label?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_presence_states_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_presence_states_nearest_hotspot_id_fkey"
            columns: ["nearest_hotspot_id"]
            isOneToOne: false
            referencedRelation: "location_hotspots"
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
      create_family: {
        Args: {
          _description?: string
          _hub_type?: string
          _hub_visibility?: string
          _latitude?: number
          _location_accuracy_meters?: number
          _location_captured_at?: string
          _location_label?: string
          _longitude?: number
          _name: string
          _plaintext_password?: string
          _public_join_mode?: string
          _role_label?: string
        }
        Returns: string
      }
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
      join_hub_with_password: {
        Args: { _family_id: string; _plaintext_password: string }
        Returns: undefined
      }
      search_public_hubs_nearby: {
        Args: {
          _latitude: number
          _limit?: number
          _longitude: number
          _radius_km?: number
        }
        Returns: {
          description: string
          distance_km: number
          hub_type: string
          id: string
          latitude: number
          location_label: string
          longitude: number
          name: string
          password_required: boolean
          public_join_mode: string
        }[]
      }
      set_hub_password: {
        Args: { _family_id: string; _plaintext_password: string }
        Returns: undefined
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
