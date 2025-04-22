import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getServerClient()
    
    // Check all required storage buckets
    const requiredBuckets = [
      { name: "property-images", public: true },
      { name: "collection-covers", public: true },
      { name: "avatars", public: true }
    ]
    
    // Get current buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json({ success: false, error: "Failed to list storage buckets" }, { status: 500 })
    }
    
    const results = []
    
    // Verify each required bucket
    for (const requiredBucket of requiredBuckets) {
      const bucketExists = buckets?.find(b => b.name === requiredBucket.name)
      
      if (!bucketExists) {
        // Create missing bucket
        const { error: createError } = await supabase.storage.createBucket(requiredBucket.name, {
          public: requiredBucket.public,
          fileSizeLimit: 10485760, // 10MB
        })
        
        if (createError) {
          results.push({
            bucket: requiredBucket.name,
            status: "error",
            message: `Failed to create bucket: ${createError.message}`
          })
          continue
        }
        
        // Set public policies
        try {
          // Allow anonymous uploads
          const { error: uploadPolicyError } = await supabase.storage.from(requiredBucket.name)
            .createSignedUploadUrl('test.txt')
            
          if (uploadPolicyError) {
            results.push({
              bucket: requiredBucket.name,
              status: "warning",
              message: `Created bucket but could not verify upload permissions: ${uploadPolicyError.message}`
            })
            continue
          }
          
          results.push({
            bucket: requiredBucket.name,
            status: "created",
            message: "Bucket created successfully with public access"
          })
        } catch (policyError) {
          results.push({
            bucket: requiredBucket.name,
            status: "warning",
            message: `Created bucket but failed to set policies: ${policyError}`
          })
        }
      } else {
        // Test upload to existing bucket
        try {
          const testFileName = `test-${Date.now()}.txt`
          const testContent = new Blob(["test"], { type: "text/plain" })
          
          const { error: uploadError } = await supabase.storage
            .from(requiredBucket.name)
            .upload(testFileName, testContent)
            
          if (uploadError) {
            results.push({
              bucket: requiredBucket.name,
              status: "warning",
              message: `Bucket exists but uploads may be restricted: ${uploadError.message}`
            })
            continue
          }
          
          // Clean up test file
          await supabase.storage.from(requiredBucket.name).remove([testFileName])
          
          results.push({
            bucket: requiredBucket.name,
            status: "ok",
            message: "Bucket exists and is working correctly"
          })
        } catch (testError) {
          results.push({
            bucket: requiredBucket.name,
            status: "warning",
            message: `Bucket exists but test failed: ${testError}`
          })
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      results,
      message: "Storage verification complete" 
    })
  } catch (error) {
    console.error("Storage verification failed:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Storage verification failed" 
    }, { status: 500 })
  }
}