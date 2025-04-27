# Password Recovery Functionality

This document explains how the password recovery functionality works in the РиелторПро application.

## Overview

The password recovery system allows users to reset their password if they have forgotten it. The process is as follows:

1. User clicks "Забыли пароль?" on the login page
2. User enters their email address on the recovery page
3. System sends a recovery link to the user's email
4. User clicks the link and is taken to the reset-password page
5. User enters a new password and confirms it
6. System updates the password and redirects the user to login

## Implementation Details

### Frontend Components

- `app/login/page.tsx` - Contains the "Забыли пароль?" link
- `app/recovery/page.tsx` - Form for entering email to request password reset
- `app/recovery/actions.ts` - Server action for requesting password reset
- `app/reset-password/page.tsx` - Form for entering new password
- `app/reset-password/actions.ts` - Server action for setting new password

### Backend Configuration

The password recovery functionality uses Supabase Auth for secure email delivery and token verification.

#### Required Environment Variables

Make sure these environment variables are set in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://www.xn--e1afkmafcebq.xn--p1ai
```

#### Database Setup

The password recovery system requires a connection between your custom users table and Supabase Auth. A migration file is included at `db/migrations/setup_password_recovery.sql`.

To apply this migration, you can run it manually in the Supabase SQL Editor or use your preferred database migration tool.

The migration adds:
- `auth_user_id` column to your users table
- Functions for linking users with Supabase Auth
- Triggers to maintain synchronization

## Supabase Setup

For the password recovery system to work properly, you need to configure Supabase Auth:

1. Go to your Supabase Dashboard > Authentication > Email Templates
2. Customize the "Password Reset" email template
3. Go to Authentication > URL Configuration
4. Set the Site URL to match your `NEXT_PUBLIC_SITE_URL` variable

## Troubleshooting

If password recovery emails are not being received:

1. Check that the email isn't in the spam folder
2. Verify that the Supabase Auth settings are configured correctly
3. Check that the environment variables are set properly
4. Make sure the database migration has been applied successfully
5. Check the server logs for any errors in the password reset process

## Security Notes

- The system never reveals whether an email exists in the database
- Password reset tokens are time-limited (default 24 hours)
- Passwords are securely hashed before storage
- PKCE flow is used for added security

For more detailed information about the implementation, refer to the source code in the respective files.
