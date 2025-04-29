/**
 * Simplified image utility functions
 */

/**
 * Generates a unique filename for storage
 */
export function generateUniqueFilename(file: File, prefix?: string): string {
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  const prefixPart = prefix ? `${prefix}-` : ''
  
  return `${prefixPart}${timestamp}-${randomString}.${fileExt}`
}

/**
 * Validates that a file is an acceptable image type
 */
export function isValidImageFile(file: File): boolean {
  // Check mime type and size in one function
  const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  return validMimeTypes.includes(file.type)
}

/**
 * Extracts a filename from a Supabase storage URL
 * @param url The full Supabase URL
 * @returns The extracted filename
 */
export function getFilenameFromUrl(url: string): string | null {
  try {
    // Parse the URL to get just the path
    const path = new URL(url).pathname
    
    // Extract the filename from the path
    return path.split('/').pop() || null
  } catch (error) {
    console.error("Error extracting filename from URL:", error)
    return null
  }
}

/**
 * Formats file size in human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
} 