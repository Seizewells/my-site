/*
  # Добавление полей для товаров

  1. Изменения
    - Добавление поля old_price для хранения старой цены
    - Добавление поля is_new для отметки новых товаров
    - Добавление поля is_bestseller для отметки хитов продаж
    - Добавление поля rating для рейтинга товара
    - Добавление поля specifications для характеристик товара
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'old_price'
  ) THEN
    ALTER TABLE products ADD COLUMN old_price numeric(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'is_new'
  ) THEN
    ALTER TABLE products ADD COLUMN is_new boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'is_bestseller'
  ) THEN
    ALTER TABLE products ADD COLUMN is_bestseller boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'rating'
  ) THEN
    ALTER TABLE products ADD COLUMN rating numeric(2,1) DEFAULT 0.0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'specifications'
  ) THEN
    ALTER TABLE products ADD COLUMN specifications jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;