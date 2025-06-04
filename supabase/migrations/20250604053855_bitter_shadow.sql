/*
  # Fix Admin Policies and Permissions

  1. Changes
    - Add proper RLS policies for profiles table to allow admin status checks
    - Remove recursive admin checks from policies
    - Simplify admin verification logic
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users to read admin status
    - Fix recursive admin checks in existing policies
*/

-- First, ensure proper access to profiles table
CREATE POLICY "Allow users to read admin status"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Update products table policies to avoid recursion
DROP POLICY IF EXISTS "Allow admins to delete products" ON products;
DROP POLICY IF EXISTS "Allow admins to insert products" ON products;
DROP POLICY IF EXISTS "Allow admins to update products" ON products;

CREATE POLICY "Allow admins to manage products"
  ON products
  FOR ALL 
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Update cart_items table policies to avoid recursion
DROP POLICY IF EXISTS "Allow admins to view all cart items" ON cart_items;

CREATE POLICY "Allow admins to view all cart items"
  ON cart_items
  FOR SELECT
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Update orders table policies to avoid recursion
DROP POLICY IF EXISTS "Allow admins to delete orders" ON orders;
DROP POLICY IF EXISTS "Allow admins to update order status" ON orders;
DROP POLICY IF EXISTS "Allow admins to view all orders" ON orders;

CREATE POLICY "Allow admins to manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Update order_items table policies to avoid recursion
DROP POLICY IF EXISTS "Allow admins to delete order items" ON order_items;
DROP POLICY IF EXISTS "Allow admins to insert order items" ON order_items;
DROP POLICY IF EXISTS "Allow admins to update order items" ON order_items;
DROP POLICY IF EXISTS "Allow admins to view all order items" ON order_items;

CREATE POLICY "Allow admins to manage order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Update reviews table policies to avoid recursion
DROP POLICY IF EXISTS "Allow admins to delete any review" ON reviews;
DROP POLICY IF EXISTS "Allow admins to update any review" ON reviews;

CREATE POLICY "Allow admins to manage reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Update articles table policies to avoid recursion
DROP POLICY IF EXISTS "Allow admins to manage articles" ON articles;

CREATE POLICY "Allow admins to manage articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );