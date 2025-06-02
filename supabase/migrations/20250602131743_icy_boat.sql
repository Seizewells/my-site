/*
  # Add user profile fields

  1. Changes
    - Add first_name and last_name columns to profiles table
    - Add email column to profiles table
    - Add email_verified column to profiles table
    - Add last_login column to profiles table
*/

ALTER TABLE profiles
ADD COLUMN first_name text,
ADD COLUMN last_name text,
ADD COLUMN email text UNIQUE,
ADD COLUMN email_verified boolean DEFAULT false,
ADD COLUMN last_login timestamptz;