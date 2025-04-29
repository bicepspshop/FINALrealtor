import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Проверяем, является ли сессия временной (офлайн режим)
    const isOfflineMode = "isOfflineMode" in session && session.isOfflineMode === true
    
    let clients = []
    let fetchError = null

    // Create authenticated server client
    const supabase = getServerClient()

    try {
      // Проверяем, находимся ли мы в офлайн-режиме
      if (isOfflineMode) {
        clients = [] // В офлайн-режиме возвращаем пустой массив
      } else {
        // Get clients for this agent
        const { data, error } = await supabase
          .from("clients")
          .select("id, full_name, phone, email, last_contact_date, lead_source")
          .eq("agent_id", session.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Ошибка при получении клиентов:", error)
          fetchError = error
        } else {
          clients = data || []
        }
      }
    } catch (error) {
      console.error("Ошибка при получении клиентов:", error)
      fetchError = error
    }

    // Return response with clients and trial info
    return NextResponse.json({
      clients,
      user: {
        id: session.id,
        name: session.name,
        isOfflineMode: isOfflineMode || false,
        trialInfo: session.trialInfo || null
      },
      error: fetchError ? fetchError.message : null
    })
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 