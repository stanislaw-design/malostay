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
      external_bookings: {
        Row: {
          end_date: string
          external_uid: string | null
          feed_id: string | null
          id: string
          property_id: string
          source: string
          start_date: string
          synced_at: string
        }
        Insert: {
          end_date: string
          external_uid?: string | null
          feed_id?: string | null
          id?: string
          property_id: string
          source: string
          start_date: string
          synced_at?: string
        }
        Update: {
          end_date?: string
          external_uid?: string | null
          feed_id?: string | null
          id?: string
          property_id?: string
          source?: string
          start_date?: string
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_bookings_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "ical_feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      ical_feeds: {
        Row: {
          active: boolean
          created_at: string
          id: string
          last_error: string | null
          last_synced_at: string | null
          property_id: string
          source_name: string
          sync_status: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          last_error?: string | null
          last_synced_at?: string | null
          property_id: string
          source_name: string
          sync_status?: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          last_error?: string | null
          last_synced_at?: string | null
          property_id?: string
          source_name?: string
          sync_status?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "ical_feeds_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          active: boolean
          created_at: string
          days_of_week: number[] | null
          id: string
          label_en: string
          label_pl: string
          price_per_night: number
          priority: number
          property_id: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          days_of_week?: number[] | null
          id?: string
          label_en: string
          label_pl: string
          price_per_night: number
          priority?: number
          property_id: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          days_of_week?: number[] | null
          id?: string
          label_en?: string
          label_pl?: string
          price_per_night?: number
          priority?: number
          property_id?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          active: boolean
          check_in_time: string
          check_out_time: string
          contact_email: string
          cover_image: string | null
          created_at: string
          description_en: string | null
          description_pl: string | null
          id: string
          max_guests: number
          min_nights: number
          name_en: string
          name_pl: string
          slug: string
        }
        Insert: {
          active?: boolean
          check_in_time?: string
          check_out_time?: string
          contact_email: string
          cover_image?: string | null
          created_at?: string
          description_en?: string | null
          description_pl?: string | null
          id?: string
          max_guests?: number
          min_nights?: number
          name_en: string
          name_pl: string
          slug: string
        }
        Update: {
          active?: boolean
          check_in_time?: string
          check_out_time?: string
          contact_email?: string
          cover_image?: string | null
          created_at?: string
          description_en?: string | null
          description_pl?: string | null
          id?: string
          max_guests?: number
          min_nights?: number
          name_en?: string
          name_pl?: string
          slug?: string
        }
        Relationships: []
      }
      property_settings: {
        Row: {
          deposit_percent: number | null
          property_id: string
        }
        Insert: {
          deposit_percent?: number | null
          property_id: string
        }
        Update: {
          deposit_percent?: number | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_settings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          deposit_amount: number | null
          guest_count: number
          guest_email: string
          guest_name: string
          guest_phone: string
          id: string
          language: string
          notes: string | null
          pre_arrival_email_sent_at: string | null
          property_id: string
          review_email_sent_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          total_nights: number
          total_price: number
          updated_at: string
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          deposit_amount?: number | null
          guest_count: number
          guest_email: string
          guest_name: string
          guest_phone: string
          id?: string
          language?: string
          notes?: string | null
          pre_arrival_email_sent_at?: string | null
          property_id: string
          review_email_sent_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          total_nights: number
          total_price: number
          updated_at?: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          deposit_amount?: number | null
          guest_count?: number
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          id?: string
          language?: string
          notes?: string | null
          pre_arrival_email_sent_at?: string | null
          property_id?: string
          review_email_sent_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          total_nights?: number
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
