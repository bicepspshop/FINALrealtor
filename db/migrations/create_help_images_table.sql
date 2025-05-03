-- Run in Supabase SQL Editor
-- Create a new table for help page images

CREATE TABLE IF NOT EXISTS help_images (
  id SERIAL PRIMARY KEY,
  image_title VARCHAR(255) NOT NULL,
  image_description TEXT,
  image_url TEXT NOT NULL,
  section_id VARCHAR(50) NOT NULL, -- Corresponds to the help section (e.g., "create-collection", "add-property")
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add a comment explaining the table
COMMENT ON TABLE help_images IS 'Stores images and references for the Help/FAQ page';

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_help_images_section_id ON help_images(section_id);
CREATE INDEX IF NOT EXISTS idx_help_images_display_order ON help_images(display_order);

-- Sample data insertion for the first few help images
INSERT INTO help_images (image_title, image_description, image_url, section_id, display_order)
VALUES 
  ('Создание коллекции', 'Кнопка создания новой подборки на главной странице', 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/create-collection-button.jpg', 'create-collection', 1),
  ('Ввод названия подборки', 'Заполнение формы создания подборки', 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/collection-name-input.jpg', 'create-collection', 2),
  ('Просмотр коллекции', 'Интерфейс коллекции объектов недвижимости', 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/collection-view.jpg', 'view-collection', 1),
  ('Добавление объекта', 'Кнопка добавления нового объекта в коллекцию', 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/add-property-button.jpg', 'add-property', 1),
  ('Заполнение информации об объекте', 'Форма добавления информации о новом объекте', 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/property-form.jpg', 'add-property', 2);

-- Note: The image URLs above are placeholders. Actual URLs will be created after uploading images to the Supabase bucket. 