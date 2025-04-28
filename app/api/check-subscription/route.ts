import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerClient } from '@/lib/supabase'
import { checkTrialStatus } from '@/lib/subscription'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

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
    
    // Return subscription status
    return NextResponse.json({ 
      isActive: trialInfo.isActive,
      subscriptionStatus: trialInfo.subscriptionStatus
    })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json(
      { error: 'Error checking subscription status' },
      { status: 500 }
    )
  }
} 