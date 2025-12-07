import { createClient } from '@supabase/supabase-js'

// Fallback to hardcoded values for development if env vars not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hekznsatxlhethsmnpgs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhla3puc2F0eGxoZXRoc21ucGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMjk5MjYsImV4cCI6MjA4MDcwNTkyNn0.MRezyLtPSHysHGW5Wq3UsOS6IJC56oRwXu11QVKP788'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Default club ID
export const DEFAULT_CLUB_ID = import.meta.env.VITE_DEFAULT_CLUB_ID || '776a18e4-7bea-4d22-8ba3-d4fa7c62d798'

