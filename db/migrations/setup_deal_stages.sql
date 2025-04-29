-- Create client_deal_stages table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_deal_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_deal_stages_client_id ON client_deal_stages(client_id);
CREATE INDEX IF NOT EXISTS idx_client_deal_stages_created_at ON client_deal_stages(created_at);

-- Add a helper function to get the current stage for a client
CREATE OR REPLACE FUNCTION get_current_client_stage(client_id_param UUID)
RETURNS TABLE (
  id UUID,
  client_id UUID,
  stage VARCHAR(50),
  status VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT ds.*
  FROM client_deal_stages ds
  WHERE ds.client_id = client_id_param
  ORDER BY ds.created_at DESC
  LIMIT 1;
END;
$$;

-- Add last_update_date column to clients table if it doesn't exist
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS last_update_date TIMESTAMPTZ; 