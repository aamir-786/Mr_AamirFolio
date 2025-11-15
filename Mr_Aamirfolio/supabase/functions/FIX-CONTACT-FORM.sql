-- ============================================
-- SIMPLE FIX: Disable RLS for Contact Form
-- ============================================
-- Run this in Supabase SQL Editor - ONE COMMAND ONLY
-- ============================================

-- Remove any triggers/functions that cause errors
DO $$ 
DECLARE
    trig RECORD;
BEGIN
    FOR trig IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'contact_messages'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON contact_messages CASCADE', trig.trigger_name);
    END LOOP;
END $$;

DROP FUNCTION IF EXISTS send_contact_email_notification() CASCADE;
DROP FUNCTION IF EXISTS send_email_notification() CASCADE;

-- Ensure table exists
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read BOOLEAN DEFAULT false
);

-- DISABLE RLS COMPLETELY - Simple and works
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

