/*
  # Add user permissions

  1. Changes
    - Add policies for cart items and favorites
    - Fix profile permissions
    - Add policies for reviews
  
  2. Security
    - Enable RLS for all tables
    - Add policies for authenticated users
*/

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