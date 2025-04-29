import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function POST(
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
    
    // Validate required fields
    if (!data.property_id) {
      return NextResponse.json(
        { error: "Идентификатор объекта недвижимости обязателен" },
        { status: 400 }
      )
    }
    
    // Validate UUID format for property_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.property_id)) {
      return NextResponse.json(
        { error: "Неверный формат идентификатора объекта" },
        { status: 400 }
      )
    }
    
    if (!data.status) {
      return NextResponse.json(
        { error: "Статус обязателен" },
        { status: 400 }
      )
    }
    
    // Validate status is one of the allowed values
    const allowedStatuses = ["sent", "visited", "interested", "offer_made", "rejected"];
    if (!allowedStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: "Некорректный статус" },
        { status: 400 }
      )
    }
    
    // Create authenticated server client
    const supabase = getServerClient()
    
    // Verify client exists and belongs to current agent
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("agent_id", session.id)
      .single()
    
    if (clientError || !client) {
      return NextResponse.json(
        { error: "Клиент не найден или у вас нет доступа к нему" },
        { status: 404 }
      )
    }
    
    // Verify property exists
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", data.property_id)
      .single()
    
    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Объект недвижимости не найден" },
        { status: 404 }
      )
    }
    
    // Insert property match
    const { data: propertyMatch, error } = await supabase
      .from("client_property_matches")
      .insert({
        client_id: clientId,
        property_id: data.property_id,
        status: data.status,
        notes: data.notes,
        sent_date: new Date().toISOString()
      })
      .select("id, property_id, status, sent_date, notes")
      .single()
    
    if (error) {
      console.error("API error creating property match:", error)
      return NextResponse.json(
        { error: error.message || "Failed to create property match" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(propertyMatch)
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 