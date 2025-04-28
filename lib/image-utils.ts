/**
 * Utility functions for handling images across the application
 */

/**
 * Generates a unique, organized filename for storage
 * @param file The original file to be uploaded
 * @param prefix An optional prefix for categorizing images
 * @param userId Optional user ID to namespace images
 * @returns A unique filename with appropriate extension
 */
export function generateUniqueFilename(file: File, prefix?: string, userId?: string): string {
  // Extract and normalize the file extension
  const fileExt = (file.name.split(".").pop() || "jpg").toLowerCase()
  
  // Validate the extension
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']
  const safeExt = validExtensions.includes(fileExt) ? fileExt : 'jpg'
  
  // Generate unique components
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  
  // Construct organized filename with optional namespacing
  const prefixPart = prefix ? `${prefix}-` : ''
  const userPart = userId ? `${userId}/` : ''
  
  return `${userPart}${prefixPart}${timestamp}-${randomString}.${safeExt}`
}

/**
 * Validates that a file is an acceptable image type
 * @param file The file to validate
 * @returns Boolean indicating if file is valid
 */
export function isValidImageFile(file: File): boolean {
  // Check mime type
  const validMimeTypes = [
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'image/gif', 
    'image/svg+xml'
  ]
  
  if (!validMimeTypes.includes(file.type)) {
    return false
  }
  
  // Check extension
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']
  
  if (!validExtensions.includes(extension)) {
    return false
  }
  
  return true
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