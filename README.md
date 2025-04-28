# Subscription System Implementation

This document explains how to implement the trial period subscription system in РиелторПро.

## Overview

The subscription system provides a 14-day trial period for new users. After this period expires, users will need to purchase a subscription to continue using the platform.

## Features

- 14-day trial period for new users
- Trial period countdown timer shown on dashboard
- Restricted access after trial expiration
- Subscription management page
- Middleware protection for expired subscriptions
- Automatic deactivation of share links for expired users
- Real-time subscription status checking for open share links

## Implementation Steps

### 1. Database Migration

Apply the SQL migration to add subscription-related fields to the users table:

```sql
-- Run in Supabase SQL Editor
-- db/migrations/add_subscription_fields.sql

-- Add subscription-related fields to users table

-- Add trial_start_time column (when user registered)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS trial_start_time TIMESTAMPTZ DEFAULT NOW();

-- Add trial_duration_minutes column (default 14 days = 20160 minutes)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS trial_duration_minutes INTEGER DEFAULT 20160;

-- Add subscription_status column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'trial';

-- Comment on subscription_status column for documentation
COMMENT ON COLUMN users.subscription_status IS 'Possible values: trial, expired, active, cancelled';
```

### 2. Update Existing Users (Optional)

If you have existing users that should be converted to an active subscription status:

```sql
-- Run in Supabase SQL Editor
UPDATE users
SET subscription_status = 'active'
WHERE subscription_status IS NULL;
```

### 3. Configure Trial Duration

The default trial period is set to 14 days (20160 minutes). To change this period:

```sql
-- Change trial duration to different value (e.g., 1 day = 1440 minutes)
UPDATE users
SET trial_duration_minutes = 1440
WHERE subscription_status = 'trial';
```

### 4. Testing the Trial System

For testing purposes, you may want to set a shorter trial period:

```sql
-- Set a short trial period for your test account
UPDATE users
SET trial_duration_minutes = 5, -- 5 minutes
    trial_start_time = NOW()
WHERE email = 'your-test-email@example.com';
```

### 5. Setting Up Scheduled Trial Expiration Updates

To ensure that expired trials are updated in the database automatically, set up a cron job to call the update-expired-trials API endpoint:

```bash
# Example cron job to run every hour
0 * * * * curl -X GET https://www.xn--e1afkmafcebq.xn--p1ai/api/update-expired-trials -H "Authorization: Bearer YOUR_CRON_SECRET_KEY"
```

Add the CRON_SECRET_KEY to your environment variables:

```env
CRON_SECRET_KEY=your-secure-random-string
```

This job will find all users whose trial has expired and update their subscription_status to 'expired'.

## Share Links Management

Share links are automatically deactivated when a user's subscription expires. The system works as follows:

1. When a share link is accessed, middleware checks the subscription status of the collection owner
2. If the owner's trial has expired or subscription is cancelled, visitors are redirected to an expiration page
3. To reactivate share links, the user must purchase a subscription

### Real-time Subscription Status Checking

The system also includes real-time checking for share links that are already open in a client's browser:

1. A client-side component monitors the subscription status of the collection owner while the page is open
2. Every minute, it sends a request to verify that the owner's subscription is still active
3. If the subscription expires during the session, the client is automatically redirected to the expiration page

This ensures that even if a client has already opened a collection when the agent's trial expires, they will be redirected to the expiration page after the next status check (within one minute). This prevents clients from continuing to access collections from expired accounts.

## Extending The System

### Payment Integration

To implement payment integration in the future:

1. Create a new payment table to store transaction records
2. Add API endpoints for payment processing
3. Update the `subscription_status` when payment is successful

### Subscription Plans

To implement multiple subscription plans:

1. Create a new plans table with different tiers
2. Add a plan_id reference to the users table
3. Customize the UI based on the user's plan

## Technical Details

- The trial status is checked using the `lib/subscription.ts` helper functions
- Middleware enforces subscription status on protected routes
- The subscription banner component displays the trial status to users 

SELECT 
  email, 
  trial_start_time, 
  trial_duration_minutes, 
  subscription_status,
  NOW() as current_time,
  (trial_start_time + (trial_duration_minutes * interval '1 minute')) as expiry_time
FROM users 
WHERE email = 'your-test-email@example.com'; 