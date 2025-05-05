import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscription-service';
import { getServerClient } from '@/lib/supabase';
import { getYooKassaClient } from '@/lib/payment/yookassa-client';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Clone the request to read the body text twice (once for verification, once for processing)
    const clonedReq = req.clone();
    const bodyText = await clonedReq.text();
    
    // Check signature from YooKassa
    const signature = req.headers.get('Me-Signature');
    if (!process.env.YOOKASSA_SECRET_KEY || !signature) {
      console.error('Webhook error: Missing signature or secret key');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Verify the signature (important security step)
    const hmac = crypto.createHmac('sha256', process.env.YOOKASSA_SECRET_KEY);
    hmac.update(bodyText);
    const calculatedSignature = hmac.digest('base64');
    
    if (signature !== calculatedSignature) {
      console.error('Webhook error: Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Parse the JSON body
    const eventData = JSON.parse(bodyText);
    
    // Log the webhook receipt immediately
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
    console.log(`Successfully processed payment ${payment.id} for user ${userId}, plan: ${planType}`);
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