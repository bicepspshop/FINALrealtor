import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

// Types for client data
interface ClientData {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  last_contact_date?: string;
  lead_source?: string;
  client_deal_requests?: Array<{
    id: string;
    real_estate_type?: string;
    budget_min?: number;
    budget_max?: number;
    payment_type?: string;
  }>;
  client_preferences?: Array<{
    id: string;
    rooms_min?: number;
    rooms_max?: number;
    area_min?: number;
    area_max?: number;
  }>;
  client_deal_stages?: Array<{
    id: string;
    stage?: string;
    status?: string;
    created_at?: string;
  }>;
  client_property_matches?: Array<{
    id: string;
  }>;
}

export async function GET(request: Request) {
  try {
    // Get URL params
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '12')
    
    // Validate pagination parameters
    const validatedPage = page > 0 ? page : 1
    const validatedPageSize = pageSize > 0 && pageSize <= 50 ? pageSize : 12
    
    // Calculate range
    const from = (validatedPage - 1) * validatedPageSize
    const to = from + validatedPageSize - 1
    
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
    
    let clients: ClientData[] = []
    let fetchError: Error | null = null
    let pagination = {
      page: validatedPage,
      pageSize: validatedPageSize,
      totalCount: 0,
      totalPages: 0
    }

    // Create authenticated server client
    const supabase = getServerClient()

    try {
      // Проверяем, находимся ли мы в офлайн-режиме
      if (isOfflineMode) {
        clients = [] // В офлайн-режиме возвращаем пустой массив
      } else {
        // First, get total count for pagination
        const { count, error: countError } = await supabase
          .from("clients")
          .select("id", { count: 'exact', head: true })
          .eq("agent_id", session.id)
        
        if (countError) {
          console.error("Error getting client count:", countError)
          fetchError = countError
        } else {
          // Calculate pagination data
          const totalCount = count || 0
          const totalPages = Math.ceil(totalCount / validatedPageSize)
          
          pagination = {
            page: validatedPage,
            pageSize: validatedPageSize,
            totalCount,
            totalPages
          }
          
          // Get clients for this agent with pagination
          const { data, error } = await supabase
            .from("clients")
            .select(`
              id, 
              full_name, 
              phone, 
              email, 
              last_contact_date, 
              lead_source,
              client_deal_requests(
                id, 
                real_estate_type,
                budget_min,
                budget_max,
                payment_type
              ),
              client_preferences(
                id,
                rooms_min,
                rooms_max,
                area_min,
                area_max
              ),
              client_deal_stages(
                id,
                stage,
                status,
                created_at
              ),
              client_property_matches(
                id
              )
            `)
            .eq("agent_id", session.id)
            .order("created_at", { ascending: false })
            .range(from, to)

          if (error) {
            console.error("Error fetching clients:", error)
            fetchError = error
          } else {
            clients = data as ClientData[] || []
          }
        }
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
      fetchError = error instanceof Error ? error : new Error('Unknown error occurred')
    }

    // Return response with clients and trial info
    return NextResponse.json(
      {
        clients,
        pagination,
        user: {
          id: session.id,
          name: session.name,
          isOfflineMode: isOfflineMode || false,
          trialInfo: session.trialInfo || null
        },
        error: fetchError ? fetchError.message : null
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  }
} 