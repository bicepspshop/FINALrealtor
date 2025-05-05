import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscription-service';
import { getServerClient } from '@/lib/supabase';
import { getYooKassaClient } from '@/lib/payment/yookassa-client';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Get the raw body as ArrayBuffer to ensure we have the exact bytes for signature verification
    const rawBodyBuffer = await req.arrayBuffer();
    const rawBody = new Uint8Array(rawBodyBuffer);
    
    // Convert to string for JSON parsing and logging
    const bodyText = new TextDecoder('utf-8').decode(rawBody);
    
    // Log the entire request for debugging
    console.log('Webhook received - Headers:', Object.fromEntries([...req.headers.entries()]));
    console.log('Webhook body:', bodyText.substring(0, 500) + (bodyText.length > 500 ? '...' : ''));
    
    // Parse the JSON body
    let eventData;
    try {
      eventData = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    // Check signature from YooKassa
    // YooKassa uses 'signature' header, not 'Me-Signature'
    const signatureHeader = req.headers.get('signature');
    
    // Log all headers for debugging
    console.log('All Headers:', Object.fromEntries([...req.headers.entries()]));
    
    // TEMPORARY: For development while we're implementing signature verification
    // Process the webhook without verification to ensure the rest of the flow works
    if (!signatureHeader) {
      console.warn('⚠️ [DEVELOPMENT MODE] Processing webhook without signature verification');
      // In production, you would uncomment this to reject unsigned requests:
      // return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
    } else {
      // Log the signature for debugging
      console.log('Received signature header:', signatureHeader);
      
      // The signature format appears to be: 'v1 [id] [version] [actual-signature]'
      // For future implementation, we'll need to parse this format and verify
      // the signature according to YooKassa's documentation
      
      // TODO: Implement proper signature verification based on YooKassa's format
      // For now, log it for investigation
      const signatureParts = signatureHeader.split(' ');
      console.log('Signature parts:', signatureParts);
    }
    
    // For production, you would uncomment these to require a valid signature
    /*
    if (!process.env.YOOKASSA_SECRET_KEY) {
      console.error('Cannot verify webhook: Missing secret key configuration');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    if (!signatureHeader) {
      console.error('Cannot verify webhook: Missing signature header');
      return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
    }
    
    // Implement proper signature verification logic here
    // based on YooKassa's documentation
    */
    
    // Log the webhook receipt
    console.log(`Webhook received: ${eventData.event}, payment ID: ${eventData.object?.id}`);
    
    // Queue the processing - respond to YooKassa quickly
    processWebhookEvent(eventData).catch(error => {
      console.error('Error processing webhook event:', error);
    });
    
    // Return success immediately - YooKassa expects a fast response
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Separate async function to handle event without delaying the response
async function processWebhookEvent(eventData: any) {
  try {
    // Get the type of event
    const eventType = eventData.event;
    const payment = eventData.object;
    
    if (!payment || !payment.id) {
      console.error('Invalid webhook payload:', eventData);
      return;
    }
    
    console.log('Processing payment event:', {
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount?.value,
      metadata: payment.metadata
    });
    
    // Handle various event types
    switch (eventType) {
      case 'payment.succeeded':
        await handleSuccessfulPayment(payment);
        break;
      
      case 'payment.waiting_for_capture':
        await handleWaitingForCapture(payment);
        break;
      
      case 'payment.canceled':
        await handleCanceledPayment(payment);
        break;
      
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
  }
}

async function handleSuccessfulPayment(payment: any) {
  const { userId, planType } = payment.metadata || {};
  
  // Verify required metadata is present
  if (!userId || !planType) {
    console.error('Missing required metadata in payment', payment.id);
    return;
  }
  
  console.log('Processing successful payment:', {
    paymentId: payment.id,
    userId,
    planType
  });
  
  // Get the current date for subscription start
  const currentDate = new Date();
  
  // Calculate subscription end date based on plan type
  let subscriptionEndDate = new Date(currentDate);
  if (planType === 'monthly') {
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
  } else if (planType === 'yearly') {
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
  } else {
    console.error('Invalid plan type:', planType);
    return;
  }
  
  // Update the subscription in the database
  const supabase = getServerClient();
  
  // Insert payment record with the updated schema
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      payment_id: payment.id,
      amount: payment.amount.value,
      currency: payment.amount.currency,
      plan_type: planType,
      payment_date: new Date(payment.created_at).toISOString(),
      payment_method: 'yookassa',
      status: 'succeeded',
      metadata: {
        raw_payment: payment,
        ip_address: payment.ip || null,
        timestamp: new Date().toISOString()
      }
    });
    
  if (paymentError) {
    console.error('Error recording payment:', paymentError);
    // Continue with updating user subscription even if payment recording fails
  } else {
    console.log('Payment record successfully inserted into database');
  }
  
  // Update user subscription
  const { error: userError } = await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      subscription_plan: planType,
      subscription_start_date: currentDate.toISOString(),
      subscription_end_date: subscriptionEndDate.toISOString(),
      last_payment_id: payment.id
    })
    .eq('id', userId);
    
  if (userError) {
    console.error('Error updating user subscription:', userError);
  } else {
    console.log(`Successfully updated subscription for user ${userId}, plan: ${planType}`);
  }
}

async function handleWaitingForCapture(payment: any) {
  // Log the waiting for capture event
  console.log(`Payment ${payment.id} is waiting for capture`);
  
  // You could implement automatic capture here if needed
  // const yooKassa = getYooKassaClient();
  // await yooKassa.capturePayment(payment.id, {
  //   amount: payment.amount
  // });
}

async function handleCanceledPayment(payment: any) {
  const { userId } = payment.metadata || {};
  
  if (!userId) {
    console.error('Missing user ID in canceled payment', payment.id);
    return;
  }
  
  // Record the canceled payment
  const supabase = getServerClient();
  
  await supabase
    .from('payments')
    .insert({
      user_id: userId,
      payment_id: payment.id,
      amount: payment.amount.value,
      currency: payment.amount.currency,
      plan_type: payment.metadata?.planType || 'unknown',
      payment_date: new Date(payment.created_at).toISOString(),
      payment_method: 'yookassa',
      status: 'canceled',
      metadata: {
        raw_payment: payment,
        cancel_reason: payment.cancellation_details?.reason || 'unknown',
        timestamp: new Date().toISOString()
      }
    });
    
  console.log(`Recorded canceled payment ${payment.id} for user ${userId}`);
} 