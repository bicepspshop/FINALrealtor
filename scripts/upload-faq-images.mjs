#!/usr/bin/env node

// Script to help upload FAQ images to Supabase from screenshots
// Usage: node scripts/upload-faq-images.mjs <screenshot-directory>

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define section mapping (for organizing screenshots)
const SECTION_MAPPING = {
  'create-collection': 'Создание коллекции',
  'add-property': 'Добавление объекта',
  'edit-property': 'Редактирование объекта',
  'share-collection': 'Отправка клиенту',
  'track-clients': 'Отслеживание активности',
  'profile-settings': 'Настройки профиля',
  'view-collection': 'Просмотр коллекции'
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Bucket name
const FAQ_IMAGES_BUCKET = 'faq-images';

// Main function
async function main() {
  try {
    // Get directory from command line argument or use default
    const screenshotDir = process.argv[2] || path.join(__dirname, '..', 'screenshots');
    
    // Check if directory exists
    if (!fs.existsSync(screenshotDir)) {
      console.error(`Directory ${screenshotDir} does not exist.`);
      process.exit(1);
    }
    
    console.log(`Looking for screenshots in: ${screenshotDir}`);
    
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets.some(bucket => bucket.name === FAQ_IMAGES_BUCKET);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${FAQ_IMAGES_BUCKET}`);
      await supabase.storage.createBucket(FAQ_IMAGES_BUCKET, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024 // 5MB
      });
    }
    
    // Find image files
    const files = fs.readdirSync(screenshotDir)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    
    if (files.length === 0) {
      console.log('No image files found in the directory.');
      process.exit(0);
    }
    
    console.log(`Found ${files.length} image files.`);
    
    // Process each file
    for (const file of files) {
      // Try to determine the section based on filename
      const section = determineSection(file);
      
      if (!section) {
        console.log(`Skipping ${file} - unable to determine section.`);
        continue;
      }
      
      const filePath = path.join(screenshotDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const fileExtension = path.extname(file).toLowerCase();
      const uploadPath = `${section}/${Date.now()}-${file}`;
      
      console.log(`Uploading ${file} to section "${section}"...`);
      
      // Upload to Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(FAQ_IMAGES_BUCKET)
        .upload(uploadPath, fileBuffer, {
          contentType: `image/${fileExtension.replace('.', '')}`,
          upsert: true
        });
        
      if (uploadError) {
        console.error(`Error uploading ${file}:`, uploadError);
        continue;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(FAQ_IMAGES_BUCKET)
        .getPublicUrl(uploadPath);
      
      const imageUrl = urlData.publicUrl;
      
      // Add record to Faq_images table
      const { data: dbData, error: dbError } = await supabase
        .from('Faq_images')
        .insert([{
          title: getTitle(file),
          description: '',
          image_url: imageUrl,
          section: section,
          order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (dbError) {
        console.error(`Error inserting database record for ${file}:`, dbError);
        continue;
      }
      
      console.log(`✅ Successfully processed ${file} (ID: ${dbData[0].id})`);
    }
    
    console.log('Done processing files.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Helper function to determine section from filename
function determineSection(filename) {
  // Convert filename to lowercase for easier matching
  const lowerFilename = filename.toLowerCase();
  
  // Try to match against known section keys
  for (const [sectionId, sectionName] of Object.entries(SECTION_MAPPING)) {
    if (
      lowerFilename.includes(sectionId) || 
      lowerFilename.includes(sectionName.toLowerCase()) ||
      // Match based on word segments
      sectionId.split('-').some(segment => lowerFilename.includes(segment))
    ) {
      return sectionId;
    }
  }
  
  // Interactive prompt would be here in a more robust script
  // For simplicity, we'll return null
  return null;
}

// Helper to generate a title from filename
function getTitle(filename) {
  // Remove extension and replace hyphens/underscores with spaces
  return path.basename(filename, path.extname(filename))
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
}

// Run the script
main(); 