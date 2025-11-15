# Security Setup Guide

This guide will help you secure your portfolio with Supabase Authentication and proper database policies.

## Step 1: Enable Supabase Authentication

1. Go to your Supabase dashboard: https://ruafgiyldwlctfldhtoe.supabase.co
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider (it should be enabled by default)
4. Configure email settings if needed

## Step 2: Create Admin User

### Option A: Sign Up Through Admin Portal (Recommended)

1. Open `admin-login.html` in your browser
2. The system will use Supabase Auth
3. First time: You'll need to create an account (you may need to add a sign-up option)

### Option B: Create User via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter email and password
4. Uncheck "Auto Confirm User" if you want email verification
5. Click **Create User**

### Option C: Use SQL to Create User (Advanced)

```sql
-- This will create a user, but you'll need to set the password separately
-- Better to use the dashboard or sign-up flow
```

## Step 3: Update Database RLS Policies

Run these SQL commands in your Supabase SQL Editor to secure your database:

### Secure Projects Table

```sql
-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public insert" ON projects;
DROP POLICY IF EXISTS "Allow public update" ON projects;
DROP POLICY IF EXISTS "Allow public delete" ON projects;

-- Keep public read access (for portfolio display)
-- This policy should already exist, but verify it:
-- CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);

-- Create authenticated-only write policies
CREATE POLICY "Allow authenticated insert" ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON projects
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete" ON projects
  FOR DELETE
  TO authenticated
  USING (true);
```

### Secure Reviews Table

```sql
-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public insert" ON reviews;
DROP POLICY IF EXISTS "Allow public update" ON reviews;
DROP POLICY IF EXISTS "Allow public delete" ON reviews;

-- Keep public read access (for portfolio display)
-- This policy should already exist, but verify it:
-- CREATE POLICY "Allow public read access" ON reviews FOR SELECT USING (true);

-- Create authenticated-only write policies
CREATE POLICY "Allow authenticated insert" ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON reviews
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete" ON reviews
  FOR DELETE
  TO authenticated
  USING (true);
```

## Step 4: Update Supabase Service to Use Authenticated Client

The `SupabaseService` will automatically use the authenticated session when available. Make sure your admin operations use the authenticated client.

## Step 5: Environment Variables (Optional)

If you're using a build tool or server, you can use environment variables:

### For Vite/Webpack/etc:

```javascript
// In your build config, use:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### For Static Hosting:

Keep credentials in `config.js` but:
- **Never commit** `config.js` to public repositories
- Use environment-specific config files
- Consider using a backend API for sensitive operations

## Step 6: Additional Security Measures

### 1. Rate Limiting

Add rate limiting in Supabase:
- Go to **Settings** → **API**
- Configure rate limits for your project

### 2. CORS Configuration

- Go to **Settings** → **API**
- Configure allowed origins for your domain

### 3. Email Templates

- Go to **Authentication** → **Email Templates**
- Customize email templates for better security

### 4. Session Management

- Sessions are managed by Supabase Auth
- Default session duration: 1 hour (configurable)
- Refresh tokens are handled automatically

## Step 7: Test Security

1. **Test Public Read Access:**
   - Visit your portfolio - projects and reviews should load
   - Try to insert/update/delete without auth - should fail

2. **Test Authenticated Access:**
   - Login to admin portal
   - Try to add/edit/delete projects - should work
   - Logout and try again - should fail

3. **Test Session Expiry:**
   - Login to admin portal
   - Wait for session to expire (or manually sign out)
   - Try to perform admin operations - should redirect to login

## Troubleshooting

### "User not authenticated" errors

- Make sure you're logged in through the admin portal
- Check that RLS policies use `TO authenticated` not `WITH CHECK (true)`
- Verify Supabase Auth is enabled

### "Permission denied" errors

- Check RLS policies are correctly set
- Verify the user is authenticated (check session)
- Make sure policies allow the operation you're trying to perform

### Login not working

- Verify email provider is enabled in Supabase
- Check browser console for errors
- Verify Supabase URL and keys are correct in `config.js`

## Security Best Practices

1. ✅ **Use Strong Passwords**: Enforce minimum password requirements
2. ✅ **Enable Email Verification**: Verify user emails before allowing access
3. ✅ **Use HTTPS**: Always use HTTPS in production
4. ✅ **Keep Keys Secret**: Never expose service role keys in client code
5. ✅ **Regular Updates**: Keep Supabase client library updated
6. ✅ **Monitor Access**: Check Supabase logs for suspicious activity
7. ✅ **Backup Data**: Regularly backup your database
8. ✅ **Use Environment Variables**: Don't hardcode credentials

## Next Steps

After completing this setup:
1. Your portfolio will be publicly readable but only editable by authenticated admins
2. Admin portal requires Supabase authentication
3. All database operations are secured with RLS policies
4. Sessions are managed securely by Supabase

