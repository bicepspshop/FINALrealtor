import { NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const bucket = request.nextUrl.searchParams.get('bucket')
    
    if (!bucket) {
      return NextResponse.json({
        success: false,
        error: "Bucket name is required"
      }, { status: 400 })
    }
    
    const supabase = getServerClient()
    
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      return NextResponse.json({
        success: false,
        error: `Error listing buckets: ${bucketsError.message}`
      }, { status: 500 })
    }
    
    const bucketExists = buckets?.find(b => b.name === bucket)
    
    if (!bucketExists) {
      return NextResponse.json({
        success: false,
        error: `Bucket '${bucket}' does not exist`
      }, { status: 404 })
    }
    
    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: "No file provided"
      }, { status: 400 })
    }
    
    // Create a unique filename
    const fileName = `test-upload-${Date.now()}.${file.name.split('.').pop()}`
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type
      })
      
    if (error) {
      return NextResponse.json({
        success: false,
        error: `Upload failed: ${error.message}`
      }, { status: 500 })
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    // Clean up - delete the test file
    await supabase.storage.from(bucket).remove([fileName])
    
    return NextResponse.json({
      success: true,
      message: `Test upload to '${bucket}' successful`,
      url: urlData.publicUrl
    })
  } catch (error) {
    console.error("Test upload error:", error)
    return NextResponse.json({
      success: false,
      error: `Unexpected error: ${error}`
    }, { status: 500 })
  }
}