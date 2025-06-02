/*
  # Fix RLS recursion on profiles table

  1. Changes
    - Create is_admin() function with SECURITY DEFINER
    - Drop existing admin RLS policies that cause recursion
    - Create new RLS policies using is_admin() function
    
  2. Security
    - Function runs with elevated privileges to avoid RLS recursion
    - Maintains same security rules but implements them safely
    - Preserves existing user access controls
*/

-- Create is_admin function that bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
$$;

-- Drop existing admin policies that cause recursion
DROP POLICY IF EXISTS "Allow admins to delete profiles" ON profiles;
DROP POLICY IF EXISTS "Allow admins to insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow admins to update any profile" ON profiles;
DROP POLICY IF EXISTS "Allow admins to view all profiles" ON profiles;

-- Create new admin policies using is_admin() function
CREATE POLICY "Allow admins to view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  is_admin() OR id = auth.uid()
);

CREATE POLICY "Allow admins to insert profiles"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  is_admin()
);

CREATE POLICY "Allow admins to update any profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  is_admin() OR id = auth.uid()
)
WITH CHECK (
  is_admin() OR id = auth.uid()
);

CREATE POLICY "Allow admins to delete profiles"
ON profiles
FOR DELETE
TO authenticated
USING (
  is_admin()
);