import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string, matchId: string } }
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
    const matchId = params.matchId
    
    // Get update data from request
    const data = await request.json()
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // Verify client exists and belongs to current agent
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("agent_id", session.id)
      .single()
    
    if (clientError || !client) {
      return NextResponse.json(
        { error: "Клиент не найден или у вас нет доступа к нему" },
        { status: 404 }
      )
    }
    
    // Verify property match exists and belongs to the client
    const { data: match, error: matchError } = await supabase
      .from("client_property_matches")
      .select("id")
      .eq("id", matchId)
      .eq("client_id", clientId)
      .single()
    
    if (matchError || !match) {
      return NextResponse.json(
        { error: "Объект не найден или не привязан к этому клиенту" },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const updateData: Record<string, any> = {}
    
    if (data.status) {
      updateData.status = data.status
    }
    
    if (data.notes !== undefined) {
      updateData.notes = data.notes
    }
    
    // Update property match
    const { data: updatedMatch, error } = await supabase
      .from("client_property_matches")
      .update(updateData)
      .eq("id", matchId)
      .select("id, property_id, status, sent_date, notes")
      .single()
    
    if (error) {
      console.error("API error updating property match:", error)
      return NextResponse.json(
        { error: error.message || "Failed to update property match" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(updatedMatch)
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, matchId: string } }
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
    const matchId = params.matchId
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // Verify client exists and belongs to current agent
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("agent_id", session.id)
      .single()
    
    if (clientError || !client) {
      return NextResponse.json(
        { error: "Клиент не найден или у вас нет доступа к нему" },
        { status: 404 }
      )
    }
    
    // Verify property match exists and belongs to the client
    const { data: match, error: matchError } = await supabase
      .from("client_property_matches")
      .select("id")
      .eq("id", matchId)
      .eq("client_id", clientId)
      .single()
    
    if (matchError || !match) {
      return NextResponse.json(
        { error: "Объект не найден или не привязан к этому клиенту" },
        { status: 404 }
      )
    }
    
    // Delete property match
    const { error } = await supabase
      .from("client_property_matches")
      .delete()
      .eq("id", matchId)
    
    if (error) {
      console.error("API error deleting property match:", error)
      return NextResponse.json(
        { error: error.message || "Failed to delete property match" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 