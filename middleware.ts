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
      autoRefreshToken: false,
      persistSession: false,
    },
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

// Map to store subscription checks with 30s TTL
const subscriptionCache = new Map<string, { status: { isActive: boolean; timestamp: number } }>()
const SUBSCRIPTION_CACHE_TTL = 30 * 1000; // 30 seconds in milliseconds

// Helper function to get cache status
function getCachedSubscriptionStatus(userId: string): { isActive: boolean } | null {
  const entry = subscriptionCache.get(userId);
  
  if (!entry) return null;
  
  // Check if cache has expired
  if (Date.now() - entry.status.timestamp > SUBSCRIPTION_CACHE_TTL) {
    subscriptionCache.delete(userId);
    return null;
  }
  
  return { isActive: entry.status.isActive };
}

// Helper function to store subscription status in cache
function cacheSubscriptionStatus(userId: string, isActive: boolean): void {
  subscriptionCache.set(userId, {
    status: {
      isActive,
      timestamp: Date.now()
    }
  });
}

export async function middleware(request: NextRequest) {
  // Handle share links
  if (request.nextUrl.pathname.startsWith('/share/')) {
    // Skip middleware for expired page
    if (request.nextUrl.pathname === '/share/expired') {
      return NextResponse.next()
    }
    
    try {
      // Extract collection ID from path
      // /share/collection/:id or /share/collection/:id/property/:propertyId
      const pathParts = request.nextUrl.pathname.split('/')
      let collectionId = null
      
      if (request.nextUrl.pathname.includes('/property/')) {
        // Process /share/collection/:id/property/:propertyId
        if (pathParts.length >= 4 && pathParts[1] === 'share' && pathParts[2] === 'collection') {
          collectionId = pathParts[3]
        }
      } else {
        // Process /share/collection/:id
        if (pathParts.length >= 4 && pathParts[1] === 'share' && pathParts[2] === 'collection') {
          collectionId = pathParts[3]
        }
      }
      
      if (!collectionId) {
        // Invalid share URL format, let the page handle 404
        return NextResponse.next()
      }
      
      // Get the collection
      const supabase = getSupabaseForMiddleware()
      
      const { data: collection, error: collectionError } = await supabase
        .from("property_collections")
        .select("user_id")
        .eq("id", collectionId)
        .single()
      
      if (collectionError || !collection) {
        // Collection not found, let the page handle 404
        return NextResponse.next()
      }
      
      // Check the subscription status
      return await checkSubscriptionAndRedirect(supabase, collection.user_id, request)
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
    // Check if we have a recent cached subscription status for this user
    const cachedStatus = getCachedSubscriptionStatus(authToken);
    
    if (cachedStatus) {
      // If cached status says not active, redirect to subscription page
      if (!cachedStatus.isActive) {
        return NextResponse.redirect(new URL('/dashboard/subscription', request.url));
      }
      // Otherwise allow access
      return NextResponse.next();
    }
    
    // No cache hit, check subscription status with API
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
    
    // Store result in cache for future requests
    cacheSubscriptionStatus(authToken, isActive);

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

// Helper function to check subscription status and redirect if needed
async function checkSubscriptionAndRedirect(supabase: any, userId: string, request: NextRequest) {
  // Check if we have a cached status for this user
  const cachedStatus = getCachedSubscriptionStatus(userId);
  
  if (cachedStatus) {
    // Use cached result
    if (!cachedStatus.isActive) {
      return NextResponse.redirect(new URL('/share/expired', request.url));
    }
    return NextResponse.next();
  }
  
  // Check the subscription status of the user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("subscription_status, trial_start_time, trial_duration_minutes")
    .eq("id", userId)
    .single()

  if (userError || !user) {
    // If user not found, let the page handle the 404
    return NextResponse.next()
  }

  // Check if subscription is active or trial is valid
  if (user.subscription_status === 'active') {
    // Paid subscription, allow access
    cacheSubscriptionStatus(userId, true);
    return NextResponse.next()
  } else if (user.subscription_status === 'trial') {
    // Check if trial is still valid
    const trialStartTime = new Date(user.trial_start_time);
    const trialDurationMs = user.trial_duration_minutes * 60 * 1000;
    const trialEndTime = new Date(trialStartTime.getTime() + trialDurationMs);
    const currentTime = new Date();
    
    if (currentTime < trialEndTime) {
      // Trial still active, allow access
      cacheSubscriptionStatus(userId, true);
      return NextResponse.next()
    }
  }

  // If subscription is expired or cancelled, redirect to expired page
  cacheSubscriptionStatus(userId, false);
  return NextResponse.redirect(new URL('/share/expired', request.url))
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/share/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
