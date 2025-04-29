/**
 * Simplified file upload utility for Supabase storage
 */
import { getBrowserClient } from "@/lib/supabase"
import { generateUniqueFilename, isValidImageFile } from "@/lib/image-utils"

/**
 * Uploads a file to Supabase storage with optimized settings
 */
export async function uploadFile(
  file: File,
  prefix?: string,
  bucketName: string = "property-images"
): Promise<string | null> {
  // Validate file type and size
  if (!isValidImageFile(file) || file.size > 20 * 1024 * 1024) {
    console.error("Invalid file type or size:", file.type, file.size)
    return null
  }
  
  try {
    const supabase = getBrowserClient()
    if (!supabase) return null
    
    // Generate filename and upload
    const fileName = generateUniqueFilename(file, prefix)
    
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "public, max-age=31536000, immutable",
        contentType: file.type,
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