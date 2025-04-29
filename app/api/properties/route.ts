import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const url = new URL(request.url)
    const collectionId = url.searchParams.get('collection_id')
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit') as string) : undefined
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // First get collections owned by this user
    const { data: userCollections, error: collectionsError } = await supabase
      .from("collections")
      .select("id")
      .eq("user_id", session.id)
    
    if (collectionsError) {
      console.error("API error fetching user collections:", collectionsError)
      return NextResponse.json(
        { error: collectionsError.message || "Failed to fetch collections" },
        { status: 500 }
      )
    }
    
    // Extract collection IDs
    const userCollectionIds = userCollections.map(collection => collection.id)
    
    let query = supabase
      .from("properties")
      .select("id, property_type, address, rooms, area, price, property_status, collection_id")
      .in("collection_id", userCollectionIds) // Only return properties from collections owned by the current user
      .order("created_at", { ascending: false })
    
    // Filter by specific collection if provided
    if (collectionId) {
      query = query.eq("collection_id", collectionId)
    }
    
    // Apply limit if provided
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data: properties, error } = await query
    
    if (error) {
      console.error("API error fetching properties:", error)
      return NextResponse.json(
        { error: error.message || "Failed to fetch properties" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(properties)
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 