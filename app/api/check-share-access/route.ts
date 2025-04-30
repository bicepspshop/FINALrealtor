import { NextRequest, NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabase'
import { SubscriptionService } from '@/lib/subscription-service'

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    const collectionId = url.searchParams.get('collectionId')
    
    if (!userId || !collectionId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }
    
    const supabase = getServerClient()
    
    // Verify that the collection belongs to the user
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single()
      
    if (collectionError || !collection) {
      return NextResponse.json(
        { error: 'Collection not found or does not belong to specified user' },
        { status: 404 }
      )
    }
    
    // Check user's subscription status using the centralized service
    const subscriptionStatus = await SubscriptionService.getSubscriptionStatus(userId)
    
    // Return subscription status
    return NextResponse.json({ 
      isActive: subscriptionStatus.isActive,
      status: subscriptionStatus.status
    }, {
      headers: {
        // Prevent caching of this response
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error checking share access:', error)
    return NextResponse.json(
      { error: 'Error checking subscription status' },
      { status: 500 }
    )
  }
} 