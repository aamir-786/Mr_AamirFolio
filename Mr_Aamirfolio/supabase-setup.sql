-- ============================================
-- SUPABASE SETUP SCRIPT
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Create Projects Table
-- ============================================

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

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for portfolio display)
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON projects
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- STEP 2: Create Reviews Table
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  image TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for portfolio display)
CREATE POLICY "Allow public read access" ON reviews
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON reviews
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON reviews
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- STEP 3: Insert Default Projects Data
-- ============================================

-- Insert your existing projects
INSERT INTO projects (title, category, date, image, url) VALUES
('Tennis League Information System', 'Software Engineering(Java)', 'August 2024', 'img/tenis.png', 'https://github.com/aamir-786'),
('Shoes Ecommerce Website', 'Web Design', 'March 2024', 'img/shoes.png', 'https://github.com/aamir-786'),
('AI Chatbot Integration in Website', 'Web Design + Python', 'June 2024', 'img/chatbot1.png', 'https://github.com/aamir-786'),
('Courier Management System', 'Web Design + PHP', 'Nov. 2023', 'img/courier.png', 'https://github.com/aamir-786'),
('Simple Chess Game', 'Java Programming', 'Sep. 2023', 'img/chess.png', 'https://github.com/aamir-786'),
('Bank Management System', 'Java Programming', 'June 2023', 'img/bank1.png', 'https://github.com/aamir-786')
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 4: Insert Default Reviews Data
-- ============================================

-- Insert your existing reviews
INSERT INTO reviews (author, image, text) VALUES
('Felixy2009, Fiverr', 'img/testimonial-2.jpg', 'Aamir was an absolute pleasure to work with in Software development. PROFESSIONALISM and attention to detail were exceptional, and his quick responsiveness and cooperation made the entire process smooth. Highly recommended; he went ABOVE and beyond! 👏'),
('Marhaja, Fiverr', 'img/testimonial-4.jpg', 'Working with Aamir on web development was a fantastic experience. His professionalism and meticulous attention to detail truly stood out. He was incredibly responsive and cooperative, making the entire process seamless. Aamir exceeded expectations at every turn. Highly recommended! 👏')
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 5: Create Function to Update updated_at Timestamp
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for projects table
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for reviews table
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'reviews');

-- Verify projects data
SELECT COUNT(*) as project_count FROM projects;

-- Verify reviews data
SELECT COUNT(*) as review_count FROM reviews;

-- View all projects
SELECT id, title, category, date FROM projects ORDER BY created_at DESC;

-- View all reviews
SELECT id, author FROM reviews ORDER BY created_at DESC;

-- ============================================
-- STEP 6: Create Contact Messages Table
-- ============================================

-- Create contact_messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (anyone can submit contact form)
CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read (admin can view messages)
CREATE POLICY "Allow authenticated read" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- COMPLETE!
-- ============================================
-- Your database is now set up with:
-- ✅ Projects table with RLS policies
-- ✅ Reviews table with RLS policies
-- ✅ Default projects data inserted
-- ✅ Default reviews data inserted
-- ✅ Auto-update triggers for updated_at
-- 
-- Next steps:
-- 1. Create admin user via Supabase Dashboard → Authentication → Users
-- 2. Or use the setup wizard at setup-portfolio.html
-- 3. Test your portfolio at index.html
-- ============================================

