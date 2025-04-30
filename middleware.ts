import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { checkTrialStatus } from "./lib/subscription"
import { createClient } from "@supabase/supabase-js"

// Define constants for cookie names and durations
const SUBSCRIPTION_STATUS_COOKIE = 'subscription-status'
const SUBSCRIPTION_EXPIRY_COOKIE = 'subscription-expiry' 
const SUBSCRIPTION_CACHE_DURATION = 60 * 30 // 30 minutes in seconds

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
      // For the main share pages (collections)
      if (request.nextUrl.pathname.startsWith('/share/') && !request.nextUrl.pathname.startsWith('/share/property/') && 
          !request.nextUrl.pathname.startsWith('/share/expired/') && !request.nextUrl.pathname.startsWith('/share/components/') && 
          !request.nextUrl.pathname.startsWith('/share/v2/property/') && !request.nextUrl.pathname.startsWith('/share/v2/components/')) {
        
        // Extract share ID from the URL path
        const shareId = request.nextUrl.pathname.split('/')[2]
        
        if (!shareId) {
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

        // Check the subscription status
        return await checkSubscriptionAndRedirect(supabase, collection.user_id, request)
      }
      
      // For individual property pages (v1 or v2)
      else if (request.nextUrl.pathname.startsWith('/share/property/') || 
               request.nextUrl.pathname.startsWith('/share/v2/property/')) {
        
        const isV2 = request.nextUrl.pathname.startsWith('/share/v2/property/');
        const propertyId = request.nextUrl.pathname.split('/')[isV2 ? 4 : 3];
        
        if (!propertyId) {
          return NextResponse.next()
        }
        
        const supabase = getSupabaseForMiddleware()
        
        // Find property and get user ID of collection owner
        const userId = await getPropertyOwnerUserId(supabase, propertyId);
        
        if (!userId) {
          return NextResponse.next()
        }
        
        // Check the subscription status
        return await checkSubscriptionAndRedirect(supabase, userId, request)
      }
      
      // All other share routes continue normally
      return NextResponse.next()
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
    // Check if we have a cached subscription status
    const cachedStatus = request.cookies.get(SUBSCRIPTION_STATUS_COOKIE)?.value
    const expiryTimestamp = request.cookies.get(SUBSCRIPTION_EXPIRY_COOKIE)?.value
    const currentTime = Math.floor(Date.now() / 1000)
    
    // If we have a valid cached status that hasn't expired
    if (cachedStatus && expiryTimestamp && parseInt(expiryTimestamp) > currentTime) {
      console.log('Using cached subscription status:', cachedStatus)
      
      // If subscription is not active, redirect to subscription page
      if (cachedStatus !== 'active') {
        return NextResponse.redirect(new URL('/dashboard/subscription', request.url))
      }
      
      // Otherwise, continue to the protected route
      return NextResponse.next()
    }
    
    // No cache or cache expired, make a server call to check subscription status
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

    const { isActive, subscriptionStatus } = await subscriptionCheckResponse.json()
    
    // Set up response for adding cookies
    const response = isActive
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/dashboard/subscription', request.url))
      
    // Calculate expiry time (current time + cache duration in seconds)
    const expiryTime = Math.floor(Date.now() / 1000) + SUBSCRIPTION_CACHE_DURATION
    
    // Cache the subscription status
    response.cookies.set({
      name: SUBSCRIPTION_STATUS_COOKIE,
      value: isActive ? 'active' : 'expired',
      path: '/',
      maxAge: SUBSCRIPTION_CACHE_DURATION,
      sameSite: 'lax'
    })
    
    // Store the expiry timestamp
    response.cookies.set({
      name: SUBSCRIPTION_EXPIRY_COOKIE,
      value: expiryTime.toString(),
      path: '/',
      maxAge: SUBSCRIPTION_CACHE_DURATION,
      sameSite: 'lax'
    })
    
    console.log(`Cached subscription status: ${isActive ? 'active' : 'expired'} until ${new Date(expiryTime * 1000).toLocaleString()}`)
    
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow access but log error
    return NextResponse.next()
  }
}

// Helper function to check subscription status and redirect if needed
async function checkSubscriptionAndRedirect(supabase: any, userId: string, request: NextRequest) {
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
}

// Helper function to get the user ID of a property's collection owner
async function getPropertyOwnerUserId(supabase: any, propertyId: string): Promise<string | null> {
  // Find property and its collection
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("collection_id")
    .eq("id", propertyId)
    .single()
    
  if (propertyError || !property) {
    return null;
  }
  
  // Find collection and user
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("user_id")
    .eq("id", property.collection_id)
    .single()
    
  if (collectionError || !collection) {
    return null;
  }
  
  return collection.user_id;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/share/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
