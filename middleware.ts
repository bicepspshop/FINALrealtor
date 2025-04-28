import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { checkTrialStatus } from "./lib/subscription"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for the middleware
function getSupabaseForMiddleware(authToken?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    throw new Error("Missing required environment variables for Supabase");
  }
  
  const options: any = {
    auth: {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false,
    }
  };
  
  if (authToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, options);
}

export async function middleware(request: NextRequest) {
  // Handle share links separately
  if (request.nextUrl.pathname.startsWith('/share/')) {
    // Skip the /share/expired route to avoid redirect loops
    if (request.nextUrl.pathname === '/share/expired') {
      return NextResponse.next()
    }
    
    try {
      // Extract share ID from the URL path
      const shareId = request.nextUrl.pathname.split('/')[2]
      
      if (!shareId || shareId === 'expired' || shareId === 'components' || shareId === 'v2') {
        return NextResponse.next()
      }

      const supabase = getSupabaseForMiddleware()

      // Find collection by share_id
      const { data: collection, error: collectionError } = await supabase
        .from("collections")
        .select("id, user_id")
        .eq("share_id", shareId)
        .single()

      if (collectionError || !collection) {
        // If collection not found, let the page handle the 404
        return NextResponse.next()
      }

      // Check the subscription status of the collection owner
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("subscription_status, trial_start_time, trial_duration_minutes")
        .eq("id", collection.user_id)
        .single()

      if (userError || !user) {
        // If user not found, let the page handle the 404
        return NextResponse.next()
      }

      // Check if subscription is active or trial is valid
      if (user.subscription_status === 'active') {
        // Paid subscription, allow access
        return NextResponse.next()
      } else if (user.subscription_status === 'trial') {
        // Check if trial is still valid
        const trialStartTime = new Date(user.trial_start_time);
        const trialDurationMs = user.trial_duration_minutes * 60 * 1000;
        const trialEndTime = new Date(trialStartTime.getTime() + trialDurationMs);
        const currentTime = new Date();
        
        if (currentTime < trialEndTime) {
          // Trial still active, allow access
          return NextResponse.next()
        }
      }

      // If subscription is expired or cancelled, redirect to expired page
      return NextResponse.redirect(new URL('/share/expired', request.url))
    } catch (error) {
      console.error('Share middleware error:', error)
      // On error, allow access but log error
      return NextResponse.next()
    }
  }
  
  // Skip middleware for non-dashboard routes or subscription page
  if (!request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/dashboard/subscription')) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  const authToken = request.cookies.get('auth-token')?.value
  
  if (!authToken) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Make a server call to check subscription status
    // This allows us to have up-to-date subscription info on every request
    const subscriptionCheckResponse = await fetch(
      `${request.nextUrl.origin}/api/check-subscription`, 
      {
        headers: {
          Cookie: `auth-token=${authToken}`
        }
      }
    )

    if (!subscriptionCheckResponse.ok) {
      // If there's an error checking subscription, allow access but log error
      console.error('Error checking subscription status in middleware')
      return NextResponse.next()
    }

    const { isActive } = await subscriptionCheckResponse.json()

    // If trial is not active, redirect to subscription page
    if (!isActive) {
      return NextResponse.redirect(new URL('/dashboard/subscription', request.url))
    }

    // Continue to the protected route
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow access but log error
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/share/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
