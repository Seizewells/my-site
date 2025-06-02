/*
  # Fix RLS recursion in profiles policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Add new simplified policies for profiles table
    - Ensure proper access control while avoiding recursion

  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Users can view their own profile
      - Users can update their own profile
      - Admins can view all profiles
      - Admins can update any profile
*/

-- First, drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow admins to delete profiles" ON profiles;
DROP POLICY IF EXISTS "Allow admins to insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow admins to update any profile" ON profiles;
DROP POLICY IF EXISTS "Allow admins to view all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON profiles;
DROP POLICY IF EXISTS "profiles_select_own_records" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own_records." ON profiles;

-- Create new non-recursive policies
CREATE POLICY "Enable read access for authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Enable update for users based on id"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
)
WITH CHECK (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- Create function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  );
$$;