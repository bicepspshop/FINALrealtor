import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { checkTrialStatus } from "./lib/subscription"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for the middleware
function getSupabaseForMiddleware(authToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    throw new Error("Missing required environment variables for Supabase");
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  });
}

export async function middleware(request: NextRequest) {
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
