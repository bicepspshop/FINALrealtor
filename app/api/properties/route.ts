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
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    let query = supabase
      .from("properties")
      .select("id, property_type, address, rooms, area, price, property_status, collection_id")
      .order("created_at", { ascending: false })
    
    // Filter by collection if provided
    if (collectionId) {
      query = query.eq("collection_id", collectionId)
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