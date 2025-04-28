import { NextRequest, NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabase'

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
    
    // Check user's subscription status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('subscription_status, trial_start_time, trial_duration_minutes')
      .eq('id', userId)
      .single()
      
    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Determine if subscription is active
    let isActive = false
    
    // Paid subscription is always active
    if (user.subscription_status === 'active') {
      isActive = true
    } 
    // Check if trial is still valid
    else if (user.subscription_status === 'trial') {
      const trialStartTime = new Date(user.trial_start_time)
      const trialDurationMs = user.trial_duration_minutes * 60 * 1000
      const trialEndTime = new Date(trialStartTime.getTime() + trialDurationMs)
      const currentTime = new Date()
      
      isActive = currentTime < trialEndTime
      
      // If trial just expired, update the user's status
      if (!isActive) {
        await supabase
          .from('users')
          .update({ subscription_status: 'expired' })
          .eq('id', userId)
      }
    }
    
    // Return subscription status
    return NextResponse.json({ 
      isActive,
      status: user.subscription_status
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