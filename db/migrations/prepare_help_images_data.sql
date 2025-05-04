-- Run in Supabase SQL Editor after uploading the actual images to the help-images bucket
-- This updates the URLs to point to the actual files in Supabase Storage

-- Use the following format for the URLs:
-- https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/section-id/filename.jpg

-- Create Collection 
UPDATE help_images
SET image_url = 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/create-collection/create-collection-button.jpg'
WHERE section_id = 'create-collection' AND display_order = 1;

UPDATE help_images
SET image_url = 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/create-collection/collection-name-input.jpg'
WHERE section_id = 'create-collection' AND display_order = 2;

-- Add Property
UPDATE help_images
SET image_url = 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/add-property/add-property-button.jpg'
WHERE section_id = 'add-property' AND display_order = 1;

UPDATE help_images
SET image_url = 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/add-property/property-form.jpg'
WHERE section_id = 'add-property' AND display_order = 2;

-- View Collection
UPDATE help_images
SET image_url = 'https://fwztgjqmqfqfvnqbuvxf.supabase.co/storage/v1/object/public/help-images/view-collection/collection-view.jpg'
WHERE section_id = 'view-collection' AND display_order = 1;

-- Note: The above SQL updates existing records. If you've just created the help_images table,
-- you should upload the images to Supabase Storage first, then use the provided URLs in the 
-- initial INSERT statements in the create_help_images_table.sql file. 