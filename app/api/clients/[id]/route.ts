import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

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
    
    // Get client data from request
    const data = await request.json()
    
    // Format birthday as proper date or null
    const birthdayValue = data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : null
    
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
        { error: "Client not found or you don't have permission to update it" },
        { status: 404 }
      )
    }
    
    // Update client using server-side authenticated client
    const { error } = await supabase
      .from("clients")
      .update({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        birthday: birthdayValue,
        lead_source: data.lead_source
      })
      .eq("id", clientId)
      .eq("agent_id", session.id)
    
    if (error) {
      console.error("API error updating client:", error)
      return NextResponse.json(
        { error: error.message || "Failed to update client" },
        { status: 500 }
      )
    }
    
    // Return updated client
    const { data: updatedClient, error: fetchError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single()
    
    if (fetchError) {
      console.error("API error fetching updated client:", fetchError)
      return NextResponse.json(
        { success: true, message: "Client updated successfully but could not fetch updated data" }
      )
    }
    
    return NextResponse.json(updatedClient)
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
        { error: "Client not found or you don't have permission to delete it" },
        { status: 404 }
      )
    }
    
    // Delete all related data first (property matches, notes, etc.)
    // Property matches
    const { error: matchesError } = await supabase
      .from("client_property_matches")
      .delete()
      .eq("client_id", clientId)
      
    if (matchesError) {
      console.error("Error deleting client property matches:", matchesError)
      // Continue with deletion even if there was an error here
    }
    
    // Delete client tasks if they exist
    const { error: tasksError } = await supabase
      .from("client_tasks")
      .delete()
      .eq("client_id", clientId)
      
    if (tasksError) {
      console.error("Error deleting client tasks:", tasksError)
      // Continue with deletion even if there was an error here
    }
    
    // Delete client notes if they exist
    const { error: notesError } = await supabase
      .from("client_notes")
      .delete()
      .eq("client_id", clientId)
      
    if (notesError) {
      console.error("Error deleting client notes:", notesError)
      // Continue with deletion even if there was an error here
    }
    
    // Finally delete the client
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId)
      .eq("agent_id", session.id)
    
    if (error) {
      console.error("API error deleting client:", error)
      return NextResponse.json(
        { error: error.message || "Failed to delete client" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Client and all related data successfully deleted" 
    })
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 