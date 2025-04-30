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
 * Compresses an image file before upload
 * @param file Original image file
 * @param maxWidth Maximum width for the compressed image (preserves aspect ratio)
 * @param quality Compression quality (0-1), where 1 is highest quality
 * @param outputFormat Output format ('jpeg', 'png', or 'webp')
 * @returns Promise resolving to a compressed File object
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8,
  outputFormat: 'jpeg' | 'png' | 'webp' = 'webp'
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Skip compression for already optimized images or SVGs
    if (file.type === 'image/webp' && file.size < 500 * 1024) {
      return resolve(file);
    }
    
    if (file.type === 'image/svg+xml') {
      return resolve(file);
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * ratio);
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw image to canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to the desired output format
        const mimeType = `image/${outputFormat}`;
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Could not create image blob'));
            }
            
            // Create new filename with correct extension
            const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
            const newFilename = `${nameWithoutExt}.${outputFormat}`;
            
            // Create new file object
            const newFile = new File([blob], newFilename, {
              type: mimeType,
              lastModified: Date.now(),
            });
            
            resolve(newFile);
          },
          mimeType,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
}

/**
 * Estimates file size reduction from compression
 * @param originalSize Original file size in bytes
 * @param quality Compression quality (0-1)
 * @returns Estimated compressed size in bytes
 */
export function estimateCompressedSize(originalSize: number, quality: number = 0.8): number {
  // This is a rough estimate - actual compression depends on image content
  const compressionRatio = 0.7 + (0.3 * quality); // Varies between 0.7-1.0 based on quality
  return Math.round(originalSize * compressionRatio);
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