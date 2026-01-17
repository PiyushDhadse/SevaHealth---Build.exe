# Supabase Backend Setup Guide

This guide will help you set up the complete Supabase backend for SevaHealth application.

## 🚀 Quick Setup Steps

### 1. Run the Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `supabase_schema.sql`
6. Click **Run** (or press Ctrl+Enter)
7. Wait for all queries to complete successfully ✅

### 2. Disable Email Confirmation (For Development)

For immediate login after registration:

1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Scroll down to **Email Auth** section
3. **Disable** "Enable email confirmations"
4. Click **Save**

> ⚠️ **Note**: Re-enable this in production for security.

### 3. Verify Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in:

- Supabase Dashboard → **Settings** → **API**
- `URL` → Copy to `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → Copy to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Test Registration & Login

1. Start your development server: `npm run dev`
2. Navigate to `/register`
3. Fill out the registration form
4. Submit and verify:
   - User is created in `auth.users` (Supabase Auth)
   - User profile is created in `public.users` (via trigger)
   - You can log in immediately

## 📊 Database Structure

The schema creates 5 main tables:

### 1. `users` Table

- Stores user profiles linked to Supabase Auth
- Columns: `id`, `email`, `name`, `phone`, `city`, `country`, `pincode`, `gov_id`, `user_type`, `is_active`

### 2. `patients` Table

- Stores patient records
- Columns: `id`, `patient_code`, `name`, `age`, `gender`, `phone`, `address`, etc.

### 3. `visits` Table

- Stores patient visit records
- Links to `patients` and `users` (doctor/worker)

### 4. `alerts` Table

- Stores alerts and notifications
- Supports priorities: `low`, `medium`, `high`, `critical`

### 5. `activity_log` Table

- Logs all user activities
- Used for audit trail and analytics

## 🔐 Security Features

### Row Level Security (RLS)

- All tables have RLS enabled
- Users can only see/modify their own data
- Admins have elevated permissions
- Authenticated users can view patients, visits, and alerts

### Automatic Profile Creation

- Database trigger `handle_new_user()` automatically creates a profile when user signs up via Supabase Auth
- No manual intervention needed

### Password Security

- Passwords are handled by Supabase Auth (hashed and secured)
- No passwords stored in `public.users` table

## 🔄 How Registration Works

1. User submits registration form
2. `supabase.auth.signUp()` creates user in `auth.users`
3. Database trigger `handle_new_user()` automatically creates profile in `public.users`
4. Frontend updates profile with additional fields (phone, city, etc.)
5. User can log in immediately (if email confirmation disabled)

## 🔐 How Login Works

1. User submits login form
2. `supabase.auth.signInWithPassword()` authenticates via Supabase Auth
3. Frontend verifies user profile exists in `public.users`
4. If profile missing, creates it automatically (fallback)
5. User session stored in localStorage
6. Redirect to dashboard based on `user_type`

## 🧪 Testing

### Test Registration

```bash
# Fill form with:
Name: Test User
Email: test@example.com
Password: test123456
Role: doctor
```

### Test Login

```bash
# Use the same credentials:
Email: test@example.com
Password: test123456
```

### Create Demo Users

Use the "Create Demo Users" button on the login page to quickly create test accounts.

## 🔍 Verify Setup

### Check Tables Created

1. Go to **Table Editor** in Supabase Dashboard
2. Verify these tables exist:
   - ✅ `users`
   - ✅ `patients`
   - ✅ `visits`
   - ✅ `alerts`
   - ✅ `activity_log`

### Check Triggers

1. Go to **Database** → **Triggers**
2. Verify `on_auth_user_created` trigger exists
3. Verify `handle_new_user()` function exists

### Check RLS Policies

1. Go to **Authentication** → **Policies**
2. Verify RLS is enabled on all tables
3. Verify policies are created

## 🐛 Troubleshooting

### Issue: "User profile not found" after registration

**Solution**: Check if trigger `on_auth_user_created` exists and function `handle_new_user()` is created.

### Issue: "Email not confirmed" error

**Solution**: Disable email confirmation in Authentication → Settings.

### Issue: Cannot insert into users table

**Solution**: Check RLS policies allow authenticated inserts.

### Issue: Environment variables not found

**Solution**:

1. Create `.env.local` file in project root
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart development server

## 📝 Next Steps

1. ✅ Database schema created
2. ✅ Registration flow working
3. ✅ Login flow working
4. ⏭️ Add patient management features
5. ⏭️ Add visit tracking
6. ⏭️ Add alerts system

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Setup Complete! 🎉** Your backend is now ready for development.
