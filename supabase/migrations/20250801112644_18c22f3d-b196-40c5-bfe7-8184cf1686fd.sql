
-- Fix the standard column issue by ensuring it exists and has proper values
ALTER TABLE public.papers 
ADD COLUMN IF NOT EXISTS standard text;

-- Update existing records to have proper standard values
UPDATE public.papers 
SET standard = CASE 
  WHEN class_level = 'Class X' THEN '10th'
  WHEN class_level = 'Class XI' THEN '11th' 
  WHEN class_level = 'Class XII' THEN '12th'
  ELSE class_level
END
WHERE standard IS NULL OR standard = '';

-- Make sure the column is not nullable for new records
ALTER TABLE public.papers 
ALTER COLUMN standard SET NOT NULL;

-- Set a default value for the standard column
ALTER TABLE public.papers 
ALTER COLUMN standard SET DEFAULT '10th';
