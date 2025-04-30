import { NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

// Helper function to set cache headers
function setCacheHeaders(response: NextResponse, maxAgeSeconds: number = 60): NextResponse {
  response.headers.set('Cache-Control', `public, max-age=${maxAgeSeconds}`);
  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const clientId = params.id
    
    // Get query parameter for field selection
    const searchParams = request.nextUrl.searchParams;
    const fields = searchParams.get('fields');
    
    // Default fields to fetch - minimal set for better performance
    let fieldSelection = `
      id,
      full_name,
      email,
      phone,
      lead_source,
      last_contact_date
    `;
    
    // If detailed view is requested, fetch relations too
    if (fields === 'detailed') {
      fieldSelection = `
        id,
        full_name, 
        email,
        phone,
        birthday,
        lead_source,
        last_contact_date,
        client_deal_requests (
          id,
          real_estate_type,
          budget_min,
          budget_max,
          first_payment,
          payment_type
        ),
        client_preferences (
          id,
          rooms_min,
          rooms_max,
          preferred_floor_min,
          preferred_floor_max,
          area_min,
          area_max
        ),
        client_locations (
          id,
          location_name
        ),
        client_features (
          id,
          feature_name
        ),
        client_deal_stages (
          id,
          stage,
          status,
          notes,
          created_at
        ),
        client_notes (
          id,
          content,
          created_at
        ),
        client_tasks (
          id,
          task_type,
          title,
          description,
          due_date,
          is_completed
        ),
        client_property_matches (
          id,
          property_id,
          status,
          sent_date,
          notes
        )
      `;
    }

    const supabase = getServerClient()
    
    const { data: client, error } = await supabase
      .from("clients")
      .select(fieldSelection)
      .eq("id", clientId)
      .eq("agent_id", session.id)
      .single()

    if (error) {
      console.error("Error fetching client:", error)
      return NextResponse.json(
        { error: "Failed to fetch client data" },
        { status: 500 }
      )
    }

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      )
    }

    // Create response with appropriate cache headers
    const response = NextResponse.json(client);
    return setCacheHeaders(response, 60); // Cache for 60 seconds
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// Delete client endpoint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const clientId = params.id
    const supabase = getServerClient()
    
    // First verify this client belongs to the current agent
    const { data: client, error: checkError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("agent_id", session.id)
      .single()
      
    if (checkError || !client) {
      return NextResponse.json(
        { error: "Client not found or you don't have permission to delete it" },
        { status: 404 }
      )
    }

    // Delete the client
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId)
      .eq("agent_id", session.id)

    if (error) {
      console.error("Error deleting client:", error)
      return NextResponse.json(
        { error: "Failed to delete client" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 