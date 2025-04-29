import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const propertyId = params.id
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // Fetch property details
    const { data: property, error } = await supabase
      .from("properties")
      .select(`
        id,
        property_type,
        address,
        rooms,
        area,
        price,
        description,
        living_area,
        floor,
        total_floors,
        balcony,
        year_built,
        renovation_type,
        bathroom_count,
        has_parking,
        property_status,
        collection_id,
        property_images (
          id,
          image_url
        )
      `)
      .eq("id", propertyId)
      .single()
    
    if (error) {
      console.error("API error fetching property:", error)
      return NextResponse.json(
        { error: error.message || "Failed to fetch property" },
        { status: 500 }
      )
    }
    
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(property)
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 