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

    // Get property IDs from query string
    const url = new URL(request.url)
    const propertyIdsParam = url.searchParams.get('ids')
    
    if (!propertyIdsParam) {
      return NextResponse.json(
        { error: "Missing property IDs" },
        { status: 400 }
      )
    }
    
    const propertyIds = propertyIdsParam.split(',').filter(Boolean)
    
    if (propertyIds.length === 0) {
      return NextResponse.json({})
    }
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // Fetch properties with their collection IDs
    const { data, error } = await supabase
      .from("properties")
      .select("id, collection_id")
      .in("id", propertyIds)
    
    if (error) {
      console.error("API error fetching property collections:", error)
      return NextResponse.json(
        { error: error.message || "Failed to fetch property collections" },
        { status: 500 }
      )
    }
    
    // Create a map of property ID to collection ID
    const collectionsMap: Record<string, string> = {}
    data?.forEach(property => {
      if (property.collection_id) {
        collectionsMap[property.id] = property.collection_id
      }
    })
    
    return NextResponse.json(collectionsMap)
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 