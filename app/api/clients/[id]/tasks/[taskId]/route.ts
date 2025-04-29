import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getServerClient } from "@/lib/supabase"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const clientId = params.id
    const taskId = params.taskId
    
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    
    // Validate the body has at least one field to update
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
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

    // Verify the task belongs to the client
    const { data: task, error: taskError } = await supabase
      .from("client_tasks")
      .select("id")
      .eq("id", taskId)
      .eq("client_id", clientId)
      .single()

    if (taskError || !task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Update task
    const { data: updatedTask, error: updateError } = await supabase
      .from("client_tasks")
      .update(body)
      .eq("id", taskId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating task:", updateError)
      return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
    }

    // If task is completed, update client last_contact_date
    if (body.is_completed === true) {
      await supabase
        .from("clients")
        .update({ last_contact_date: new Date().toISOString() })
        .eq("id", clientId)
    }

    return NextResponse.json({ data: updatedTask })
  } catch (error) {
    console.error("Unexpected error in PATCH /api/clients/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const clientId = params.id
    const taskId = params.taskId
    
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

    // Verify the task belongs to the client
    const { data: task, error: taskError } = await supabase
      .from("client_tasks")
      .select("id")
      .eq("id", taskId)
      .eq("client_id", clientId)
      .single()

    if (taskError || !task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Delete task
    const { error: deleteError } = await supabase
      .from("client_tasks")
      .delete()
      .eq("id", taskId)

    if (deleteError) {
      console.error("Error deleting task:", deleteError)
      return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error in DELETE /api/clients/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
} 