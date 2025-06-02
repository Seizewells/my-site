/*
  # Fix User Permissions and Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Recreate policies for cart items, favorites, reviews and profiles
    - Add user existence check function
  
  2. Security
    - Ensure users can only access their own data
    - Allow public read access to reviews
    - Restrict profile access to owners
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can manage their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view and update their own profile" ON profiles;

-- Cart Items Policies
CREATE POLICY "Users can manage their own cart items"
ON cart_items
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Favorites Policies
CREATE POLICY "Users can manage their own favorites"
ON favorites
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Reviews Policies
CREATE POLICY "Users can manage their own reviews"
ON reviews
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view reviews"
ON reviews
FOR SELECT
TO public
USING (true);

-- Profile Policies
CREATE POLICY "Users can view and update their own profile"
ON profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Function to check if user exists
CREATE OR REPLACE FUNCTION public.user_exists(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE id = user_id
  );
$$;