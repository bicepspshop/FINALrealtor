import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";
import { checkBucketExists } from "@/utils/storage-helpers";

/**
 * API endpoint to check if required storage buckets exist
 */
export async function GET() {
  try {
    const supabase = getServerClient();
    
    // Check for both required buckets
    const avatarsBucketExists = await checkBucketExists(supabase, "avatars");
    const coversBucketExists = await checkBucketExists(supabase, "collection-covers");
    
    return NextResponse.json({
      success: true,
      buckets: {
        avatars: avatarsBucketExists,
        "collection-covers": coversBucketExists
      }
    });
  } catch (error) {
    console.error("Error checking storage buckets:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to check storage buckets",
        message: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
