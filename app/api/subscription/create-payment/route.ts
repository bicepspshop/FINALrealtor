import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { SubscriptionService } from '@/lib/subscription-service';
import { getYooKassaClient, SUBSCRIPTION_PRICES } from '@/lib/payment/yookassa-client';

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { planType } = body;

    // Validate plan type
    if (!planType || !['monthly', 'yearly'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Get YooKassa client
    const yooKassa = getYooKassaClient();
    if (!yooKassa) {
      return NextResponse.json(
        { error: 'Payment service not available' },
        { status: 503 }
      );
    }

    // Determine amount based on plan type
    const amount = SUBSCRIPTION_PRICES[planType as keyof typeof SUBSCRIPTION_PRICES];
    
    // Generate a unique payment ID (using timestamp + user ID)
    const paymentId = `${Date.now()}_${session.id}`;
    
    // Return URL after payment (success or cancel)
    const returnUrl = `${req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL}/dashboard/subscription`;
    
    // Create payment in YooKassa
    const payment = await yooKassa.createPayment({
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB'
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl
      },
      capture: true,
      description: `Подписка на РиелторПро - ${planType === 'monthly' ? 'ежемесячная' : 'годовая'}`,
      metadata: {
        userId: session.id,
        planType: planType,
        paymentId: paymentId
      }
    });

    // Return the confirmation URL to redirect the user
    return NextResponse.json({
      success: true,
      confirmationUrl: payment.confirmation.confirmation_url,
      paymentId: payment.id
    });
    
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 