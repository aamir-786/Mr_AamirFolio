# Quick Fix for RLS Error

## The Problem
```
Error saving review: new row violates row-level security policy
Status: 401 Unauthorized
```

## Quick Solution (2 Steps)

### Step 1: Create Supabase User

1. Go to: https://ruafgiyldwlctfldhtoe.supabase.co
2. Click **Authentication** → **Users**
3. Click **"Add User"** → **"Create new user"**
4. Enter:
   - **Email**: `admin@aamirfolio.com`
   - **Password**: `Admin@2024`
5. **Uncheck** "Auto Confirm User" (or leave checked)
6. Click **"Create User"**

### Step 2: Login Again

1. Go to `admin-login.html`
2. Login with:
   - Email: `admin@aamirfolio.com`
   - Password: `Admin@2024`
3. The system will now authenticate with Supabase
4. Try adding a review/project - should work! ✅

## Why This Works

- Hardcoded admin login now also authenticates with Supabase
- Supabase RLS policies require authenticated users
- Creating the user in Supabase allows authentication
- Once authenticated, RLS policies allow writes

## Alternative: If You Can't Create User

If you can't create a user, you can temporarily allow public writes (less secure):

Run this in Supabase SQL Editor:

```sql
-- Allow public writes (temporary - less secure)
DROP POLICY IF EXISTS "Allow authenticated insert" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated update" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated delete" ON reviews;

CREATE POLICY "Allow public insert" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON reviews FOR DELETE USING (true);

-- Same for projects
DROP POLICY IF EXISTS "Allow authenticated insert" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update" ON projects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON projects;

CREATE POLICY "Allow public insert" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON projects FOR DELETE USING (true);
```

⚠️ **Warning:** This allows anyone to modify your data. Only use for testing.

## Recommended: Use Step 1 & 2 Above

Creating the Supabase user is the proper solution and maintains security.

