import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getServerClient } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getServerClient()

    // First verify the client belongs to the authenticated agent
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("agent_id", session.id)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Get client notes
    const { data: notes, error: notesError } = await supabase
      .from("client_notes")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (notesError) {
      console.error("Error fetching client notes:", notesError)
      return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
    }

    return NextResponse.json({ data: notes || [] })
  } catch (error) {
    console.error("Unexpected error in GET /api/clients/[id]/notes:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { content } = body

    // Validate required fields
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const supabase = getServerClient()

    // First verify the client belongs to the authenticated agent
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("agent_id", session.id)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Create note
    const { data: newNote, error: insertError } = await supabase
      .from("client_notes")
      .insert({
        client_id: clientId,
        content,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating note:", insertError)
      return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
    }

    // Update client last_contact_date
    await supabase
      .from("clients")
      .update({ last_contact_date: new Date().toISOString() })
      .eq("id", clientId)

    return NextResponse.json({ data: newNote })
  } catch (error) {
    console.error("Unexpected error in POST /api/clients/[id]/notes:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
} 