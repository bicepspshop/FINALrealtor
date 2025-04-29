import { NextRequest, NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabase'
import { checkTrialStatus } from '@/lib/subscription'

// Helper to set caching headers based on subscription status
function setCacheHeaders(response: NextResponse, isActive: boolean, subscriptionStatus: string): NextResponse {
  // Active subscriptions can be cached longer since they don't change often
  // Trial subscriptions need shorter cache times since they're counting down
  const maxAge = 
    subscriptionStatus === 'active' ? 60 * 30 : // 30 minutes for active subscriptions
    subscriptionStatus === 'trial' ? 60 : // 1 minute for trials
    5; // 5 seconds for expired or other statuses (mostly for error states)
  
  // Set cache control headers
  response.headers.set('Cache-Control', `public, s-maxage=${maxAge}, max-age=${maxAge}`)
  return response;
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user data and check subscription status
    const supabase = getServerClient()
    
    // Get user data with trial information
    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", token)
      .single()
      
    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Check trial status
    const trialInfo = await checkTrialStatus(user.id)
    
    // Create response
    const response = NextResponse.json({ 
      isActive: trialInfo.isActive,
      subscriptionStatus: trialInfo.subscriptionStatus,
      // Add timestamp to help with debugging caching issues
      timestamp: new Date().toISOString()
    })
    
    // Set appropriate cache headers based on subscription status
    return setCacheHeaders(response, trialInfo.isActive, trialInfo.subscriptionStatus);
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json(
      { error: 'Error checking subscription status' },
      { status: 500 }
    )
  }
} 