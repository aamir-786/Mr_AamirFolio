# Database Setup Guide for Supabase

This guide will help you set up the required database tables in your Supabase project.

## Prerequisites
- Access to your Supabase dashboard at https://ruafgiyldwlctfldhtoe.supabase.co
- Admin access to create tables

## Step 1: Create Projects Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create projects table
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

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT
  USING (true);

-- Create policy to allow public insert (for admin portal)
CREATE POLICY "Allow public insert" ON projects
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public update (for admin portal)
CREATE POLICY "Allow public update" ON projects
  FOR UPDATE
  USING (true);

-- Create policy to allow public delete (for admin portal)
CREATE POLICY "Allow public delete" ON projects
  FOR DELETE
  USING (true);
```

## Step 2: Create Reviews Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create reviews table
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

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON reviews
  FOR SELECT
  USING (true);

-- Create policy to allow public insert (for admin portal)
CREATE POLICY "Allow public insert" ON reviews
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public update (for admin portal)
CREATE POLICY "Allow public update" ON reviews
  FOR UPDATE
  USING (true);

-- Create policy to allow public delete (for admin portal)
CREATE POLICY "Allow public delete" ON reviews
  FOR DELETE
  USING (true);
```

## Step 3: Insert Default Data (Optional)

If you want to populate the database with your existing projects and reviews, you can run:

```sql
-- Insert default projects
INSERT INTO projects (title, category, date, image, url) VALUES
('Tennis League Information System', 'Software Engineering(Java)', 'August 2024', 'img/tenis.png', 'https://github.com/aamir-786'),
('Shoes Ecommerce Website', 'Web Design', 'March 2024', 'img/shoes.png', 'https://github.com/aamir-786'),
('AI Chatbot Integration in Website', 'Web Design + Python', 'June 2024', 'img/chatbot1.png', 'https://github.com/aamir-786'),
('Courier Management System', 'Web Design + PHP', 'Nov. 2023', 'img/courier.png', 'https://github.com/aamir-786'),
('Simple Chess Game', 'Java Programming', 'Sep. 2023', 'img/chess.png', 'https://github.com/aamir-786'),
('Bank Management System', 'Java Programming', 'June 2023', 'img/bank1.png', 'https://github.com/aamir-786')
ON CONFLICT DO NOTHING;

-- Insert default reviews
INSERT INTO reviews (author, image, text) VALUES
('Felixy2009, Fiverr', 'img/testimonial-2.jpg', 'Aamir was an absolute pleasure to work with in Software development. PROFESSIONALISM and attention to detail were exceptional, and his quick responsiveness and cooperation made the entire process smooth. Highly recommended; he went ABOVE and beyond! 👏'),
('Marhaja, Fiverr', 'img/testimonial-4.jpg', 'Working with Aamir on web development was a fantastic experience. His professionalism and meticulous attention to detail truly stood out. He was incredibly responsive and cooperative, making the entire process seamless. Aamir exceeded expectations at every turn. Highly recommended! 👏')
ON CONFLICT DO NOTHING;
```

## Step 4: Verify Setup

1. Go to your Supabase dashboard
2. Navigate to "Table Editor"
3. Verify that both `projects` and `reviews` tables exist
4. Check that the tables have the correct columns

## Security Notes

⚠️ **IMPORTANT**: After initial setup, you should secure your database with authentication. See `SECURITY_SETUP.md` for complete security setup instructions.

**Quick Security Update:**

After creating the tables, run these SQL commands to secure write operations:

```sql
-- Secure Projects Table
DROP POLICY IF EXISTS "Allow public insert" ON projects;
DROP POLICY IF EXISTS "Allow public update" ON projects;
DROP POLICY IF EXISTS "Allow public delete" ON projects;

CREATE POLICY "Allow authenticated insert" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON projects
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON projects
  FOR DELETE TO authenticated USING (true);

-- Secure Reviews Table
DROP POLICY IF EXISTS "Allow public insert" ON reviews;
DROP POLICY IF EXISTS "Allow public update" ON reviews;
DROP POLICY IF EXISTS "Allow public delete" ON reviews;

CREATE POLICY "Allow authenticated insert" ON reviews
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON reviews
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON reviews
  FOR DELETE TO authenticated USING (true);
```

**For complete security setup:**
1. See `SECURITY_SETUP.md` for detailed instructions
2. Enable Supabase Authentication
3. Create admin user account
4. Update RLS policies to require authentication
5. Keep your Supabase anon key private and never commit it to public repositories

## Troubleshooting

If you encounter permission errors:
1. Make sure RLS policies are set correctly
2. Check that the anon key has the right permissions
3. Verify that the tables exist and have the correct structure

## Next Steps

After setting up the database:
1. The portfolio will automatically load data from Supabase
2. Use the admin portal to manage projects and reviews
3. All changes will be saved to the database

