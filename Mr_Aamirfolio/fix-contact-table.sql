-- Fix contact_messages table structure
-- Run this in Supabase SQL Editor if you get NOT NULL constraint errors

-- Ensure the table exists with correct structure
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read" ON contact_messages;

-- Allow public to insert (anyone can submit contact form)
CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to read (admin can view messages)
CREATE POLICY "Allow authenticated read" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Note: created_at has DEFAULT, so don't set it manually in inserts

