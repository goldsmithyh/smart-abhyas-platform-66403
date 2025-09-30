/*
  # Add display order to papers table

  1. Changes
    - Add display_order column to papers table
    - Set default values for existing papers
    - Add index for better sorting performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add display_order column to papers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'papers' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE papers ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- Update existing papers with display order based on creation date
UPDATE papers 
SET display_order = row_number() OVER (ORDER BY created_at DESC)
WHERE display_order = 0 OR display_order IS NULL;

-- Create index for better performance when sorting by display order
CREATE INDEX IF NOT EXISTS idx_papers_display_order ON papers(display_order);

-- Create index for better performance when filtering by active status and sorting
CREATE INDEX IF NOT EXISTS idx_papers_active_display_order ON papers(is_active, display_order);