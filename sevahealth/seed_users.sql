-- =====================================================
-- SevaHealth Test Users - Seed Data
-- =====================================================
-- This script creates test users for each role type
-- WARNING: Passwords are stored with simple hashing
-- For production, use proper bcrypt hashing
-- =====================================================

-- Insert Doctor user
INSERT INTO users (
    id, email, password_hash, name, phone, city, country, 
    pincode, gov_id, user_type, is_active, created_at, updated_at
) VALUES (
    gen_random_uuid(), 'doctor@test.com', 'hashed_password123',
    'Dr. Rajesh Kumar', '+91-9876543210', 'Mumbai', 'India',
    '400001', 'DOC12345', 'doctor', true, NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert ASHA Worker user
INSERT INTO users (
    id, email, password_hash, name, phone, city, country,
    pincode, gov_id, user_type, is_active, created_at, updated_at
) VALUES (
    gen_random_uuid(), 'asha@test.com', 'hashed_password123',
    'Anita Devi', '+91-9876543211', 'Delhi', 'India',
    '110001', 'ASHA12345', 'asha_worker', true, NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert Supervisor user
INSERT INTO users (
    id, email, password_hash, name, phone, city, country,
    pincode, gov_id, user_type, is_active, created_at, updated_at
) VALUES (
    gen_random_uuid(), 'supervisor@test.com', 'hashed_password123',
    'Priya Sharma', '+91-9876543212', 'Bangalore', 'India',
    '560001', 'SUP12345', 'supervisor', true, NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify users
SELECT email, name, user_type FROM users WHERE email LIKE '%@test.com';
