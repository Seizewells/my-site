/*
  # Add Profile Creation Trigger

  1. Changes
    - Creates a function to handle new user registration
    - Creates a trigger to automatically create profiles for new users
    - Removes manual profile creation policy (no longer needed)
  
  2. Security
    - Ensures profiles are created with proper user data
    - Maintains data consistency between auth.users and profiles
*/

-- First, drop the existing policy as it's no longer needed
DROP POLICY IF EXISTS "Users can create their own profile during registration" ON public.profiles;

-- Create the function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    email,
    email_verified,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.email_confirmed_at IS NOT NULL,
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();