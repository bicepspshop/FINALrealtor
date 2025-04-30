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

/**
 * Middleware to check subscription status and redirect if needed
 */
export async function middleware(request: NextRequest) {
  // Skip middleware for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/images') ||
    request.nextUrl.pathname.startsWith('/api/subscription-status') ||
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Handle share links - this needs direct DB access
  if (request.nextUrl.pathname.startsWith('/share/')) {
    return handleShareLinks(request);
  }
  
  // Only check subscription for dashboard routes, excluding subscription page
  if (request.nextUrl.pathname.startsWith('/dashboard') && 
      !request.nextUrl.pathname.startsWith('/dashboard/subscription')) {
    return handleDashboardRoutes(request);
  }

  // For all other routes, continue
  return NextResponse.next();
}

/**
 * Handle subscription checks for dashboard routes
 */
async function handleDashboardRoutes(request: NextRequest) {
  // Get auth token
  const authToken = request.cookies.get('auth-token')?.value;
  
  if (!authToken) {
    // Not authenticated, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Make a server call to check subscription status directly
    // This ensures we always get the latest status
    const subscriptionCheckResponse = await fetch(
      `${request.nextUrl.origin}/api/subscription-status`,
      {
        headers: {
          Cookie: `auth-token=${authToken}`
        },
        cache: 'no-store'
      }
    );

    if (!subscriptionCheckResponse.ok) {
      console.error('Error checking subscription status in middleware');
      // On error, allow access to prevent false lockouts but log the error
      return NextResponse.next();
    }

    const status = await subscriptionCheckResponse.json();
    
    // If not active (expired trial or cancelled subscription)
    if (!status.isActive) {
      // Redirect to subscription page
      return NextResponse.redirect(new URL('/dashboard/subscription', request.url));
    }
    
    // Status is active, allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error for dashboard routes:', error);
    // On error, allow access but log the error
    return NextResponse.next();
  }
}

/**
 * Handle subscription checks for share links
 */
async function handleShareLinks(request: NextRequest) {
  // Skip the /share/expired route to avoid redirect loops
  if (request.nextUrl.pathname === '/share/expired') {
    return NextResponse.next();
  }
  
  try {
    // For share links we need to query the database directly
    // as the share user might not be the logged-in user
    
    // Extract the relevant ID and determine path type
    let userId: string | null = null;
    
    if (request.nextUrl.pathname.startsWith('/share/') && 
        !request.nextUrl.pathname.startsWith('/share/property/') && 
        !request.nextUrl.pathname.startsWith('/share/expired/') && 
        !request.nextUrl.pathname.startsWith('/share/components/') && 
        !request.nextUrl.pathname.startsWith('/share/v2/property/') && 
        !request.nextUrl.pathname.startsWith('/share/v2/components/')) {
      
      // Collection share
      const shareId = request.nextUrl.pathname.split('/')[2];
      if (!shareId) return NextResponse.next();
      
      const supabase = getSupabaseForMiddleware();
      const { data: collection, error: collectionError } = await supabase
        .from("collections")
        .select("user_id")
        .eq("share_id", shareId)
        .single();
      
      if (collectionError || !collection) return NextResponse.next();
      
      userId = collection.user_id;
    } 
    else if (request.nextUrl.pathname.startsWith('/share/property/') || 
             request.nextUrl.pathname.startsWith('/share/v2/property/')) {
      
      // Property share
      const isV2 = request.nextUrl.pathname.startsWith('/share/v2/property/');
      const propertyId = request.nextUrl.pathname.split('/')[isV2 ? 4 : 3];
      if (!propertyId) return NextResponse.next();
      
      const supabase = getSupabaseForMiddleware();
      
      // Find the property and its collection
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .select("collection_id")
        .eq("id", propertyId)
        .single();
      
      if (propertyError || !property) return NextResponse.next();
      
      // Find the collection and its owner
      const { data: collection, error: collectionError } = await supabase
        .from("collections")
        .select("user_id")
        .eq("id", property.collection_id)
        .single();
      
      if (collectionError || !collection) return NextResponse.next();
      
      userId = collection.user_id;
    }
    
    // If no userId was found, allow access
    if (!userId) return NextResponse.next();
    
    // Check subscription status directly in the database
    const supabase = getSupabaseForMiddleware();
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("subscription_status, trial_start_time, trial_duration_minutes")
      .eq("id", userId)
      .single();
    
    if (userError || !user) return NextResponse.next();
    
    // Check if subscription is active
    if (user.subscription_status === 'active') {
      // Paid subscription, allow access
      return NextResponse.next();
    } 
    else if (user.subscription_status === 'trial') {
      // Check if trial is still valid
      const trialStartTime = new Date(user.trial_start_time);
      const trialDurationMs = user.trial_duration_minutes * 60 * 1000;
      const trialEndTime = new Date(trialStartTime.getTime() + trialDurationMs);
      const currentTime = new Date();
      
      if (currentTime < trialEndTime) {
        // Trial is still active, allow access
        return NextResponse.next();
      }
      
      // Trial has expired but status not updated yet, update it
      await supabase
        .from("users")
        .update({ subscription_status: 'expired' })
        .eq("id", userId);
    }
    
    // If we get here, subscription is not active
    // Redirect to expired page
    return NextResponse.redirect(new URL('/share/expired', request.url));
  } catch (error) {
    console.error('Share middleware error:', error);
    // On error, allow access but log the error
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/share/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
