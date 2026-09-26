import { createClient } from '@supabase/supabase-js';

// Reads from environment variables or falls back to your configured Supabase project
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://scronfamnlvganqrqexd.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcm9uZmFtbmx2Z2FucXJxZXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTI3MDEsImV4cCI6MjEwNTk4ODcwMX0.zvd3q7nhL1gaoPrM6FFSwhi9FyVc8D02RlxpCgNlla4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
