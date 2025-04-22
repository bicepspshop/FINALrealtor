import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = getServerClient()
    
    // Define all required storage buckets
    const requiredBuckets = [
      { name: "property-images", public: true, fileSizeLimit: 10485760 }, // 10MB
      { name: "collection-covers", public: true, fileSizeLimit: 5242880 }, // 5MB
      { name: "avatars", public: true, fileSizeLimit: 5242880 } // 5MB
    ]
    
    const results = []
    
    // Get existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      return NextResponse.json({ 
        success: false, 
        error: `Failed to list buckets: ${listError.message}` 
      }, { status: 500 })
    }
    
    // Create or update buckets
    for (const bucketConfig of requiredBuckets) {
      const bucketExists = existingBuckets?.find(b => b.name === bucketConfig.name)
      
      if (!bucketExists) {
        // Create the bucket
        const { error: createError } = await supabase.storage.createBucket(bucketConfig.name, {
          public: bucketConfig.public,
          fileSizeLimit: bucketConfig.fileSizeLimit
        })
        
        if (createError) {
          results.push({
            bucket: bucketConfig.name,
            status: "error",
            message: `Failed to create bucket: ${createError.message}`
          })
          continue
        }
        
        results.push({
          bucket: bucketConfig.name,
          status: "created",
          message: "Bucket created successfully"
        })
      } else {
        results.push({
          bucket: bucketConfig.name,
          status: "exists",
          message: "Bucket already exists"
        })
      }
      
      // Set policies for public access - direct SQL approach because RPC might not be available
      try {
        // Add policies directly using SQL if possible, or call separate API endpoints
        // This is a simplified approach - actual policy creation might require different methods
        // depending on your Supabase setup
        
        // Test if we can upload to the bucket
        const testFileName = `test-policy-${Date.now()}.txt`
        const testContent = new Blob(["test"], { type: "text/plain" })
        
        const { error: uploadError } = await supabase.storage
          .from(bucketConfig.name)
          .upload(testFileName, testContent)
        
        if (uploadError) {
          results.push({
            bucket: bucketConfig.name,
            status: "warning",
            message: `Bucket exists but upload test failed: ${uploadError.message}. Please configure bucket policies in Supabase dashboard to allow authenticated uploads.`
          })
        } else {
          // Clean up test file
          await supabase.storage.from(bucketConfig.name).remove([testFileName])
          
          results.push({
            bucket: bucketConfig.name,
            status: "success",
            message: "Bucket ready for uploads"
          })
        }
      } catch (policyError) {
        results.push({
          bucket: bucketConfig.name,
          status: "warning",
          message: `Error testing bucket: ${policyError}. Please configure bucket policies in the Supabase dashboard.`
        })
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      results, 
      message: "Storage buckets configuration completed", 
      note: "You may need to manually configure bucket policies in the Supabase dashboard" 
    })
  } catch (error) {
    console.error("Storage setup failed:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Storage setup failed" 
    }, { status: 500 })
  }
}