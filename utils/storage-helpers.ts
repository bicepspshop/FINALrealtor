import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Checks if a Storage bucket exists in Supabase
 * @param supabase Supabase client instance
 * @param bucketName Name of the bucket to check
 * @returns boolean indicating if the bucket exists
 */
export async function checkBucketExists(supabase: SupabaseClient, bucketName: string): Promise<boolean> {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Error checking buckets:", error);
      return false;
    }

    return buckets.some(bucket => bucket.name === bucketName);
  } catch (error) {
    console.error(`Error checking if bucket ${bucketName} exists:`, error);
    return false;
  }
}

/**
 * Creates a storage bucket if it doesn't exist
 * @param supabase Supabase client instance
 * @param bucketName Name of the bucket to create
 * @param isPublic Whether the bucket should be public
 * @returns boolean indicating success or failure
 */
export async function ensureBucketExists(
  supabase: SupabaseClient, 
  bucketName: string, 
  isPublic: boolean = true
): Promise<boolean> {
  try {
    // Check if bucket already exists
    const exists = await checkBucketExists(supabase, bucketName);
    
    if (exists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // Create bucket if it doesn't exist
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
    });
    
    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Bucket ${bucketName} created successfully`);
    return true;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
}

/**
 * Handles extension validation for file uploads
 * @param filename Original filename 
 * @param acceptedExtensions Array of accepted file extensions (without the dot)
 * @returns boolean indicating if the file extension is valid
 */
export function validateFileExtension(filename: string, acceptedExtensions: string[] = ['jpg', 'jpeg', 'png', 'webp', 'gif']): boolean {
  if (!filename || !filename.includes('.')) return false;
  
  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return false;
  
  return acceptedExtensions.includes(extension);
}
