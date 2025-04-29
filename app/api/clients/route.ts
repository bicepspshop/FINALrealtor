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
    
    // Format birthday as proper date or null
    const birthdayValue = data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : null
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // Insert client using server-side authenticated client
    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        full_name: data.full_name,
        phone: data.phone || null,
        email: data.email || null,
        birthday: birthdayValue,
        lead_source: data.lead_source || null,
        agent_id: session.id
      })
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