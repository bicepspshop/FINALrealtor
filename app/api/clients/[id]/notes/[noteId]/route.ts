import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, noteId: string } }
) {
  try {
    // Get authenticated user
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = params.id;
    const noteId = params.noteId;

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

    // Delete the note
    const { error } = await supabase
      .from("client_notes")
      .delete()
      .eq("id", noteId)
      .eq("client_id", clientId);

    if (error) {
      console.error("Error deleting note:", error);
      return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
    }

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error handling delete note request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 