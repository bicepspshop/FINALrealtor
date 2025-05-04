import { getBrowserClient, getServerClient } from "./supabase"
import { ensureBucketExists } from "@/utils/storage-helpers"

// Bucket name for FAQ images
export const FAQ_IMAGES_BUCKET = "faq-images"

/**
 * Initialize FAQ images storage bucket
 */
export async function initializeFaqStorage() {
  try {
    const supabase = getServerClient()
    
    // Create faq-images bucket if it doesn't exist
    await ensureBucketExists(supabase, FAQ_IMAGES_BUCKET, true)
    
    console.log("FAQ images storage bucket initialization completed")
    return true
  } catch (error) {
    console.error("Error initializing FAQ images storage bucket:", error)
    return false
  }
}

/**
 * Interface for the existing Faq_images table
 */
export interface FaqImage {
  id: number
  title: string
  description?: string
  image_url: string
  section: string
  order?: number
  created_at: string
  updated_at: string
}

/**
 * Fetches FAQ images by section from the database
 * @param section - The section to fetch images for
 * @returns An array of FAQ images for the specified section
 */
export async function getFaqImagesBySection(section: string): Promise<FaqImage[]> {
  try {
    const supabase = getBrowserClient()
    
    const { data, error } = await supabase
      .from('Faq_images')
      .select('*')
      .eq('section', section)
      .order('order', { ascending: true })
    
    if (error) {
      console.error("Error fetching FAQ images:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error(`Error fetching FAQ images for section ${section}:`, error)
    return []
  }
}

/**
 * Fetches all FAQ images from the database
 * @returns An array of all FAQ images
 */
export async function getAllFaqImages(): Promise<FaqImage[]> {
  try {
    const supabase = getBrowserClient()
    
    const { data, error } = await supabase
      .from('Faq_images')
      .select('*')
      .order('section', { ascending: true })
      .order('order', { ascending: true })
    
    if (error) {
      console.error("Error fetching all FAQ images:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error("Error fetching all FAQ images:", error)
    return []
  }
}

/**
 * Uploads a FAQ image to the faq-images bucket
 * @param file - The image file to upload
 * @param section - The section the image belongs to
 * @returns URL of the uploaded image or null if upload failed
 */
export async function uploadFaqImage(
  file: File,
  section: string
): Promise<string | null> {
  const supabase = getBrowserClient()
  
  try {
    // Check if we have an active session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.error("No active session found - user not authenticated")
      return null
    }

    // Get file extension and ensure it's lowercase
    const fileExt = file.name.split(".").pop()?.toLowerCase() || 'jpg'
    
    // Create a unique filename with section prefix
    const fileName = `${section}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

    console.log(`Uploading FAQ image to ${FAQ_IMAGES_BUCKET}: ${fileName}, type: ${file.type}, size: ${file.size} bytes`)

    // Upload with auth headers explicitly included
    const { data, error } = await supabase.storage
      .from(FAQ_IMAGES_BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
        // Add authorization header from current session
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

    if (error) {
      console.error(`Error uploading to ${FAQ_IMAGES_BUCKET}:`, error)
      return null
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(FAQ_IMAGES_BUCKET)
      .getPublicUrl(fileName)
    
    console.log(`${FAQ_IMAGES_BUCKET} upload successful:`, urlData.publicUrl)
    return urlData.publicUrl
  } catch (error) {
    console.error(`Unexpected error during ${FAQ_IMAGES_BUCKET} upload:`, error)
    return null
  }
}

/**
 * Adds a FAQ image record to the database
 * @param title - Title of the image
 * @param description - Description of the image
 * @param imageUrl - URL of the uploaded image
 * @param section - Section the image belongs to
 * @param order - Display order of the image (optional)
 * @returns The new image record or null if operation failed
 */
export async function addFaqImageRecord(
  title: string,
  description: string | null,
  imageUrl: string,
  section: string,
  order?: number
): Promise<FaqImage | null> {
  try {
    const supabase = getBrowserClient()
    
    // If order not provided, get the next available order for this section
    if (order === undefined) {
      const { data, error } = await supabase
        .from('Faq_images')
        .select('order')
        .eq('section', section)
        .order('order', { ascending: false })
        .limit(1)
      
      if (!error && data && data.length > 0) {
        order = (data[0].order || 0) + 1
      } else {
        order = 1 // Start at 1 if no existing images
      }
    }
    
    // Insert the new record
    const { data, error } = await supabase
      .from('Faq_images')
      .insert([{
        title,
        description,
        image_url: imageUrl,
        section,
        order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
    
    if (error) {
      console.error("Error adding FAQ image record:", error)
      return null
    }
    
    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error("Error adding FAQ image record:", error)
    return null
  }
}

/**
 * Updates an existing FAQ image record
 * @param id - ID of the FAQ image to update
 * @param updates - Object containing fields to update
 * @returns The updated record or null if operation failed
 */
export async function updateFaqImageRecord(
  id: number,
  updates: {
    title?: string
    description?: string | null
    image_url?: string
    section?: string
    order?: number
  }
): Promise<FaqImage | null> {
  try {
    const supabase = getBrowserClient()
    
    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    // Update the record
    const { data, error } = await supabase
      .from('Faq_images')
      .update(updatedData)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error("Error updating FAQ image record:", error)
      return null
    }
    
    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error("Error updating FAQ image record:", error)
    return null
  }
}

/**
 * Deletes a FAQ image record and its associated file
 * @param id - ID of the FAQ image to delete
 * @returns True if deletion was successful, false otherwise
 */
export async function deleteFaqImage(id: number): Promise<boolean> {
  try {
    const supabase = getBrowserClient()
    
    // First, get the image URL to delete from storage
    const { data: imageData, error: fetchError } = await supabase
      .from('Faq_images')
      .select('image_url')
      .eq('id', id)
      .single()
    
    if (fetchError || !imageData) {
      console.error("Error fetching FAQ image for deletion:", fetchError)
      return false
    }
    
    // Extract path from URL
    const url = new URL(imageData.image_url)
    const pathParts = url.pathname.split('/')
    const storagePath = pathParts.slice(pathParts.indexOf('object') + 2).join('/')
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(FAQ_IMAGES_BUCKET)
      .remove([storagePath])
    
    if (storageError) {
      console.error("Error deleting FAQ image from storage:", storageError)
      // Continue to delete the database record anyway
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('Faq_images')
      .delete()
      .eq('id', id)
    
    if (dbError) {
      console.error("Error deleting FAQ image record:", dbError)
      return false
    }
    
    return true
  } catch (error) {
    console.error("Error deleting FAQ image:", error)
    return false
  }
} 