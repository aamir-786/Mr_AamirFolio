# Quick Start Guide - Complete Setup

Follow these steps to set up your portfolio with Supabase and create your admin account.

## 🚀 Step-by-Step Setup

### Step 1: Create Database Tables

**Easiest Method:**
1. Go to your Supabase Dashboard: https://ruafgiyldwlctfldhtoe.supabase.co
2. Navigate to **SQL Editor**
3. Open `supabase-setup-simple.sql` file
4. Copy the **entire contents**
5. Paste into SQL Editor
6. Click **Run** (or Ctrl+Enter)
7. ✅ Done! Tables, data, and security are all set up

**Alternative:** See `SQL_SETUP_GUIDE.md` for detailed instructions

### Step 2: Run Setup Wizard

1. Open `setup-portfolio.html` in your browser
2. Follow the wizard steps:

   **Step 1: Verify Database Tables**
   - Click "Check Tables"
   - Should show ✓ for both tables

   **Step 2: Create Admin Account**
   - Enter your email (e.g., `your@email.com`)
   - Enter a strong password (minimum 6 characters)
   - Confirm password
   - Click "Create Admin Account"
   - ✓ Account created!

   **Step 3: Migrate Existing Data**
   - Click "Migrate Data"
   - This will save all your existing projects and reviews to Supabase
   - ✓ Data migrated!

   **Step 4: Secure Database (Optional but Recommended)**
   - Click "Show SQL Commands"
   - Copy the SQL commands
   - Go to Supabase SQL Editor
   - Paste and run the commands
   - This secures write operations to authenticated users only

### Step 3: Verify Setup

1. **Test Portfolio:**
   - Open `index.html`
   - Projects and reviews should load from Supabase

2. **Test Admin Portal:**
   - Open `admin-login.html`
   - Login with your admin email and password
   - You should be able to manage projects and reviews

## 📋 Alternative: Manual Setup

If you prefer to set up manually:

### 1. Create Admin User via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `your@email.com`
   - Password: `your-strong-password`
4. Uncheck "Auto Confirm User" if you want email verification
5. Click **Create User**

### 2. Migrate Data via Browser Console

1. Open `index.html` in browser
2. Open browser console (F12)
3. Run:

```javascript
// Wait for scripts to load, then:
DataMigrator.migrateAll().then(results => {
  console.log('Migration results:', results);
});
```

Or use the setup wizard at `setup-portfolio.html`

### 3. Secure Database

Run the SQL from `SECURITY_SETUP.md` Step 3 in Supabase SQL Editor.

## ✅ Verification Checklist

- [ ] Database tables created (projects, reviews)
- [ ] Admin user account created
- [ ] Existing data migrated to Supabase
- [ ] Portfolio loads data from Supabase
- [ ] Admin portal login works
- [ ] Can add/edit/delete projects (when logged in)
- [ ] Can add/edit/delete reviews (when logged in)
- [ ] Database secured with RLS policies (optional but recommended)

## 🆘 Troubleshooting

### "Table does not exist" error
- Run the SQL from `DATABASE_SETUP.md` to create tables

### "User already exists" error
- Account already created, proceed to login

### "Permission denied" error
- Make sure you're logged in to admin portal
- Check RLS policies are set correctly
- See `SECURITY_SETUP.md` for policy setup

### Data not showing
- Check browser console for errors
- Verify Supabase connection in `config.js`
- Make sure data was migrated (check Supabase table editor)

## 🔐 How to Login to Admin Portal

### Quick Login Steps:
1. Open `admin-login.html` in your browser
2. Enter your **email** and **password**
3. Click **Login**
4. You'll be redirected to the dashboard

### First Time Login?
- You need to create an admin account first
- Use `setup-portfolio.html` → Step 2 to create account
- Or create via Supabase Dashboard → Authentication → Users

**📖 For detailed login guide, see:** `ADMIN_LOGIN_GUIDE.md`

---

## 📚 Next Steps

After setup:
1. ✅ Your portfolio is live with Supabase backend
2. ✅ Admin portal is secured with authentication
3. ✅ All data is stored in Supabase database
4. ✅ You can manage content through admin portal

## 🔐 Security Reminder

- Keep your admin credentials secure
- Don't share your Supabase anon key publicly
- Consider enabling email verification
- Regularly backup your database

Your portfolio is now fully set up! 🎉

