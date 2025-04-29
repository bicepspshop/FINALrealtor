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

    // Get the current active deal stage
    const { data: dealStage, error: dealStageError } = await supabase
      .from("client_deal_stages")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (dealStageError && dealStageError.code !== "PGRST116") {
      // PGRST116 is "Results contain 0 rows", which just means no stages yet
      console.error("Error fetching deal stage:", dealStageError)
      return NextResponse.json({ error: "Failed to fetch deal stages" }, { status: 500 })
    }

    return NextResponse.json({ data: dealStage || null })
  } catch (error) {
    console.error("Unexpected error in GET /api/clients/[id]/deal-stage/current:", error)
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
    const { stage, status, notes } = body

    // Validate required fields
    if (!stage || !status) {
      return NextResponse.json({ error: "Stage and status are required" }, { status: 400 })
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

    // Insert new deal stage
    const { data: newStage, error: insertError } = await supabase
      .from("client_deal_stages")
      .insert({
        client_id: clientId,
        stage,
        status,
        notes: notes || "",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting deal stage:", insertError)
      return NextResponse.json({ error: "Failed to update deal stage" }, { status: 500 })
    }

    // Update the last_update_date in the clients table
    await supabase
      .from("clients")
      .update({ last_update_date: new Date().toISOString() })
      .eq("id", clientId)

    return NextResponse.json({ data: newStage })
  } catch (error) {
    console.error("Unexpected error in POST /api/clients/[id]/deal-stage/current:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
} 