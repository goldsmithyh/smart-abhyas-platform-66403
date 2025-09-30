-- Fix mismatched exam_type IDs in papers table
-- The paper has exam_type '9f7b5ce7-4762-4153-88e4-e9cc26d31ddc' but should match current exam_types
-- Update to use the correct exam_type ID for 11th standard, first unit test

UPDATE papers 
SET exam_type = 'b22573ea-1437-40f4-b200-e7eb7e7fec29'
WHERE exam_type = '9f7b5ce7-4762-4153-88e4-e9cc26d31ddc'
  AND standard = '11th';