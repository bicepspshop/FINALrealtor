import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/lib/subscription-service'

export async function GET(req: NextRequest) {
  try {
    // Check for a secret key to secure this endpoint
    const authHeader = req.headers.get('authorization')
    const expectedSecret = process.env.CRON_SECRET_KEY
    
    // If CRON_SECRET_KEY is set, validate the authorization header
    if (expectedSecret && (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== expectedSecret)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Run the batch update process using our centralized service
    const result = await SubscriptionService.updateAllExpiredTrials()
    
    return NextResponse.json({
      success: true,
      updatedCount: result.updated,
      errors: result.errors.length > 0 ? result.errors : null,
      message: `Updated ${result.updated} users with expired trials`
    })
  } catch (error) {
    console.error('Error updating expired trials:', error)
    return NextResponse.json(
      { error: 'Failed to update expired trials', details: error },
      { status: 500 }
    )
  }
} 