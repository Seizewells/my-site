/*
  # Add indexes for reviews table

  1. Changes
    - Add index on product_id for faster lookups
    - Add index on user_id for faster lookups
    - Add index on created_at for sorting
*/

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews(product_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at);