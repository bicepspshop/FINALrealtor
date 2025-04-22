import { NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"
import { validateFile, createUniqueFileName } from "@/lib/file-helpers"

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized: No active session"
      }, { status: 401 })
    }
    
    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucketName = formData.get('bucket') as string
    const userId = session.id
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: "No file provided"
      }, { status: 400 })
    }
    
    if (!bucketName) {
      return NextResponse.json({
        success: false,
        error: "No bucket specified"
      }, { status: 400 })
    }
    
    // Check if bucket exists and is valid
    const validBuckets = ["property-images", "collection-covers", "avatars"]
    if (!validBuckets.includes(bucketName)) {
      return NextResponse.json({
        success: false,
        error: `Invalid bucket name: ${bucketName}`
      }, { status: 400 })
    }
    
    // Validate the file
    const validation = validateFile(file, 
      bucketName === "property-images" ? 10 : 5,  // 10MB for property images, 5MB for others
      ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    )
    
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.message
      }, { status: 400 })
    }
    
    // Create a unique filename with userId for organization
    const fileName = createUniqueFileName(file.name, userId)
    
    // Use server client with service role for upload
    const supabase = getServerClient()
    
    // Upload the file using the server's privileges
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type
      })
      
    if (error) {
      console.error(`Server upload failed to ${bucketName}:`, error)
      return NextResponse.json({
        success: false,
        error: `Upload failed: ${error.message}`
      }, { status: 500 })
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)
    
    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      message: "Upload successful"
    })
  } catch (error) {
    console.error("Server upload error:", error)
    return NextResponse.json({
      success: false,
      error: `Unexpected error: ${error}`
    }, { status: 500 })
  }
}