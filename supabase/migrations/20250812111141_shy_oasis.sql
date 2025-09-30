/*
  # Add display_order column to papers table

  1. Changes
    - Add `display_order` column to `papers` table
    - Set default value to 0 for consistency
    - Update existing records to have sequential display order based on creation date

  2. Security
    - No RLS changes needed as existing policies will apply to the new column
*/

-- Add display_order column to papers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'papers' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE papers ADD COLUMN display_order integer DEFAULT 0;
  END IF;
END $$;

-- Update existing records to have sequential display order based on creation date
UPDATE papers 
SET display_order = subquery.row_number 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_number 
  FROM papers
) AS subquery 
WHERE papers.id = subquery.id;