-- Add multiple image support for properties

-- Rename the existing columns to floor_plan_url1, interior_finish_url1, window_view_url1
ALTER TABLE properties
RENAME COLUMN floor_plan_url TO floor_plan_url1;

ALTER TABLE properties
RENAME COLUMN interior_finish_url TO interior_finish_url1;

ALTER TABLE properties
RENAME COLUMN window_view_url TO window_view_url1;

-- Add new columns for additional images
ALTER TABLE properties
ADD COLUMN floor_plan_url2 VARCHAR;

ALTER TABLE properties
ADD COLUMN floor_plan_url3 VARCHAR;

ALTER TABLE properties
ADD COLUMN interior_finish_url2 VARCHAR;

ALTER TABLE properties
ADD COLUMN interior_finish_url3 VARCHAR;

ALTER TABLE properties
ADD COLUMN window_view_url2 VARCHAR;

ALTER TABLE properties
ADD COLUMN window_view_url3 VARCHAR;

-- Add comments for documentation
COMMENT ON COLUMN properties.floor_plan_url1 IS 'URL for the first floor plan image';
COMMENT ON COLUMN properties.floor_plan_url2 IS 'URL for the second floor plan image';
COMMENT ON COLUMN properties.floor_plan_url3 IS 'URL for the third floor plan image';

COMMENT ON COLUMN properties.interior_finish_url1 IS 'URL for the first interior finish image';
COMMENT ON COLUMN properties.interior_finish_url2 IS 'URL for the second interior finish image';
COMMENT ON COLUMN properties.interior_finish_url3 IS 'URL for the third interior finish image';

COMMENT ON COLUMN properties.window_view_url1 IS 'URL for the first window view image';
COMMENT ON COLUMN properties.window_view_url2 IS 'URL for the second window view image';
COMMENT ON COLUMN properties.window_view_url3 IS 'URL for the third window view image'; 