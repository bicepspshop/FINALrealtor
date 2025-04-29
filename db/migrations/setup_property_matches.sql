-- Create client_property_matches table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_property_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'sent',
  notes TEXT,
  sent_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_property_matches_client_id ON client_property_matches(client_id);
CREATE INDEX IF NOT EXISTS idx_client_property_matches_property_id ON client_property_matches(property_id);
CREATE INDEX IF NOT EXISTS idx_client_property_matches_status ON client_property_matches(status);

-- Add a unique constraint to prevent duplicate matches
ALTER TABLE client_property_matches 
  DROP CONSTRAINT IF EXISTS unique_client_property;
  
ALTER TABLE client_property_matches 
  ADD CONSTRAINT unique_client_property UNIQUE (client_id, property_id);

-- Add RLS policies for security
ALTER TABLE client_property_matches ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users can view their own client matches" ON client_property_matches;
DROP POLICY IF EXISTS "Users can insert their own client matches" ON client_property_matches;
DROP POLICY IF EXISTS "Users can update their own client matches" ON client_property_matches;
DROP POLICY IF EXISTS "Users can delete their own client matches" ON client_property_matches;

-- Create policies for authenticated access
CREATE POLICY "Users can view their own client matches" 
  ON client_property_matches FOR SELECT 
  USING (client_id IN (SELECT id FROM clients WHERE agent_id = auth.uid()));

CREATE POLICY "Users can insert their own client matches" 
  ON client_property_matches FOR INSERT 
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE agent_id = auth.uid()));

CREATE POLICY "Users can update their own client matches" 
  ON client_property_matches FOR UPDATE 
  USING (client_id IN (SELECT id FROM clients WHERE agent_id = auth.uid()));

CREATE POLICY "Users can delete their own client matches" 
  ON client_property_matches FOR DELETE 
  USING (client_id IN (SELECT id FROM clients WHERE agent_id = auth.uid())); 