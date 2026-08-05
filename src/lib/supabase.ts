import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://nhsgelifaykqifcxryim.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oc2dlbGlmYXlrcWlmY3hyeWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MTk4MDksImV4cCI6MjEwMTI5NTgwOX0.vYFsodNI_qShaeW5fby3FPP-6Ro0rkKJZzbRkz4-Tvo';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
