// Supabase Configuration
// This file loads Supabase credentials from config.js
(function() {
  'use strict';

  // Get configuration from window.CONFIG or use defaults
  const SUPABASE_CONFIG = {
    url: (window.CONFIG && window.CONFIG.SUPABASE_URL) || 'https://ruafgiyldwlctfldhtoe.supabase.co',
    anonKey: (window.CONFIG && window.CONFIG.SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YWZnaXlsZHdsY3RmbGRodG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODk2MjMsImV4cCI6MjA3ODc2NTYyM30.w8DciDV8BwkJDtwPBP2qgn9E6Kr6s4iich5gfAQx6XM'
  };

  // Initialize Supabase client
  let supabaseClient = null;

  // Check if Supabase library is loaded
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  } else {
    console.warn('Supabase library not loaded. Make sure to include the Supabase script.');
  }

  // Export configuration
  window.SupabaseConfig = {
    client: supabaseClient,
    url: SUPABASE_CONFIG.url,
    anonKey: SUPABASE_CONFIG.anonKey,
    getClient: function() {
      if (!this.client && typeof supabase !== 'undefined') {
        this.client = supabase.createClient(this.url, this.anonKey);
      }
      return this.client;
    }
  };

})();

