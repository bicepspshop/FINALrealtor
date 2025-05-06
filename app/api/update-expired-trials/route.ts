import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/lib/subscription-service'
import { getServerClient } from '@/lib/supabase'
import { updateExpiredTrials } from '@/lib/subscription'

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

export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json();
    const { admin_id } = body;
    
    // Verify the user making the request is an admin
    const supabase = getServerClient();
    const { data: adminCheck, error: adminError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', admin_id)
      .single();
    
    if (adminError || !adminCheck || !adminCheck.is_admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }
    
    // Execute the update of expired trials
    const result = await updateExpiredTrials();
    
    // Return the results
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error updating expired trials:', error);
    return NextResponse.json(
      { error: 'Failed to update expired trials' },
      { status: 500 }
    );
  }
} 