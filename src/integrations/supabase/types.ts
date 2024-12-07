export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      credit_scores: {
        Row: {
          anciennete_bonus: number | null
          created_at: string | null
          diversite_bonus: number | null
          historique_bonus: number | null
          id: number
          nouvelles_demandes_malus: number | null
          score: number
          updated_at: string | null
          user_id: string
          utilisation_bonus: number | null
        }
        Insert: {
          anciennete_bonus?: number | null
          created_at?: string | null
          diversite_bonus?: number | null
          historique_bonus?: number | null
          id?: number
          nouvelles_demandes_malus?: number | null
          score: number
          updated_at?: string | null
          user_id: string
          utilisation_bonus?: number | null
        }
        Update: {
          anciennete_bonus?: number | null
          created_at?: string | null
          diversite_bonus?: number | null
          historique_bonus?: number | null
          id?: number
          nouvelles_demandes_malus?: number | null
          score?: number
          updated_at?: string | null
          user_id?: string
          utilisation_bonus?: number | null
        }
        Relationships: []
      }
      credits: {
        Row: {
          created_at: string | null
          date_debut: string
          duree_en_mois: number
          id: number
          mensualite: number
          montant_initial: number
          nom: string
          solde_restant: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_debut: string
          duree_en_mois: number
          id?: number
          mensualite: number
          montant_initial: number
          nom: string
          solde_restant: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_debut?: string
          duree_en_mois?: number
          id?: number
          mensualite?: number
          montant_initial?: number
          nom?: string
          solde_restant?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      objectives: {
        Row: {
          created_at: string | null
          date_objectif: string
          id: number
          montant_actuel: number
          montant_cible: number
          nom: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_objectif: string
          id?: number
          montant_actuel: number
          montant_cible: number
          nom: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_objectif?: string
          id?: number
          montant_actuel?: number
          montant_cible?: number
          nom?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      "test lovable": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          categorie: string
          created_at: string | null
          credit_id: number | null
          date: string
          description: string
          id: number
          montant: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          categorie: string
          created_at?: string | null
          credit_id?: number | null
          date: string
          description: string
          id?: number
          montant: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          categorie?: string
          created_at?: string | null
          credit_id?: number | null
          date?: string
          description?: string
          id?: number
          montant?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_credit_id_fkey"
            columns: ["credit_id"]
            isOneToOne: false
            referencedRelation: "credits"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
