export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      routes: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string | null
          source: string
          destination: string
          source_coordinates: Json | null
          destination_coordinates: Json | null
          breakpoints: Json
          total_distance: number
          total_days: number
          total_hours: number
          total_fuel: number
          daily_distance: number
          hotel_preference: string
          vehicle_type: string | null
          transport_mode: string | null
          planned_start_date: string | null
          planned_end_date: string | null
          actual_start_date: string | null
          actual_end_date: string | null
          notes: string | null
          tags: string[] | null
          is_favorite: boolean
          is_completed: boolean
          is_archived: boolean
          views: number
          shares: number
          last_viewed_at: string | null
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          description?: string | null
          source: string
          destination: string
          source_coordinates?: Json | null
          destination_coordinates?: Json | null
          breakpoints: Json
          total_distance: number
          total_days: number
          total_hours: number
          total_fuel: number
          daily_distance: number
          hotel_preference: string
          vehicle_type?: string | null
          transport_mode?: string | null
          planned_start_date?: string | null
          planned_end_date?: string | null
          actual_start_date?: string | null
          actual_end_date?: string | null
          notes?: string | null
          tags?: string[] | null
          is_favorite?: boolean
          is_completed?: boolean
          is_archived?: boolean
          views?: number
          shares?: number
          last_viewed_at?: string | null
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          description?: string | null
          source?: string
          destination?: string
          source_coordinates?: Json | null
          destination_coordinates?: Json | null
          breakpoints?: Json
          total_distance?: number
          total_days?: number
          total_hours?: number
          total_fuel?: number
          daily_distance?: number
          hotel_preference?: string
          vehicle_type?: string | null
          transport_mode?: string | null
          planned_start_date?: string | null
          planned_end_date?: string | null
          actual_start_date?: string | null
          actual_end_date?: string | null
          notes?: string | null
          tags?: string[] | null
          is_favorite?: boolean
          is_completed?: boolean
          is_archived?: boolean
          views?: number
          shares?: number
          last_viewed_at?: string | null
          version?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

