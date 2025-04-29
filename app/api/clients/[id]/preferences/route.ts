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
    
    // 1. Insert preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from("client_preferences")
      .insert({
        client_id: clientId,
        rooms_min: data.rooms_min,
        rooms_max: data.rooms_max,
        preferred_floor_min: data.preferred_floor_min,
        preferred_floor_max: data.preferred_floor_max,
        area_min: data.area_min,
        area_max: data.area_max
      })
      .select("id, rooms_min, rooms_max, preferred_floor_min, preferred_floor_max, area_min, area_max")
      .single()
    
    if (preferencesError) {
      console.error("API error creating preferences:", preferencesError)
      return NextResponse.json(
        { error: preferencesError.message || "Failed to create client preferences" },
        { status: 500 }
      )
    }
    
    // 2. Handle features (if any)
    let features: Array<{ id: string, feature_name: string }> = []
    if (data.features && data.features.length > 0) {
      // First, clear any existing features for this client
      await supabase
        .from("client_features")
        .delete()
        .eq("client_id", clientId)
      
      // Then insert new features
      const featuresToInsert = data.features.map((feature: string) => ({
        client_id: clientId,
        feature_name: feature
      }))
      
      const { data: insertedFeatures, error: featuresError } = await supabase
        .from("client_features")
        .insert(featuresToInsert)
        .select("id, feature_name")
      
      if (featuresError) {
        console.error("API error creating features:", featuresError)
        // We don't return an error here, as the preferences were successful
        // Instead, we'll return a partial success
      } else {
        features = insertedFeatures || []
      }
    }
    
    // Return the created resources
    return NextResponse.json({
      preferences,
      features
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
    const preferencesId = data.preferences_id
    
    if (!preferencesId) {
      return NextResponse.json(
        { error: "Preferences ID is required" },
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
    
    // Check if the preferences record belongs to this client
    const { data: preferencesCheck, error: preferencesCheckError } = await supabase
      .from("client_preferences")
      .select("id")
      .eq("id", preferencesId)
      .eq("client_id", clientId)
      .single()
    
    if (preferencesCheckError || !preferencesCheck) {
      return NextResponse.json(
        { error: "Preferences not found or do not belong to this client" },
        { status: 404 }
      )
    }

    // Update preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from("client_preferences")
      .update({
        rooms_min: data.rooms_min,
        rooms_max: data.rooms_max,
        preferred_floor_min: data.preferred_floor_min,
        preferred_floor_max: data.preferred_floor_max,
        area_min: data.area_min,
        area_max: data.area_max
      })
      .eq("id", preferencesId)
      .eq("client_id", clientId)
      .select("id, rooms_min, rooms_max, preferred_floor_min, preferred_floor_max, area_min, area_max")
      .single()
    
    if (preferencesError) {
      console.error("API error updating preferences:", preferencesError)
      return NextResponse.json(
        { error: preferencesError.message || "Failed to update client preferences" },
        { status: 500 }
      )
    }
    
    // Handle features (if any)
    let features: Array<{ id: string, feature_name: string }> = []
    if (data.features !== undefined) {
      // First, clear any existing features for this client
      await supabase
        .from("client_features")
        .delete()
        .eq("client_id", clientId)
      
      // Only insert new features if there are any
      if (data.features.length > 0) {
        // Then insert new features
        const featuresToInsert = data.features.map((feature: string) => ({
          client_id: clientId,
          feature_name: feature
        }))
        
        const { data: insertedFeatures, error: featuresError } = await supabase
          .from("client_features")
          .insert(featuresToInsert)
          .select("id, feature_name")
        
        if (featuresError) {
          console.error("API error updating features:", featuresError)
          // We don't return an error here, as the preferences update was successful
          // Instead, we'll return a partial success
        } else {
          features = insertedFeatures || []
        }
      }
    }
    
    // Return the updated resources
    return NextResponse.json({
      preferences,
      features
    })
    
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 