// This is a Node.js script to upload FAQ images to Supabase
// To run: node scripts/upload-faq-images.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Replace with your Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fwztgjqmqfqfvnqbuvxf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to your screenshots directory
const screenshotsDir = path.join(__dirname, '../screenshots');

// Define the images to upload
const images = [
  {
    path: path.join(screenshotsDir, 'create-collection-button.jpg'),
    title: 'Создание коллекции',
    description: 'Кнопка создания новой подборки на главной странице',
    section: 'create-collection',
    order: 1
  },
  {
    path: path.join(screenshotsDir, 'collection-name-input.jpg'),
    title: 'Ввод названия подборки',
    description: 'Заполнение формы создания подборки',
    section: 'create-collection',
    order: 2
  },
  {
    path: path.join(screenshotsDir, 'collection-view.jpg'),
    title: 'Просмотр коллекции',
    description: 'Интерфейс коллекции объектов недвижимости',
    section: 'view-collection',
    order: 1
  },
  {
    path: path.join(screenshotsDir, 'add-property-button.jpg'),
    title: 'Добавление объекта',
    description: 'Кнопка добавления нового объекта в коллекцию',
    section: 'add-property', 
    order: 1
  },
  {
    path: path.join(screenshotsDir, 'property-form.jpg'),
    title: 'Заполнение информации об объекте',
    description: 'Форма добавления информации о новом объекте',
    section: 'add-property',
    order: 2
  }
];

// Make sure the faq-images bucket exists
async function ensureBucketExists(bucketName) {
  try {
    // Check if bucket already exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking buckets:', error);
      return false;
    }
    
    const exists = buckets.some(bucket => bucket.name === bucketName);
    
    if (exists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // Create bucket if it doesn't exist
    const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
    });
    
    if (createError) {
      console.error(`Error creating bucket ${bucketName}:`, createError);
      return false;
    }
    
    console.log(`Bucket ${bucketName} created successfully`);
    return true;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
}

// Upload a file to a bucket
async function uploadFile(bucketName, filePath, fileName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = path.extname(filePath).toLowerCase();
    const contentType = fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 'image/png';
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading ${filePath}:`, error);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    console.log(`Uploaded ${fileName} successfully`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return null;
  }
}

// Add image record to Faq_images table
async function addFaqImage(imageData) {
  try {
    const { data, error } = await supabase
      .from('Faq_images')
      .insert([imageData])
      .select();
    
    if (error) {
      console.error('Error inserting FAQ image record:', error);
      return null;
    }
    
    console.log('Inserted FAQ image record successfully:', data[0].id);
    return data[0];
  } catch (error) {
    console.error('Error inserting FAQ image record:', error);
    return null;
  }
}

// Main function to upload all images
async function uploadAllImages() {
  // First make sure the bucket exists
  const bucketName = 'faq-images';
  const bucketExists = await ensureBucketExists(bucketName);
  
  if (!bucketExists) {
    console.error('Failed to create or confirm bucket. Exiting.');
    return;
  }
  
  // Upload each image
  for (const image of images) {
    try {
      // Create a filename with section prefix
      const fileName = `${image.section}/${path.basename(image.path)}`;
      
      // Upload the file
      const imageUrl = await uploadFile(bucketName, image.path, fileName);
      
      if (!imageUrl) {
        console.error(`Failed to upload ${image.path}. Skipping.`);
        continue;
      }
      
      // Add record to database
      const record = await addFaqImage({
        title: image.title,
        description: image.description,
        image_url: imageUrl,
        section: image.section,
        order: image.order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (!record) {
        console.error(`Failed to add database record for ${image.path}. Skipping.`);
      }
    } catch (error) {
      console.error(`Error processing ${image.path}:`, error);
    }
  }
  
  console.log('Upload process completed.');
}

// Run the script
uploadAllImages().catch(console.error); 