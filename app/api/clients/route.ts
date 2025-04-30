import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get client data from request
    const data = await request.json()
    
    // Basic validation
    if (!data.full_name || data.full_name.trim().length < 2) {
      return NextResponse.json(
        { error: "Имя клиента должно содержать минимум 2 символа" },
        { status: 400 }
      )
    }
    
    // Email validation if present
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { error: "Неверный формат email" },
        { status: 400 }
      )
    }
    
    // Only process non-empty fields to reduce payload size
    const clientData: Record<string, any> = {
      full_name: data.full_name.trim(),
      agent_id: session.id
    };
    
    // Only add fields that have values
    if (data.phone && data.phone.trim()) clientData.phone = data.phone.trim();
    if (data.email && data.email.trim()) clientData.email = data.email.trim();
    if (data.lead_source) clientData.lead_source = data.lead_source;
    
    // Format birthday properly if present
    if (data.birthday) {
      clientData.birthday = new Date(data.birthday).toISOString().split('T')[0];
    }
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // Insert client with optimized returning clause
    const { data: client, error } = await supabase
      .from("clients")
      .insert(clientData)
      .select("id")
      .single()
    
    if (error) {
      console.error("API error creating client:", error)
      return NextResponse.json(
        { error: error.message || "Failed to create client" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(client)
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 