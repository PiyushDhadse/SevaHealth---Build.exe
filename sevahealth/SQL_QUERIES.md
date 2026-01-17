# SQL Queries for Testing and Verification

Run these queries in **Supabase SQL Editor** to check and verify your data.

## 📋 Table of Contents

1. [Check Users Table Structure](#check-users-table-structure)
2. [View All Users](#view-all-users)
3. [Find Specific User](#find-specific-user)
4. [Check User Count](#check-user-count)
5. [Verify Password Hash](#verify-password-hash)
6. [Check Recent Registrations](#check-recent-registrations)
7. [View Activity Logs](#view-activity-logs)
8. [Fix Common Issues](#fix-common-issues)

---

## 🔍 Check Users Table Structure

```sql
-- Check if users table exists and see its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
ORDER BY ordinal_position;
```

---

## 👥 View All Users

```sql
-- View all users (without password hash)
SELECT
    id,
    email,
    name,
    phone,
    city,
    country,
    user_type,
    is_active,
    created_at,
    updated_at
FROM public.users
ORDER BY created_at DESC;
```

---

## 🔎 Find Specific User

```sql
-- Find user by email (replace with actual email)
SELECT *
FROM public.users
WHERE email = 'test@example.com';
```

```sql
-- Find user by ID (replace with actual UUID)
SELECT *
FROM public.users
WHERE id = 'your-user-id-here';
```

---

## 📊 Check User Count

```sql
-- Count total users
SELECT COUNT(*) as total_users FROM public.users;

-- Count by user type
SELECT user_type, COUNT(*) as count
FROM public.users
GROUP BY user_type;

-- Count active users
SELECT COUNT(*) as active_users
FROM public.users
WHERE is_active = true;
```

---

## 🔐 Verify Password Hash

```sql
-- Check password hash format (should start with 'sha256:')
SELECT
    id,
    email,
    name,
    CASE
        WHEN password_hash LIKE 'sha256:%' THEN '✅ Correct format'
        WHEN password_hash = 'supabase_auth' THEN '⚠️ Old Supabase Auth format'
        ELSE '❌ Unknown format'
    END as hash_status,
    LEFT(password_hash, 20) as hash_preview
FROM public.users
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📅 Check Recent Registrations

```sql
-- View users created in last 24 hours
SELECT
    id,
    email,
    name,
    user_type,
    created_at,
    is_active
FROM public.users
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## 📝 View Activity Logs

```sql
-- View all activity logs
SELECT
    id,
    user_id,
    action,
    entity_type,
    created_at
FROM public.activity_log
ORDER BY created_at DESC
LIMIT 50;
```

```sql
-- View registration logs
SELECT
    id,
    user_id,
    action,
    details,
    created_at
FROM public.activity_log
WHERE action = 'USER_REGISTER'
ORDER BY created_at DESC;
```

```sql
-- View login logs
SELECT
    id,
    user_id,
    action,
    created_at
FROM public.activity_log
WHERE action = 'USER_LOGIN'
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🛠️ Fix Common Issues

### Remove email_verified column if it exists

```sql
-- Remove email_verified column (if exists)
ALTER TABLE public.users
DROP COLUMN IF EXISTS email_verified;

-- Remove verification_token column (if exists)
ALTER TABLE public.users
DROP COLUMN IF EXISTS verification_token;
```

### Check for duplicate emails

```sql
-- Find duplicate emails
SELECT email, COUNT(*) as count
FROM public.users
GROUP BY email
HAVING COUNT(*) > 1;
```

### Update user password (if needed)

```sql
-- Update password hash for a specific user
-- NOTE: You'll need to hash the password first using the hashPassword function
-- This is just to show the SQL structure
-- UPDATE public.users
-- SET password_hash = 'sha256:your_hashed_password_here'
-- WHERE email = 'user@example.com';
```

### Check RLS policies

```sql
-- Check if RLS is enabled (should be disabled for custom auth)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'users';

-- Disable RLS if needed
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

### Grant permissions

```sql
-- Grant all permissions on users table
GRANT ALL ON public.users TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

---

## 🧪 Test Insert Query

```sql
-- Test insert (replace values as needed)
-- Password hash should be generated using hashPassword function first
INSERT INTO public.users (
    email,
    password_hash,
    name,
    phone,
    city,
    country,
    pincode,
    gov_id,
    user_type,
    is_active
)
VALUES (
    'test@example.com',
    'sha256:test_hash_here',  -- Replace with actual hash
    'Test User',
    '9876543210',
    'Mumbai',
    'India',
    '400001',
    'TEST123',
    'doctor',
    true
)
RETURNING *;
```

---

## 🔧 Diagnostic Queries

### Check table permissions

```sql
-- Check table permissions
SELECT
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name = 'users';
```

### Check for errors in recent inserts

```sql
-- View recent users with all fields
SELECT
    id,
    email,
    name,
    password_hash,
    phone,
    city,
    country,
    pincode,
    gov_id,
    user_type,
    is_active,
    created_at,
    updated_at
FROM public.users
ORDER BY created_at DESC
LIMIT 5;
```

### Verify database connection

```sql
-- Simple connection test
SELECT
    current_database() as database,
    current_user as user,
    version() as postgres_version;
```

---

## 📌 Quick Verification Checklist

Run these queries in order to verify everything is working:

```sql
-- 1. Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'users'
);

-- 2. Check table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public';

-- 3. Count users
SELECT COUNT(*) FROM public.users;

-- 4. View latest user
SELECT * FROM public.users
ORDER BY created_at DESC
LIMIT 1;

-- 5. Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'users'
AND schemaname = 'public';
```

---

## 🚨 Emergency Reset

If you need to start fresh:

```sql
-- ⚠️ WARNING: This will delete ALL users! Use with caution!
-- DELETE FROM public.users;

-- To reset and keep table structure:
-- TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;
```

---

**💡 Tip**: Copy and paste these queries directly into Supabase SQL Editor to quickly verify your data!
