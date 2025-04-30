/**
 * Simplified file upload utility for Supabase storage
 */
import { getBrowserClient } from "@/lib/supabase"
import { 
  generateUniqueFilename, 
  isValidImageFile, 
  compressImage 
} from "@/lib/image-utils"

/**
 * Uploads a file to Supabase storage with optimized settings
 */
export async function uploadFile(
  file: File,
  prefix?: string,
  bucketName: string = "property-images",
  options = { 
    compress: true, 
    maxWidth: 1200, 
    quality: 0.8 
  }
): Promise<string | null> {
  // Validate file type and size
  if (!isValidImageFile(file) || file.size > 20 * 1024 * 1024) {
    console.error("Invalid file type or size:", file.type, file.size)
    return null
  }
  
  try {
    const supabase = getBrowserClient()
    if (!supabase) return null
    
    // Compress image if option is enabled and it's a compatible format
    let fileToUpload = file;
    if (options.compress && /^image\/(jpeg|png|webp)/.test(file.type)) {
      try {
        fileToUpload = await compressImage(
          file, 
          options.maxWidth, 
          options.quality, 
          'webp'
        );
        console.log(`Image compressed: ${file.size} → ${fileToUpload.size} bytes`);
      } catch (compressionError) {
        // If compression fails, fall back to original file
        console.warn("Image compression failed, using original:", compressionError);
        fileToUpload = file;
      }
    }
    
    // Generate filename and upload
    const fileName = generateUniqueFilename(fileToUpload, prefix)
    
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileToUpload, {
        cacheControl: "public, max-age=31536000, immutable",
        contentType: fileToUpload.type,
        upsert: false
      })
    
    if (error) {
      console.error("Upload error:", error)
      return null
    }
    
    // Return public URL
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
    return data.publicUrl
  } catch (error) {
    console.error("Upload error:", error)
    return null
  }
}

// Specialized upload functions with descriptive prefixes
export const uploadFloorPlanImage = (file: File) => uploadFile(file, "floorplan")
export const uploadWindowViewImage = (file: File) => uploadFile(file, "window-view")
export const uploadInteriorFinishImage = (file: File) => uploadFile(file, "interior-finish")
export const uploadPropertyImage = (file: File) => uploadFile(file, "property") 