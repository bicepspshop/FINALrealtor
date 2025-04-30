import { NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Parse pagination parameters from search params
    const searchParams = request.nextUrl.searchParams;
    const collectionId = searchParams.get('collectionId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    
    // Calculate range for pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Specific fields to fetch for better performance
    const propertyFields = [
      'id', 
      'residential_complex', 
      'property_type', 
      'address',
      'rooms',
      'area',
      'price',
      'description',
      'living_area',
      'floor',
      'total_floors',
      'balcony',
      'year_built',
      'renovation_type',
      'bathroom_count',
      'has_parking',
      'property_status'
    ].join(',');
    
    // Minimal image fields needed
    const imageFields = 'id,image_url';

    const supabase = getServerClient()
    
    // If Collection ID is provided, filter by it
    let query = supabase
      .from("properties")
      .select(`${propertyFields}, property_images(${imageFields})`)
      .order('created_at', { ascending: false })
    
    // Add collection filter if specified 
    if (collectionId) {
      query = query.eq('collection_id', collectionId);
    }
    
    // Add pagination
    query = query.range(start, end);
    
    // Get total count first if required
    const { count, error: countError } = await supabase
      .from("properties") 
      .select('*', { count: 'exact', head: true })
      .eq('collection_id', collectionId || '');
      
    if (countError) {
      console.error("Error getting count:", countError);
    }
    
    // Execute the main query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching properties:", error.message)
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      )
    }
    
    // Create response with pagination info
    const response = NextResponse.json({
      properties: data || [],
      pagination: {
        page,
        pageSize,
        totalCount: count || 0,
        totalPages: count ? Math.ceil(count / pageSize) : 0
      }
    });
    
    // Set cache control headers based on content
    // Properties don't change very frequently - safe to cache for 2 minutes
    response.headers.set('Cache-Control', 'public, max-age=120');
    
    return response;
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 