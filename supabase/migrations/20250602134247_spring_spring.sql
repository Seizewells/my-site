/*
  # Fix profiles table RLS policies

  1. Changes
    - Add RLS policy to allow new users to create their profile during registration
    - This policy specifically allows INSERT operations when the user ID matches the profile ID

  2. Security
    - Policy ensures users can only create their own profile
    - Maintains existing RLS policies for other operations
*/

-- Allow new users to create their profile during registration
CREATE POLICY "Users can create their own profile during registration"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (auth.uid() = id);