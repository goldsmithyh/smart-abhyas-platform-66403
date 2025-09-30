-- First, let's get the standard IDs and then create/update exam types for each standard

-- Clear existing exam types to start fresh
DELETE FROM exam_types;

-- Get standard IDs and insert exam types for each standard
WITH standard_ids AS (
  SELECT id, code FROM standards WHERE code IN ('10th', '11th', '12th')
)

-- Insert exam types for 10th standard
INSERT INTO exam_types (name, standard_id, display_order, is_active) 
SELECT 'प्रथम घटक चाचणी परीक्षा', s.id, 1, true FROM standard_ids s WHERE s.code = '10th'
UNION ALL
SELECT 'प्रथम सत्र परीक्षा', s.id, 2, true FROM standard_ids s WHERE s.code = '10th'
UNION ALL
SELECT 'द्वितीय घटक चाचणी परीक्षा', s.id, 3, true FROM standard_ids s WHERE s.code = '10th'
UNION ALL
SELECT 'पूर्व / सराव परीक्षा - 1', s.id, 4, true FROM standard_ids s WHERE s.code = '10th'
UNION ALL
SELECT 'पूर्व / सराव परीक्षा - 2', s.id, 5, true FROM standard_ids s WHERE s.code = '10th'
UNION ALL
SELECT 'पूर्व / सराव परीक्षा - 3', s.id, 6, true FROM standard_ids s WHERE s.code = '10th'

-- Insert exam types for 11th standard
UNION ALL
SELECT 'प्रथम घटक चाचणी परीक्षा', s.id, 1, true FROM standard_ids s WHERE s.code = '11th'
UNION ALL
SELECT 'प्रथम सत्र परीक्षा', s.id, 2, true FROM standard_ids s WHERE s.code = '11th'
UNION ALL
SELECT 'द्वितीय घटक चाचणी परीक्षा', s.id, 3, true FROM standard_ids s WHERE s.code = '11th'
UNION ALL
SELECT 'अंतर्गत मूल्यमापन परीक्षा', s.id, 4, true FROM standard_ids s WHERE s.code = '11th'
UNION ALL
SELECT 'द्वितीय सत्र परीक्षा', s.id, 5, true FROM standard_ids s WHERE s.code = '11th'

-- Insert exam types for 12th standard
UNION ALL
SELECT 'प्रथम घटक चाचणी परीक्षा', s.id, 1, true FROM standard_ids s WHERE s.code = '12th'
UNION ALL
SELECT 'प्रथम सत्र परीक्षा', s.id, 2, true FROM standard_ids s WHERE s.code = '12th'
UNION ALL
SELECT 'द्वितीय घटक चाचणी परीक्षा', s.id, 3, true FROM standard_ids s WHERE s.code = '12th'
UNION ALL
SELECT 'पूर्व / सराव परीक्षा - 1', s.id, 4, true FROM standard_ids s WHERE s.code = '12th'
UNION ALL
SELECT 'पूर्व / सराव परीक्षा - 2', s.id, 5, true FROM standard_ids s WHERE s.code = '12th'
UNION ALL
SELECT 'पूर्व / सराव परीक्षा - 3', s.id, 6, true FROM standard_ids s WHERE s.code = '12th'
UNION ALL
SELECT 'अंतर्गत मूल्यमापन परीक्षा', s.id, 7, true FROM standard_ids s WHERE s.code = '12th'
UNION ALL
SELECT 'प्रकरणांनुसार परीक्षा', s.id, 8, true FROM standard_ids s WHERE s.code = '12th';