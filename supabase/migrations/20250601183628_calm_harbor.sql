/*
  # Add articles table
  
  1. New Tables
    - `articles`
      - `id` (bigint, primary key)
      - `title` (text, not null)
      - `slug` (text, unique, not null)
      - `content` (text, not null)
      - `image_url` (text)
      - `published` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `author_id` (uuid, references profiles)
  
  2. Security
    - Enable RLS on `articles` table
    - Add policies for admin users to manage articles
    - Add policy for public users to view published articles
*/

CREATE TABLE IF NOT EXISTS articles (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  image_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all articles
CREATE POLICY "Allow admins to manage articles"
  ON articles
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Allow public to view published articles
CREATE POLICY "Allow public to view published articles"
  ON articles
  FOR SELECT
  TO public
  USING (published = true);