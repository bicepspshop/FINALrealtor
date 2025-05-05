# Database Setup for РиелторПро

## Database Structure and Required Columns

The application requires the following tables and columns:

### Users Table

The `users` table must have the following columns:
- `id` - Primary key (UUID)
- `name` - The agent's full name (VARCHAR)
- `email` - The agent's email (VARCHAR)
- `password` - Hashed password (VARCHAR)
- `phone` - The agent's phone number (VARCHAR)

## Common Issues and Solutions

### Missing 'phone' Column

If you encounter an error like "Could not find the 'phone' column of 'users' in the schema cache", you need to add the column to your database.

#### Solution 1: Automatic Fix (Recommended)

1. Log in to your account
2. Go to the Profile page (/profile)
3. If there's an error loading the profile, click the "Update Database Structure" button

#### Solution 2: Manual Database Update

Run the following SQL in your Supabase SQL Editor:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(255);
```

## Important Notes

1. The application uses a single `name` field for the agent's full name, not separate first and last name fields.

2. All database columns are case-sensitive, so ensure they are named exactly as specified.

3. If you continue to experience database issues after following these solutions, you can check the server logs for more detailed error messages.

## SQL Migrations

If you need to reset or set up the database from scratch, use the following SQL scripts:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(255)
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  share_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  property_type VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  rooms INTEGER,
  area NUMERIC(10, 2) NOT NULL,
  price NUMERIC(16, 2) NOT NULL,
  description TEXT,
  living_area NUMERIC(10, 2),
  floor INTEGER,
  total_floors INTEGER,
  balcony BOOLEAN DEFAULT false,
  year_built INTEGER,
  renovation_type VARCHAR(50),
  bathroom_count INTEGER,
  has_parking BOOLEAN DEFAULT false,
  property_status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Payment System

### Payments Table Structure

The application's payment system uses the following database structure:

#### Payments Table

The `payments` table has the following columns:
- `id` - Primary key (UUID)
- `user_id` - Foreign key references users(id)
- `payment_id` - YooKassa payment identifier (VARCHAR)
- `amount` - Payment amount (NUMERIC)
- `currency` - Payment currency, default 'RUB' (VARCHAR)
- `plan_type` - Subscription plan type: 'monthly' or 'yearly' (VARCHAR)
- `payment_date` - When payment was processed (TIMESTAMPTZ)
- `payment_method` - Payment processor, e.g., 'yookassa' (VARCHAR)
- `status` - Payment status: 'succeeded', 'canceled', 'pending' (VARCHAR)
- `metadata` - Additional payment data (JSONB)

#### User Subscription Fields

The `users` table has the following subscription-related columns:
- `subscription_status` - 'trial', 'active', 'expired', or 'cancelled' (VARCHAR)
- `subscription_plan` - 'monthly' or 'yearly' (VARCHAR)
- `subscription_start_date` - When current subscription started (TIMESTAMPTZ)
- `subscription_end_date` - When current subscription will end (TIMESTAMPTZ)
- `last_payment_id` - ID of the last successful payment (VARCHAR)
- `trial_start_time` - When user's trial started (TIMESTAMPTZ)
- `trial_duration_minutes` - Duration of trial period in minutes (INTEGER)

### Database Functions

The system includes these helper functions:
- `is_subscription_active(user_id)` - Checks if a user's subscription is active

### Setting Up the Payment System

If the payment system tables are not yet set up, you can apply the migration:

1. First, set an administrator user:

```sql
UPDATE users SET is_admin = true WHERE email = 'your-admin-email@example.com';
```

2. Then navigate to `/dashboard/admin/migration` in the application and apply the migrations.

Alternatively, run these SQL commands directly:

```sql
-- First, set up the run_sql function
\i db/migrations/setup_run_sql_function.sql

-- Then, set up the payments table
\i db/migrations/setup_payments_table.sql
```
