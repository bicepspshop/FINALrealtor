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

    // Get all deal stages for this client, ordered by most recent first
    const { data: dealStages, error: dealStagesError } = await supabase
      .from("client_deal_stages")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (dealStagesError) {
      console.error("Error fetching deal stages:", dealStagesError)
      return NextResponse.json({ error: "Failed to fetch deal stages" }, { status: 500 })
    }

    return NextResponse.json({ data: dealStages || [] })
  } catch (error) {
    console.error("Unexpected error in GET /api/clients/[id]/deal-stage/history:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
} 