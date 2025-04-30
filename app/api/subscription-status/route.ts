import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SubscriptionService } from '@/lib/subscription-service';

/**
 * GET /api/subscription-status
 * 
 * Returns the current subscription status for the authenticated user.
 * This endpoint is designed to be called frequently to ensure users
 * always have the latest subscription status without relying on caching.
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from auth cookie - using request.cookies instead of 
    // the server-side cookies() function to avoid Promise issues
    const userId = request.cookies.get('auth-token')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get subscription status from service
    const subscriptionStatus = await SubscriptionService.getSubscriptionStatus(userId);
    
    // Return status with strong no-cache headers
    const response = NextResponse.json(subscriptionStatus);
    
    // Set cache-control headers 
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}

// Add segment config to ensure the route is dynamic and not cached
export const dynamic = 'force-dynamic';
export const revalidate = 0; 