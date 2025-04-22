/**
 * Validates file based on size and type constraints
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @param allowedTypes - Array of allowed MIME types (default: common image types)
 * @returns Object with validation result and error message if applicable
 */
export function validateFile(
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
): { valid: boolean; message?: string } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      message: `Файл слишком большой. Максимальный размер: ${maxSizeMB}MB` 
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: `Неподдерживаемый формат файла. Разрешены: ${allowedTypes.map(t => t.replace('image/', '')).join(', ')}` 
    };
  }
  
  return { valid: true };
}

/**
 * Creates a URL preview for a file
 * @param file - The file to create a preview for
 * @returns Preview URL that should be revoked when no longer needed
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a previously created file preview URL
 * @param previewUrl - The URL to revoke
 */
export function revokeFilePreview(previewUrl: string | null): void {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
}

/**
 * Gets file extension from a file name or URL
 * @param fileNameOrUrl - File name or URL
 * @returns File extension without the dot, e.g. "jpg"
 */
export function getFileExtension(fileNameOrUrl: string): string {
  return fileNameOrUrl.split('.').pop()?.toLowerCase() || '';
}

/**
 * Creates a unique filename 
 * @param originalName - Original file name
 * @param prefix - Optional prefix for the filename (e.g. userId)
 * @returns A unique filename with original extension
 */
export function createUniqueFileName(originalName: string, prefix?: string): string {
  const ext = getFileExtension(originalName);
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  
  return prefix 
    ? `${prefix}/${timestamp}-${randomString}.${ext}`
    : `${timestamp}-${randomString}.${ext}`;
}