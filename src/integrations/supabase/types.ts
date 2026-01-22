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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      causes: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          ngo_id: string
          raised_amount: number | null
          start_date: string | null
          target_amount: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          ngo_id: string
          raised_amount?: number | null
          start_date?: string | null
          target_amount?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          ngo_id?: string
          raised_amount?: number | null
          start_date?: string | null
          target_amount?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "causes_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          cause_id: string | null
          created_at: string
          donor_email: string | null
          donor_id: string | null
          donor_name: string | null
          id: string
          is_anonymous: boolean | null
          message: string | null
          ngo_id: string
        }
        Insert: {
          amount: number
          cause_id?: string | null
          created_at?: string
          donor_email?: string | null
          donor_id?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          ngo_id: string
        }
        Update: {
          amount?: number
          cause_id?: string | null
          created_at?: string
          donor_email?: string | null
          donor_id?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          ngo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_cause_id_fkey"
            columns: ["cause_id"]
            isOneToOne: false
            referencedRelation: "causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      ngos: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          mission: string | null
          name: string
          phone: string | null
          registration_number: string | null
          status: Database["public"]["Enums"]["ngo_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          name: string
          phone?: string | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["ngo_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          name?: string
          phone?: string | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["ngo_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          created_at: string
          description: string | null
          end_datetime: string | null
          id: string
          is_active: boolean | null
          location: string | null
          ngo_id: string
          skills_required: string[] | null
          slots_available: number | null
          start_datetime: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          ngo_id: string
          skills_required?: string[] | null
          slots_available?: number | null
          start_datetime?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          ngo_id?: string
          skills_required?: string[] | null
          slots_available?: number | null
          start_datetime?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          id: string
          ngo_notes: string | null
          opportunity_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          volunteer_id: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          id?: string
          ngo_notes?: string | null
          opportunity_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          volunteer_id: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          id?: string
          ngo_notes?: string | null
          opportunity_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_ngo_owner: {
        Args: { _ngo_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "donor" | "volunteer" | "ngo_admin" | "platform_admin"
      application_status: "pending" | "accepted" | "rejected"
      ngo_status: "pending" | "approved" | "rejected"
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
    Enums: {
      app_role: ["donor", "volunteer", "ngo_admin", "platform_admin"],
      application_status: ["pending", "accepted", "rejected"],
      ngo_status: ["pending", "approved", "rejected"],
    },
  },
} as const
