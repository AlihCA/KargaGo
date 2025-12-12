-- Instructions for creating an admin user:
-- 1. First, sign up for a new account through the application
-- 2. Find your user_id by running: SELECT * FROM user_profiles;
-- 3. Replace 'YOUR_USER_ID_HERE' below with your actual user ID
-- 4. Run the UPDATE query

-- Example: Find all users
SELECT
  up.user_id,
  up.full_name,
  up.role,
  au.email,
  up.created_at
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
ORDER BY up.created_at DESC;

-- Update a specific user to admin role
-- REPLACE 'YOUR_USER_ID_HERE' with the actual UUID
UPDATE user_profiles
SET role = 'admin'
WHERE user_id = 'YOUR_USER_ID_HERE';

-- Verify the change
SELECT
  up.user_id,
  up.full_name,
  up.role,
  au.email
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE up.role = 'admin';
