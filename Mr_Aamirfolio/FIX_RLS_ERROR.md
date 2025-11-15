# Fix RLS Policy Error

## Problem
You're getting this error when trying to save reviews/projects:
```
Error saving review: new row violates row-level security policy for table "reviews"
Status: 401 Unauthorized
```

## Cause
The hardcoded admin login doesn't authenticate with Supabase, so RLS policies block database writes.

## Solution Options

### Option 1: Auto-Create Supabase User (Recommended)

The code now automatically creates a Supabase user when you login with hardcoded credentials. 

**First Time Setup:**
1. Login with hardcoded credentials (`admin@aamirfolio.com` / `Admin@2024`)
2. The system will automatically create a Supabase user with the same credentials
3. Future logins will authenticate with Supabase
4. RLS policies will work correctly

**If auto-creation fails, manually create user:**

1. Go to Supabase Dashboard: https://ruafgiyldwlctfldhtoe.supabase.co
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"** → **"Create new user"**
4. Enter:
   - **Email**: `admin@aamirfolio.com`
   - **Password**: `Admin@2024`
5. Uncheck **"Auto Confirm User"** (or leave checked if you want immediate access)
6. Click **"Create User"**
7. Login again - it should work now

### Option 2: Update RLS Policies (Less Secure)

If you want to allow public writes (not recommended for production):

Run this SQL in Supabase SQL Editor:

```sql
-- Allow public inserts (for hardcoded admin)
DROP POLICY IF EXISTS "Allow authenticated insert" ON projects;
DROP POLICY IF EXISTS "Allow authenticated insert" ON reviews;

CREATE POLICY "Allow public insert" ON projects
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert" ON reviews
  FOR INSERT
  WITH CHECK (true);

-- Allow public updates
DROP POLICY IF EXISTS "Allow authenticated update" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update" ON reviews;

CREATE POLICY "Allow public update" ON projects
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow public update" ON reviews
  FOR UPDATE
  USING (true);

-- Allow public deletes
DROP POLICY IF EXISTS "Allow authenticated delete" ON projects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON reviews;

CREATE POLICY "Allow public delete" ON projects
  FOR DELETE
  USING (true);

CREATE POLICY "Allow public delete" ON reviews
  FOR DELETE
  USING (true);
```

⚠️ **Warning:** This allows anyone with your Supabase URL to modify data. Only use for development.

### Option 3: Use Service Role Key (Not Recommended)

This is insecure for client-side code. Don't use this approach.

## Recommended Solution

**Use Option 1** - Create the Supabase user manually:

1. Create user in Supabase Dashboard with same credentials as hardcoded admin
2. Login with those credentials
3. System will authenticate with Supabase
4. RLS policies will work correctly

## Verification

After fixing, test:
1. Login to admin portal
2. Try to add a new project - should work
3. Try to add a new review - should work
4. Check browser console - no RLS errors

## Quick Fix Script

Run this in Supabase SQL Editor to create the user automatically (if you have access):

```sql
-- Note: This requires service role access, which you may not have
-- Better to create user via Dashboard
```

**Best approach:** Create user via Supabase Dashboard (Option 1).

