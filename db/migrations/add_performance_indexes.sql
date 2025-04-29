-- Add performance optimization indexes to improve query performance

-- Clients table indexes
CREATE INDEX IF NOT EXISTS idx_clients_agent_id ON clients(agent_id);
CREATE INDEX IF NOT EXISTS idx_clients_agent_last_contact ON clients(agent_id, last_contact_date DESC);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_full_name ON clients(full_name);
CREATE INDEX IF NOT EXISTS idx_clients_lead_source ON clients(lead_source);

-- Properties table indexes
CREATE INDEX IF NOT EXISTS idx_properties_collection_id ON properties(collection_id);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_rooms ON properties(rooms);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_property_status ON properties(property_status);

-- Property collections table indexes 
CREATE INDEX IF NOT EXISTS idx_property_collections_user_id ON property_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_property_collections_is_public ON property_collections(is_public);

-- Property images table indexes
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_status, trial_start_time);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Client deal stages table indexes
CREATE INDEX IF NOT EXISTS idx_client_deal_stages_client_id ON client_deal_stages(client_id);
CREATE INDEX IF NOT EXISTS idx_client_deal_stages_stage ON client_deal_stages(stage);
CREATE INDEX IF NOT EXISTS idx_client_deal_stages_status ON client_deal_stages(status);
CREATE INDEX IF NOT EXISTS idx_client_deal_stages_created_at ON client_deal_stages(created_at DESC);

-- Client property matches table indexes
CREATE INDEX IF NOT EXISTS idx_client_property_matches_client_id ON client_property_matches(client_id);
CREATE INDEX IF NOT EXISTS idx_client_property_matches_property_id ON client_property_matches(property_id);
CREATE INDEX IF NOT EXISTS idx_client_property_matches_status ON client_property_matches(status);
CREATE INDEX IF NOT EXISTS idx_client_property_matches_sent_date ON client_property_matches(sent_date DESC);

-- Client notes table indexes
CREATE INDEX IF NOT EXISTS idx_client_notes_client_id ON client_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_client_notes_created_at ON client_notes(created_at DESC);

-- Client tasks table indexes
CREATE INDEX IF NOT EXISTS idx_client_tasks_client_id ON client_tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_client_tasks_due_date ON client_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_client_tasks_is_completed ON client_tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_client_tasks_task_type ON client_tasks(task_type);

-- Client preferences table indexes
CREATE INDEX IF NOT EXISTS idx_client_preferences_client_id ON client_preferences(client_id);
CREATE INDEX IF NOT EXISTS idx_client_preferences_area_range ON client_preferences(area_min, area_max);
CREATE INDEX IF NOT EXISTS idx_client_preferences_rooms_range ON client_preferences(rooms_min, rooms_max);

-- Client locations table indexes
CREATE INDEX IF NOT EXISTS idx_client_locations_client_id ON client_locations(client_id);
CREATE INDEX IF NOT EXISTS idx_client_locations_location_name ON client_locations(location_name);

-- Client features table indexes
CREATE INDEX IF NOT EXISTS idx_client_features_client_id ON client_features(client_id);
CREATE INDEX IF NOT EXISTS idx_client_features_feature_name ON client_features(feature_name);

-- Client deal requests table indexes
CREATE INDEX IF NOT EXISTS idx_client_deal_requests_client_id ON client_deal_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_client_deal_requests_real_estate_type ON client_deal_requests(real_estate_type);
CREATE INDEX IF NOT EXISTS idx_client_deal_requests_budget_range ON client_deal_requests(budget_min, budget_max);

-- Add comments about index maintenance and usage
COMMENT ON INDEX idx_clients_agent_id IS 'Performance optimization index for quickly retrieving agent clients';
COMMENT ON INDEX idx_clients_agent_last_contact IS 'Improves performance of sorting clients by last contact date';
COMMENT ON INDEX idx_properties_collection_id IS 'Performance optimization index for retrieving properties in a collection';
COMMENT ON INDEX idx_property_collections_user_id IS 'Performance optimization index for quickly retrieving user collections';
COMMENT ON INDEX idx_users_subscription IS 'Performance optimization index for subscription status checks';
COMMENT ON INDEX idx_client_tasks_due_date IS 'Improves performance of sorting and filtering tasks by due date';
COMMENT ON INDEX idx_client_property_matches_status IS 'Improves filtering of property matches by status';

-- Performance optimization for full-text search (if PostgreSQL 12+)
CREATE INDEX IF NOT EXISTS idx_properties_description_tsvector ON properties USING GIN (to_tsvector('russian', description));
CREATE INDEX IF NOT EXISTS idx_properties_address_tsvector ON properties USING GIN (to_tsvector('russian', address));

-- Partial indexes for common filter patterns
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(id) WHERE property_status = 'active';
CREATE INDEX IF NOT EXISTS idx_client_tasks_pending ON client_tasks(due_date) WHERE is_completed = false;
CREATE INDEX IF NOT EXISTS idx_client_property_matches_unviewed ON client_property_matches(client_id) WHERE status = 'sent'; 