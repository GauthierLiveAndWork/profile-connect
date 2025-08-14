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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      matches: {
        Row: {
          compatibility_score: number
          created_at: string
          id: string
          profile1_id: string
          profile2_id: string
          status: string
          updated_at: string
        }
        Insert: {
          compatibility_score: number
          created_at?: string
          id?: string
          profile1_id: string
          profile2_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          compatibility_score?: number
          created_at?: string
          id?: string
          profile1_id?: string
          profile2_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_profile1_id_fkey"
            columns: ["profile1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_profile2_id_fkey"
            columns: ["profile2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          match_id: string
          sender_profile_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          match_id: string
          sender_profile_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          match_id?: string
          sender_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_profile_id_fkey"
            columns: ["sender_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agreeableness: number
          big_five_responses: number[]
          bio: string | null
          collaboration_type: string
          community_badges: string[] | null
          conscientiousness: number
          core_values: string[] | null
          created_at: string
          current_projects: string | null
          current_search: string
          email: string
          emotional_stability: number
          extraversion: number
          favorite_quote: string | null
          favorite_tools: string[]
          first_name: string
          id: string
          job_role: string
          languages: Json | null
          last_name: string
          linkedin_profile: string | null
          location: string | null
          main_objectives: string[]
          offer_tags: string[] | null
          openness: number
          photo_url: string | null
          professional_references: string | null
          punchline: string | null
          search_tags: string[] | null
          sector: string
          sector_badges: string[] | null
          top_skills: string
          training_domains: string
          updated_at: string
          user_id: string | null
          value_proposition: string
          vision: string | null
          work_mode: string
          work_rhythm_details: string | null
          work_speed: string
          work_style_details: string | null
          years_experience: string
        }
        Insert: {
          agreeableness: number
          big_five_responses?: number[]
          bio?: string | null
          collaboration_type: string
          community_badges?: string[] | null
          conscientiousness: number
          core_values?: string[] | null
          created_at?: string
          current_projects?: string | null
          current_search: string
          email: string
          emotional_stability: number
          extraversion: number
          favorite_quote?: string | null
          favorite_tools?: string[]
          first_name: string
          id?: string
          job_role: string
          languages?: Json | null
          last_name: string
          linkedin_profile?: string | null
          location?: string | null
          main_objectives?: string[]
          offer_tags?: string[] | null
          openness: number
          photo_url?: string | null
          professional_references?: string | null
          punchline?: string | null
          search_tags?: string[] | null
          sector: string
          sector_badges?: string[] | null
          top_skills: string
          training_domains: string
          updated_at?: string
          user_id?: string | null
          value_proposition: string
          vision?: string | null
          work_mode: string
          work_rhythm_details?: string | null
          work_speed: string
          work_style_details?: string | null
          years_experience: string
        }
        Update: {
          agreeableness?: number
          big_five_responses?: number[]
          bio?: string | null
          collaboration_type?: string
          community_badges?: string[] | null
          conscientiousness?: number
          core_values?: string[] | null
          created_at?: string
          current_projects?: string | null
          current_search?: string
          email?: string
          emotional_stability?: number
          extraversion?: number
          favorite_quote?: string | null
          favorite_tools?: string[]
          first_name?: string
          id?: string
          job_role?: string
          languages?: Json | null
          last_name?: string
          linkedin_profile?: string | null
          location?: string | null
          main_objectives?: string[]
          offer_tags?: string[] | null
          openness?: number
          photo_url?: string | null
          professional_references?: string | null
          punchline?: string | null
          search_tags?: string[] | null
          sector?: string
          sector_badges?: string[] | null
          top_skills?: string
          training_domains?: string
          updated_at?: string
          user_id?: string | null
          value_proposition?: string
          vision?: string | null
          work_mode?: string
          work_rhythm_details?: string | null
          work_speed?: string
          work_style_details?: string | null
          years_experience?: string
        }
        Relationships: []
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
