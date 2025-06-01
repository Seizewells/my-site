/*
  # Add initial categories

  1. New Data
    - Adds initial product categories
  2. Changes
    - Inserts basic categories for the store
*/

INSERT INTO categories (id, name, slug, description, created_at)
VALUES 
  (1, 'Сантехника', 'santekhnika', 'Сантехника и комплектующие', now()),
  (2, 'Ванны', 'vanny', 'Ванны различных типов и размеров', now()),
  (3, 'Душевые кабины', 'dushevye-kabiny', 'Душевые кабины и ограждения', now()),
  (4, 'Смесители', 'smesiteli', 'Смесители для ванной и кухни', now()),
  (5, 'Раковины', 'rakoviny', 'Раковины и умывальники', now()),
  (6, 'Унитазы', 'unitazy', 'Унитазы и биде', now()),
  (7, 'Мебель для ванной', 'mebel-dlya-vannoy', 'Мебель и аксессуары для ванной комнаты', now()),
  (8, 'Полотенцесушители', 'polotentsesushiteli', 'Полотенцесушители водяные и электрические', now()),
  (9, 'Аксессуары', 'aksessuary', 'Аксессуары для ванной комнаты', now()),
  (10, 'Водонагреватели', 'vodonagrevateli', 'Водонагреватели и бойлеры', now()),
  (11, 'Фильтры для воды', 'filtry-dlya-vody', 'Системы фильтрации воды', now()),
  (12, 'Инструменты', 'instrumenty', 'Инструменты для монтажа и ремонта', now())
ON CONFLICT (id) DO NOTHING;