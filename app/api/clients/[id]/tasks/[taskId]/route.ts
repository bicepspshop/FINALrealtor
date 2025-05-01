import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, taskId: string } }
) {
  try {
    // Get authenticated user
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = params.id;
    const taskId = params.taskId;

    // Verify client belongs to this user first
    const supabase = getServerClient();
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("user_id", session.id)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found or access denied" }, { status: 403 });
    }

    // Delete the task
    const { error } = await supabase
      .from("client_tasks")
      .delete()
      .eq("id", taskId)
      .eq("client_id", clientId);

    if (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error handling delete task request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string, taskId: string } }
) {
  try {
    // Get authenticated user
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = params.id;
    const taskId = params.taskId;
    
    // Get request body
    const data = await request.json();
    
    // Validate required fields
    if (data.is_completed === undefined) {
      return NextResponse.json({ error: "Missing required field: is_completed" }, { status: 400 });
    }

    // Verify client belongs to this user first
    const supabase = getServerClient();
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("user_id", session.id)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found or access denied" }, { status: 403 });
    }

    // Update the task status
    const { error } = await supabase
      .from("client_tasks")
      .update({ is_completed: data.is_completed })
      .eq("id", taskId)
      .eq("client_id", clientId);

    if (error) {
      console.error("Error updating task status:", error);
      return NextResponse.json({ error: "Failed to update task status" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Task status updated successfully",
      is_completed: data.is_completed 
    });
  } catch (error) {
    console.error("Error handling update task request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 