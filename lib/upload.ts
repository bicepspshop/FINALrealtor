import { getBrowserClient } from "./supabase";

/**
 * Uploads a file to the specified Supabase storage bucket
 * @param bucketName - The name of the storage bucket
 * @param file - The file to upload
 * @param userId - Optional user ID to create a user-specific path
 * @returns URL of the uploaded file or null if upload failed
 */
export async function uploadFile(
  bucketName: string,
  file: File,
  userId?: string
): Promise<string | null> {
  const supabase = getBrowserClient();
  
  // Check if we have an active session - this is crucial
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error("No active session found - user not authenticated");
    return null;
  }

  try {
    // Get file extension and ensure it's lowercase
    const fileExt = file.name.split(".").pop()?.toLowerCase() || 'jpg';
    
    // Create a unique filename with optional user ID prefix
    const fileName = userId 
      ? `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    console.log(`Uploading to ${bucketName}: ${fileName}, type: ${file.type}, size: ${file.size} bytes`);

    // Upload with auth headers explicitly included
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
        // Add authorization header from current session
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

    if (error) {
      console.error(`Error uploading to ${bucketName}:`, error);
    // Log detailed error information for debugging
    if (error.message) {
      console.error(`Error message: ${error.message}`);
    }
    if (error.details) {
      console.error(`Error details: ${error.details}`);
    }
    if (error.statusCode) {
      console.error(`Status code: ${error.statusCode}`);
    }
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    console.log(`${bucketName} upload successful:`, urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Unexpected error during ${bucketName} upload:`, error);
    return null;
  }
}

/**
 * Uploads an avatar image to the avatars bucket
 * @param file - The avatar image file
 * @param userId - User ID to create a user-specific path
 * @returns URL of the uploaded avatar or null if upload failed
 */
export async function uploadAvatar(
  file: File, 
  userId: string
): Promise<string | null> {
  return uploadFile("avatars", file, userId);
}

/**
 * Uploads a collection cover image to the collection-covers bucket
 * @param file - The cover image file
 * @param userId - Optional user ID to create a user-specific path
 * @returns URL of the uploaded cover image or null if upload failed
 */
export async function uploadCollectionCover(
  file: File,
  userId?: string
): Promise<string | null> {
  return uploadFile("collection-covers", file, userId);
}

/**
 * Uploads a property image to the property-images bucket
 * @param file - The property image file
 * @param propertyId - Optional property ID to create a property-specific path
 * @returns URL of the uploaded property image or null if upload failed
 */
export async function uploadPropertyImage(
  file: File,
  propertyId?: string
): Promise<string | null> {
  return uploadFile("property-images", file, propertyId);
}

/**
 * Deletes a file from Supabase storage
 * @param bucketName - The name of the storage bucket
 * @param url - The full URL of the file to delete
 * @returns true if deletion was successful, false otherwise
 */
export async function deleteFile(bucketName: string, url: string): Promise<boolean> {
  const supabase = getBrowserClient();
  
  try {
    // Extract filename from URL
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const fileName = path.split('/').pop();
    
    if (!fileName) {
      console.error("Could not extract filename from URL:", url);
      return false;
    }
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);
      
    if (error) {
      console.error(`Error deleting from ${bucketName}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting from ${bucketName}:`, error);
    return false;
  }
}