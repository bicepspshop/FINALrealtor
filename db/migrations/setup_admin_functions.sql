-- Create function to check database structure

-- Function to check database structure and return status
CREATE OR REPLACE FUNCTION check_database_structure()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB := '{}'::JSONB;
  missing_tables TEXT[] := '{}'::TEXT[];
  missing_columns JSONB := '{}'::JSONB;
  required_columns JSONB;
  table_columns TEXT[];
  column_name TEXT;
  current_table TEXT;
BEGIN
  -- Define required tables and their columns
  required_columns := '{
    "users": ["id", "name", "email", "password", "phone", "is_admin", "subscription_status", "subscription_plan", "subscription_start_date", "subscription_end_date"],
    "collections": ["id", "name", "user_id", "share_id", "created_at"],
    "properties": ["id", "collection_id", "property_type", "address", "rooms", "area", "price", "property_status"],
    "payments": ["id", "user_id", "payment_id", "amount", "currency", "plan_type", "payment_date", "status"],
    "clients": ["id", "full_name", "agent_id", "phone", "email"]
  }'::JSONB;
  
  -- Check each required table
  FOR current_table IN SELECT jsonb_object_keys(required_columns)
  LOOP
    -- Check if table exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = current_table
    ) THEN
      missing_tables := array_append(missing_tables, current_table);
      CONTINUE;
    END IF;
    
    -- Get existing columns for the table
    SELECT array_agg(column_name) INTO table_columns
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = current_table;
    
    -- Check each required column
    FOR column_name IN SELECT jsonb_array_elements_text(required_columns->current_table)
    LOOP
      IF NOT column_name = ANY(table_columns) THEN
        IF missing_columns ? current_table THEN
          missing_columns := jsonb_set(
            missing_columns,
            ARRAY[current_table],
            (missing_columns->>current_table)::jsonb || jsonb_build_array(column_name)
          );
        ELSE
          missing_columns := jsonb_set(
            missing_columns,
            ARRAY[current_table],
            jsonb_build_array(column_name)
          );
        END IF;
      END IF;
    END LOOP;
  END LOOP;
  
  -- Build result JSON
  result := jsonb_build_object(
    'status', CASE 
                WHEN array_length(missing_tables, 1) > 0 OR jsonb_object_keys(missing_columns) <> '{}' 
                THEN 'incomplete' 
                ELSE 'complete' 
              END,
    'missing_tables', missing_tables,
    'missing_columns', missing_columns,
    'timestamp', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
  );
  
  RETURN result;
END;
$$;

-- Function to extend user subscription by specified days
CREATE OR REPLACE FUNCTION extend_user_subscription(user_id_param UUID, days_to_add INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  subscription_end TIMESTAMPTZ;
BEGIN
  -- Get current subscription end date
  SELECT subscription_end_date INTO subscription_end
  FROM users
  WHERE id = user_id_param;
  
  -- If no subscription end date, use current date
  IF subscription_end IS NULL THEN
    subscription_end := NOW();
  END IF;
  
  -- If subscription already ended, use current date instead
  IF subscription_end < NOW() THEN
    subscription_end := NOW();
  END IF;
  
  -- Update user subscription
  UPDATE users
  SET 
    subscription_status = 'active',
    subscription_end_date = subscription_end + (days_to_add || ' days')::INTERVAL
  WHERE id = user_id_param;
  
  RETURN FOUND;
END;
$$; 