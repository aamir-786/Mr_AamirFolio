# SQL Setup Guide for Supabase

This guide provides SQL scripts to set up your Supabase database.

## 🚀 Quick Setup (Recommended)

### Option 1: All-in-One Script (Easiest)

1. Open your Supabase Dashboard: https://ruafgiyldwlctfldhtoe.supabase.co
2. Go to **SQL Editor**
3. Click **New Query**
4. Open `supabase-setup-simple.sql` file
5. Copy the **entire contents**
6. Paste into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. ✅ Done! Your database is set up

### Option 2: Step-by-Step Script

1. Open `supabase-setup.sql` file
2. Copy and run each section in order:
   - Step 1: Create Projects Table
   - Step 2: Create Reviews Table
   - Step 3: Insert Default Projects
   - Step 4: Insert Default Reviews
   - Step 5: Create Update Triggers

## 📋 What the Scripts Do

### ✅ Creates Tables
- `projects` table with all required fields
- `reviews` table with all required fields

### ✅ Sets Up Security (RLS)
- Public read access (anyone can view)
- Authenticated write access (only logged-in admins can modify)

### ✅ Inserts Your Data
- 6 default projects
- 2 default reviews

### ✅ Auto-Updates Timestamps
- Automatically updates `updated_at` when records are modified

## 🔍 Verification

After running the script, verify it worked:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'reviews');

-- Count projects
SELECT COUNT(*) as project_count FROM projects;

-- Count reviews
SELECT COUNT(*) as review_count FROM reviews;

-- View projects
SELECT id, title, category FROM projects;

-- View reviews
SELECT id, author FROM reviews;
```

Expected results:
- `project_count`: 6
- `review_count`: 2

## 🛠️ Troubleshooting

### Error: "relation already exists"
- Tables already exist, this is fine
- The script uses `IF NOT EXISTS` so it's safe to run again

### Error: "duplicate key value"
- Data already exists, this is fine
- The script uses `ON CONFLICT DO NOTHING` so it won't duplicate

### Error: "permission denied"
- Make sure you're using the SQL Editor (not API)
- Check you have admin access to your Supabase project

### No data inserted
- Check if data already exists
- Verify RLS policies allow inserts
- Check Supabase logs for errors

## 📝 Next Steps After SQL Setup

1. ✅ Database tables created
2. ✅ Data inserted
3. ✅ Security policies set
4. ⏭️ Create admin user (via Dashboard or setup wizard)
5. ⏭️ Test portfolio at `index.html`
6. ⏭️ Test admin portal at `admin-login.html`

## 🔐 Security Notes

The scripts set up:
- **Public Read**: Anyone can view projects/reviews (for portfolio display)
- **Authenticated Write**: Only logged-in users can add/edit/delete

This means:
- ✅ Your portfolio will display data to everyone
- ✅ Only you (when logged in) can manage content
- ✅ Database is secured with Row Level Security (RLS)

## 📚 Files

- `supabase-setup-simple.sql` - All-in-one script (recommended)
- `supabase-setup.sql` - Detailed step-by-step script
- `SQL_SETUP_GUIDE.md` - This guide

## ✨ Quick Commands

### View all projects
```sql
SELECT * FROM projects ORDER BY created_at DESC;
```

### View all reviews
```sql
SELECT * FROM reviews ORDER BY created_at DESC;
```

### Clear all data (if needed)
```sql
DELETE FROM projects;
DELETE FROM reviews;
```

### Reset and re-run setup
```sql
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
-- Then run supabase-setup-simple.sql again
```

---

**Ready to go?** Copy `supabase-setup-simple.sql` and run it in Supabase SQL Editor! 🚀

