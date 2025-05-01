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

/**
 * Returns all available image URLs from properties for a specific category
 * @param property The property object from the database
 * @param category The image category ('floor_plan', 'interior_finish', or 'window_view')
 * @returns Array of image URLs for the category
 */
export function getPropertyImagesByCategory(
  property: any,
  category: 'floor_plan' | 'interior_finish' | 'window_view'
): string[] {
  if (!property) return [];
  
  const images: string[] = [];
  
  // Check each potential URL field and add non-empty ones to the result
  for (let i = 1; i <= 3; i++) {
    const fieldName = `${category}_url${i}`;
    if (property[fieldName]) {
      images.push(property[fieldName]);
    }
  }
  
  return images;
}

/**
 * Formats property data for API response, combining multiple image URLs into arrays
 * @param property The property object from the database
 * @returns The formatted property with image arrays
 */
export function formatPropertyWithImageArrays(property: any): any {
  if (!property) return null;
  
  // Create a copy of the property to avoid mutating the original
  const formattedProperty = { ...property };
  
  // Add image arrays for each category
  formattedProperty.floor_plan_images = getPropertyImagesByCategory(property, 'floor_plan');
  formattedProperty.interior_finish_images = getPropertyImagesByCategory(property, 'interior_finish');
  formattedProperty.window_view_images = getPropertyImagesByCategory(property, 'window_view');
  
  return formattedProperty;
} 