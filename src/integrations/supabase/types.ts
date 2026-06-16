export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      credit_transactions: {
        Row: {
          created_at: string;
          credits: number;
          customer_id: string;
          description: string | null;
          id: string;
          stripe_payment_id: string | null;
          type: string;
        };
        Insert: {
          created_at?: string;
          credits: number;
          customer_id: string;
          description?: string | null;
          id?: string;
          stripe_payment_id?: string | null;
          type: string;
        };
        Update: {
          created_at?: string;
          credits?: number;
          customer_id?: string;
          description?: string | null;
          id?: string;
          stripe_payment_id?: string | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "credit_transactions_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customer_balances";
            referencedColumns: ["customer_id"];
          },
          {
            foreignKeyName: "credit_transactions_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string | null;
          stripe_customer_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          name?: string | null;
          stripe_customer_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string | null;
          stripe_customer_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      families: {
        Row: {
          created_at: string;
          created_by: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      family_invites: {
        Row: {
          created_at: string;
          created_by: string;
          expires_at: string;
          family_id: string;
          id: string;
          token: string;
          used_at: string | null;
          used_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          expires_at?: string;
          family_id: string;
          id?: string;
          token?: string;
          used_at?: string | null;
          used_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          expires_at?: string;
          family_id?: string;
          id?: string;
          token?: string;
          used_at?: string | null;
          used_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "family_invites_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "families";
            referencedColumns: ["id"];
          },
        ];
      };
      family_members: {
        Row: {
          family_id: string;
          joined_at: string;
          user_id: string;
        };
        Insert: {
          family_id: string;
          joined_at?: string;
          user_id: string;
        };
        Update: {
          family_id?: string;
          joined_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "families";
            referencedColumns: ["id"];
          },
        ];
      };
      family_presence: {
        Row: {
          active_member_count: number;
          family_id: string;
          health: string;
          id: string;
          status_line: string;
          support_needed_count: number;
          updated_at: string;
        };
        Insert: {
          active_member_count?: number;
          family_id: string;
          health: string;
          id?: string;
          status_line: string;
          support_needed_count?: number;
          updated_at?: string;
        };
        Update: {
          active_member_count?: number;
          family_id?: string;
          health?: string;
          id?: string;
          status_line?: string;
          support_needed_count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "family_presence_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: true;
            referencedRelation: "families";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};