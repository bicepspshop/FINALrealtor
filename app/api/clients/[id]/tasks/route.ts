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

    // Get client tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("client_tasks")
      .select("*")
      .eq("client_id", clientId)
      .order("due_date", { ascending: true })

    if (tasksError) {
      console.error("Error fetching client tasks:", tasksError)
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
    }

    return NextResponse.json({ data: tasks || [] })
  } catch (error) {
    console.error("Unexpected error in GET /api/clients/[id]/tasks:", error)
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
    const { task_type, title, description, due_date, is_completed } = body

    // Validate required fields
    if (!task_type || !title) {
      return NextResponse.json({ error: "Type and title are required" }, { status: 400 })
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

    // Create task
    const { data: newTask, error: insertError } = await supabase
      .from("client_tasks")
      .insert({
        client_id: clientId,
        task_type,
        title,
        description: description || null,
        due_date: due_date || null,
        is_completed: is_completed || false,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating task:", insertError)
      return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
    }

    // Update client last_contact_date when task is created
    await supabase
      .from("clients")
      .update({ last_contact_date: new Date().toISOString() })
      .eq("id", clientId)

    return NextResponse.json({ data: newTask })
  } catch (error) {
    console.error("Unexpected error in POST /api/clients/[id]/tasks:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
} 