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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          created_at: string
          processing_at: string | null
          requested_at: string
          scheduled_for: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          processing_at?: string | null
          requested_at?: string
          scheduled_for: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          processing_at?: string | null
          requested_at?: string
          scheduled_for?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          filename: string
          id: string
          mime_type: string
          purchase_id: string
          size_bytes: number
          storage_path: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filename: string
          id?: string
          mime_type: string
          purchase_id: string
          size_bytes: number
          storage_path: string
          type: string
          user_id?: string
        }
        Update: {
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string
          purchase_id?: string
          size_bytes?: number
          storage_path?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_purchase_id_user_id_fkey"
            columns: ["purchase_id", "user_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          enabled: boolean
          quiet_end: string | null
          quiet_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          enabled?: boolean
          quiet_end?: string | null
          quiet_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          enabled?: boolean
          quiet_end?: string | null
          quiet_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          last_used_at: string | null
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          last_used_at?: string | null
          p256dh: string
          user_agent?: string | null
          user_id?: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          last_used_at?: string | null
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          document_id: string | null
          id: string
          method: string
          notes: string | null
          paid_at: string | null
          purchase_id: string
          reference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          document_id?: string | null
          id?: string
          method: string
          notes?: string | null
          paid_at?: string | null
          purchase_id: string
          reference?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          document_id?: string | null
          id?: string
          method?: string
          notes?: string | null
          paid_at?: string | null
          purchase_id?: string
          reference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_document_owner_fk"
            columns: ["document_id", "user_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "payments_purchase_id_user_id_fkey"
            columns: ["purchase_id", "user_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      purchase_items: {
        Row: {
          created_at: string
          id: string
          imei: string | null
          name: string
          notes: string | null
          purchase_id: string
          quantity: number
          serial_number: string | null
          status: string
          unit_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          imei?: string | null
          name: string
          notes?: string | null
          purchase_id: string
          quantity?: number
          serial_number?: string | null
          status?: string
          unit_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          imei?: string | null
          name?: string
          notes?: string | null
          purchase_id?: string
          quantity?: number
          serial_number?: string | null
          status?: string
          unit_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_purchase_id_user_id_fkey"
            columns: ["purchase_id", "user_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      purchases: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          currency: string
          id: string
          notes: string | null
          purchase_date: string
          quantity: number
          return_end_date: string | null
          return_note: string | null
          return_source: string | null
          return_start_date: string | null
          seller_name: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          purchase_date: string
          quantity?: number
          return_end_date?: string | null
          return_note?: string | null
          return_source?: string | null
          return_start_date?: string | null
          seller_name?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          purchase_date?: string
          quantity?: number
          return_end_date?: string | null
          return_note?: string | null
          return_source?: string | null
          return_start_date?: string | null
          seller_name?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_deliveries: {
        Row: {
          claimed_at: string | null
          created_at: string
          delivered_at: string | null
          due_at: string
          failed_at: string | null
          failure_reason: string | null
          id: string
          offset_days: number
          reminder_id: string
          scheduled_for: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          due_at: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          offset_days: number
          reminder_id: string
          scheduled_for: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          due_at?: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          offset_days?: number
          reminder_id?: string
          scheduled_for?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_deliveries_reminder_owner_fkey"
            columns: ["reminder_id", "user_id"]
            isOneToOne: false
            referencedRelation: "reminders"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      reminders: {
        Row: {
          automation_key: string | null
          completed_at: string | null
          created_at: string
          due_at: string
          enabled: boolean
          id: string
          last_notified_at: string | null
          notes: string | null
          purchase_id: string
          reminder_offsets: number[]
          title: string
          type: string
          updated_at: string
          user_id: string
          warranty_id: string | null
        }
        Insert: {
          automation_key?: string | null
          completed_at?: string | null
          created_at?: string
          due_at: string
          enabled?: boolean
          id?: string
          last_notified_at?: string | null
          notes?: string | null
          purchase_id: string
          reminder_offsets?: number[]
          title: string
          type: string
          updated_at?: string
          user_id?: string
          warranty_id?: string | null
        }
        Update: {
          automation_key?: string | null
          completed_at?: string | null
          created_at?: string
          due_at?: string
          enabled?: boolean
          id?: string
          last_notified_at?: string | null
          notes?: string | null
          purchase_id?: string
          reminder_offsets?: number[]
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
          warranty_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_purchase_id_user_id_fkey"
            columns: ["purchase_id", "user_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "reminders_warranty_id_user_fkey"
            columns: ["warranty_id", "user_id"]
            isOneToOne: false
            referencedRelation: "warranties"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      warranties: {
        Row: {
          created_at: string
          end_date: string
          id: string
          item_id: string | null
          notes: string | null
          provider: string | null
          purchase_id: string
          source: string
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          item_id?: string | null
          notes?: string | null
          provider?: string | null
          purchase_id: string
          source?: string
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          item_id?: string | null
          notes?: string | null
          provider?: string | null
          purchase_id?: string
          source?: string
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warranties_item_owner_fk"
            columns: ["item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "purchase_items"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "warranties_purchase_id_user_id_fkey"
            columns: ["purchase_id", "user_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_valid_reminder_offsets: {
        Args: { offsets: number[] }
        Returns: boolean
      }
      list_orphaned_purchase_document_paths: {
        Args: { p_limit?: number | null }
        Returns: {
          storage_path: string
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
