
-- Add pdf-lib dependency for PDF processing
-- This will be handled in the code block

-- Update papers table to better match the interface structure
ALTER TABLE public.papers 
ADD COLUMN IF NOT EXISTS standard text,
ADD COLUMN IF NOT EXISTS paper_file_path text;

-- Update existing data to match new structure
UPDATE public.papers 
SET standard = CASE 
  WHEN class_level = 'Class X' THEN '10th'
  WHEN class_level = 'Class XI' THEN '11th' 
  WHEN class_level = 'Class XII' THEN '12th'
  ELSE class_level
END
WHERE standard IS NULL;

-- Update exam types to match the interface
UPDATE public.papers 
SET exam_type = CASE
  WHEN exam_type = 'Unit Test Exam' THEN 'unit1'
  WHEN exam_type = 'First Term Exam' THEN 'term1' 
  WHEN exam_type = 'Internal Evaluation Exam' THEN 'unit2'
  WHEN exam_type = 'Second Term Exam' THEN 'final'
  WHEN exam_type = 'Prelim/Practice Exam' THEN 'final'
  ELSE exam_type
END;

-- Update paper types to match interface
UPDATE public.papers 
SET paper_type = CASE
  WHEN paper_type = 'question' THEN 'question_paper'
  WHEN paper_type = 'answer' THEN 'answer_paper'
  ELSE paper_type
END;

-- Create an index for better performance when fetching subjects by class and exam
CREATE INDEX IF NOT EXISTS idx_papers_class_exam_subject ON public.papers(class_level, exam_type, subject);
