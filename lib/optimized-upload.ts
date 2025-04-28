import { getBrowserClient } from "@/lib/supabase"
import { generateUniqueFilename, isValidImageFile } from "@/lib/image-utils"
import type { SupabaseClient } from "@supabase/supabase-js"

interface UploadOptions {
  bucketName: string
  prefix?: string
  userId?: string
  maxSizeMB?: number
  contentType?: string
  cacheControl?: string
  upsert?: boolean
}

/**
 * Uploads a file to Supabase storage with optimized settings
 * 
 * @param file The file to upload
 * @param options Upload configuration options
 * @returns URL of the uploaded file or null if upload failed
 */
export async function uploadFileOptimized(
  file: File,
  options: UploadOptions
): Promise<string | null> {
  const {
    bucketName,
    prefix,
    userId,
    maxSizeMB = 10,
    contentType = file.type,
    cacheControl = "public, max-age=31536000", // 1 year
    upsert = false
  } = options
  
  // Validate file type
  if (!isValidImageFile(file)) {
    console.error("Invalid file type:", file.type)
    return null
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    console.error(`File size exceeds maximum of ${maxSizeMB}MB:`, file.size)
    return null
  }
  
  try {
    const supabase = getBrowserClient()
    
    // Ensure supabase client is available
    if (!supabase) {
      console.error("Failed to initialize Supabase client")
      return null
    }
    
    // Check if we have an active session
    const { data: { session } } = await supabase.auth.getSession()
    
    // Generate a unique filename
    const fileName = generateUniqueFilename(file, prefix, userId)
    
    // Upload with proper headers and options
    const { data, error } = await uploadWithRetry(
      supabase,
      bucketName,
      fileName,
      file,
      {
        cacheControl,
        contentType,
        upsert,
        maxSizeBytes: 20971520, // Increase max size to 20MB to allow higher quality images
        ...(session && { 
          headers: { Authorization: `Bearer ${session.access_token}` } 
        })
      }
    )
    
    if (error) {
      console.error(`Error uploading to ${bucketName}:`, error)
      return null
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName)
    return urlData.publicUrl
  } catch (error) {
    console.error(`Unexpected error during ${bucketName} upload:`, error)
    return null
  }
}

/**
 * Helper function to retry uploads in case of temporary failures
 */
async function uploadWithRetry(
  client: SupabaseClient,
  bucket: string,
  path: string,
  file: File,
  options: any,
  retries = 3
): Promise<any> {
  try {
    return await client.storage.from(bucket).upload(path, file, options)
  } catch (error) {
    if (retries <= 0) throw error
    
    // Wait before retrying (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)))
    
    return uploadWithRetry(client, bucket, path, file, options, retries - 1)
  }
}

/**
 * Specialized function for uploading property images
 */
export function uploadPropertyImage(file: File, propertyId?: string): Promise<string | null> {
  return uploadFileOptimized(file, {
    bucketName: "property-images",
    prefix: propertyId ? `property-${propertyId}` : undefined,
    maxSizeMB: 10,
  })
}

/**
 * Specialized function for uploading avatar images
 */
export function uploadAvatarImage(file: File, userId: string): Promise<string | null> {
  return uploadFileOptimized(file, {
    bucketName: "avatars",
    userId,
    maxSizeMB: 5,
  })
}

/**
 * Specialized function for uploading floor plan images
 */
export function uploadFloorPlanImage(file: File, propertyId?: string): Promise<string | null> {
  return uploadFileOptimized(file, {
    bucketName: "property-images",
    prefix: `floorplan${propertyId ? `-${propertyId}` : ''}`,
    maxSizeMB: 10,
  })
}

/**
 * Specialized function for uploading window view images
 */
export function uploadWindowViewImage(file: File, propertyId?: string): Promise<string | null> {
  return uploadFileOptimized(file, {
    bucketName: "property-images",
    prefix: `window-view${propertyId ? `-${propertyId}` : ''}`,
    maxSizeMB: 10,
  })
}

/**
 * Specialized function for uploading interior finish images
 */
export function uploadInteriorFinishImage(file: File, propertyId?: string): Promise<string | null> {
  return uploadFileOptimized(file, {
    bucketName: "property-images",
    prefix: `interior-finish${propertyId ? `-${propertyId}` : ''}`,
    maxSizeMB: 10,
  })
} 