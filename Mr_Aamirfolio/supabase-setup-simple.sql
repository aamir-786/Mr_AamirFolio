-- ============================================
-- SIMPLE SUPABASE SETUP (All-in-One)
-- Copy and paste this entire script into Supabase SQL Editor
-- ============================================

-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT NOT NULL,
  url TEXT DEFAULT 'https://github.com/aamir-786',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  image TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read policies
DROP POLICY IF EXISTS "Allow public read access" ON projects;
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON reviews;
CREATE POLICY "Allow public read access" ON reviews FOR SELECT USING (true);

-- Authenticated write policies
DROP POLICY IF EXISTS "Allow authenticated insert" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update" ON projects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON projects;

CREATE POLICY "Allow authenticated insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON projects FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated update" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated delete" ON reviews;

CREATE POLICY "Allow authenticated insert" ON reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON reviews FOR DELETE TO authenticated USING (true);

-- Insert Projects
INSERT INTO projects (title, category, date, image, url) VALUES
('Tennis League Information System', 'Software Engineering(Java)', 'August 2024', 'img/tenis.png', 'https://github.com/aamir-786'),
('Shoes Ecommerce Website', 'Web Design', 'March 2024', 'img/shoes.png', 'https://github.com/aamir-786'),
('AI Chatbot Integration in Website', 'Web Design + Python', 'June 2024', 'img/chatbot1.png', 'https://github.com/aamir-786'),
('Courier Management System', 'Web Design + PHP', 'Nov. 2023', 'img/courier.png', 'https://github.com/aamir-786'),
('Simple Chess Game', 'Java Programming', 'Sep. 2023', 'img/chess.png', 'https://github.com/aamir-786'),
('Bank Management System', 'Java Programming', 'June 2023', 'img/bank1.png', 'https://github.com/aamir-786')
ON CONFLICT DO NOTHING;

-- Insert Reviews
INSERT INTO reviews (author, image, text) VALUES
('Felixy2009, Fiverr', 'img/testimonial-2.jpg', 'Aamir was an absolute pleasure to work with in Software development. PROFESSIONALISM and attention to detail were exceptional, and his quick responsiveness and cooperation made the entire process smooth. Highly recommended; he went ABOVE and beyond! 👏'),
('Marhaja, Fiverr', 'img/testimonial-4.jpg', 'Working with Aamir on web development was a fantastic experience. His professionalism and meticulous attention to detail truly stood out. He was incredibly responsive and cooperative, making the entire process seamless. Aamir exceeded expectations at every turn. Highly recommended! 👏')
ON CONFLICT DO NOTHING;

-- Auto-update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = TIMEZONE('utc'::text, NOW()); RETURN NEW; END; $$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create Contact Messages Table (for storing contact form submissions)
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read BOOLEAN DEFAULT false
);

-- Enable RLS for contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (anyone can submit contact form)
CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to read (admin can view messages)
CREATE POLICY "Allow authenticated read" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Verify
SELECT 'Setup Complete!' as status, 
       (SELECT COUNT(*) FROM projects) as projects_count,
       (SELECT COUNT(*) FROM reviews) as reviews_count,
       (SELECT COUNT(*) FROM contact_messages) as messages_count;

