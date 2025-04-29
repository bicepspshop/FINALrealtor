import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function POST(
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

    const clientId = params.id
    
    // Get data from request
    const data = await request.json()
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // First check if the client belongs to this agent
    const { data: clientCheck, error: checkError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("agent_id", session.id)
      .single()
    
    if (checkError || !clientCheck) {
      return NextResponse.json(
        { error: "Client not found or you don't have permission" },
        { status: 404 }
      )
    }

    // Begin a transaction by batching multiple operations
    
    // 1. Insert deal request
    const { data: dealRequest, error: dealError } = await supabase
      .from("client_deal_requests")
      .insert({
        client_id: clientId,
        real_estate_type: data.real_estate_type,
        budget_min: data.budget_min,
        budget_max: data.budget_max,
        first_payment: data.first_payment,
        payment_type: data.payment_type
      })
      .select("id, real_estate_type, budget_min, budget_max, first_payment, payment_type")
      .single()
    
    if (dealError) {
      console.error("API error creating deal request:", dealError)
      return NextResponse.json(
        { error: dealError.message || "Failed to create deal request" },
        { status: 500 }
      )
    }
    
    // 2. Handle locations (if any)
    let locations: Array<{ id: string, location_name: string }> = []
    if (data.locations && data.locations.length > 0) {
      // First, clear any existing locations for this client
      await supabase
        .from("client_locations")
        .delete()
        .eq("client_id", clientId)
      
      // Then insert new locations
      const locationsToInsert = data.locations.map((location: string) => ({
        client_id: clientId,
        location_name: location
      }))
      
      const { data: insertedLocations, error: locationsError } = await supabase
        .from("client_locations")
        .insert(locationsToInsert)
        .select("id, location_name")
      
      if (locationsError) {
        console.error("API error creating locations:", locationsError)
        // We don't return an error here, as the deal request was successful
        // Instead, we'll return a partial success
      } else {
        locations = insertedLocations || []
      }
    }
    
    // Return the created resources
    return NextResponse.json({
      dealRequest,
      locations
    })
    
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function PATCH(
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

    const clientId = params.id
    
    // Get data from request
    const data = await request.json()
    const dealRequestId = data.deal_request_id
    
    if (!dealRequestId) {
      return NextResponse.json(
        { error: "Deal request ID is required" },
        { status: 400 }
      )
    }
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // First check if the client belongs to this agent
    const { data: clientCheck, error: checkError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("agent_id", session.id)
      .single()
    
    if (checkError || !clientCheck) {
      return NextResponse.json(
        { error: "Client not found or you don't have permission" },
        { status: 404 }
      )
    }
    
    // Check if the deal request belongs to this client
    const { data: dealCheck, error: dealCheckError } = await supabase
      .from("client_deal_requests")
      .select("id")
      .eq("id", dealRequestId)
      .eq("client_id", clientId)
      .single()
    
    if (dealCheckError || !dealCheck) {
      return NextResponse.json(
        { error: "Deal request not found or does not belong to this client" },
        { status: 404 }
      )
    }

    // Update deal request
    const { data: dealRequest, error: dealError } = await supabase
      .from("client_deal_requests")
      .update({
        real_estate_type: data.real_estate_type,
        budget_min: data.budget_min,
        budget_max: data.budget_max,
        first_payment: data.first_payment,
        payment_type: data.payment_type
      })
      .eq("id", dealRequestId)
      .eq("client_id", clientId)
      .select("id, real_estate_type, budget_min, budget_max, first_payment, payment_type")
      .single()
    
    if (dealError) {
      console.error("API error updating deal request:", dealError)
      return NextResponse.json(
        { error: dealError.message || "Failed to update deal request" },
        { status: 500 }
      )
    }
    
    // Handle locations (if any)
    let locations: Array<{ id: string, location_name: string }> = []
    if (data.locations) {
      // First, clear any existing locations for this client
      await supabase
        .from("client_locations")
        .delete()
        .eq("client_id", clientId)
      
      // Only insert new locations if there are any
      if (data.locations.length > 0) {
        // Then insert new locations
        const locationsToInsert = data.locations.map((location: string) => ({
          client_id: clientId,
          location_name: location
        }))
        
        const { data: insertedLocations, error: locationsError } = await supabase
          .from("client_locations")
          .insert(locationsToInsert)
          .select("id, location_name")
        
        if (locationsError) {
          console.error("API error updating locations:", locationsError)
          // We don't return an error here, as the deal request was successful
          // Instead, we'll return a partial success
        } else {
          locations = insertedLocations || []
        }
      }
    }
    
    // Return the updated resources
    return NextResponse.json({
      dealRequest,
      locations
    })
    
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 