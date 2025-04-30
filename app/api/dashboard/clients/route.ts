import { NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"
import { checkTrialStatus } from "@/lib/subscription"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse pagination parameters from query string
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    
    // Calculate range for pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const supabase = getServerClient()
    
    // First get the total count
    const { count, error: countError } = await supabase
      .from("clients")
      .select('*', { count: 'exact', head: true })
      .eq("agent_id", session.id);
    
    if (countError) {
      console.error("Error counting clients:", countError.message);
      return NextResponse.json(
        { error: "Failed to count clients" },
        { status: 500 }
      );
    }
    
    // Then fetch the paginated data with related information
    const { data: clients, error } = await supabase
      .from("clients")
      .select(`
        id, 
        full_name, 
        phone, 
        email, 
        last_contact_date,
        lead_source,
        client_deal_requests (
          id,
          real_estate_type,
          budget_min,
          budget_max,
          payment_type
        ),
        client_preferences (
          id,
          rooms_min,
          rooms_max,
          area_min,
          area_max
        ),
        client_deal_stages (
          id,
          stage,
          status,
          created_at
        ),
        client_property_matches (
          id
        )
      `)
      .eq("agent_id", session.id)
      .order('last_contact_date', { ascending: false, nullsFirst: false })
      .range(start, end);
    
    if (error) {
      console.error("Error fetching clients:", error.message)
      return NextResponse.json(
        { error: "Failed to fetch clients data" },
        { status: 500 }
      )
    }

    // Get trial info to return with the payload
    const trialInfo = await checkTrialStatus(session.id)
    
    // Create response with caching headers
    const response = NextResponse.json({
      user: {
        ...session,
        trialInfo
      },
      clients: clients || [],
      pagination: {
        page,
        pageSize,
        totalCount: count || 0,
        totalPages: count ? Math.ceil(count / pageSize) : 0
      }
    })
    
    // Set cache control headers
    // Use a shorter cache time for trial users as their status changes more frequently
    const maxAge = trialInfo.subscriptionStatus === 'trial' ? 30 : 60; // 30s for trial, 60s for others
    response.headers.set('Cache-Control', `public, s-maxage=${maxAge}, max-age=${maxAge}`);
    
    return response
  } catch (error) {
    console.error("Error in clients API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 