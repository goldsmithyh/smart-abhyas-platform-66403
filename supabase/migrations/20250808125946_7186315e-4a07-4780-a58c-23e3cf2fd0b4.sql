
-- First, let's add a standard_id column to the subjects_catalog table to associate subjects with standards
ALTER TABLE public.subjects_catalog ADD COLUMN standard_id UUID REFERENCES public.standards(id);

-- Insert the predefined subjects for 10th standard
INSERT INTO public.subjects_catalog (name, display_order, standard_id, is_active)
SELECT 
  subject_name,
  subject_order,
  s.id,
  true
FROM (
  VALUES 
    ('मराठी', 1),
    ('हिंदी', 2),
    ('इंग्रजी', 3),
    ('इतिहास', 4),
    ('भूगोल', 5),
    ('गणित - 1', 6),
    ('गणित - 2', 7),
    ('विज्ञान व तंत्रज्ञान - 1', 8),
    ('विज्ञान व तंत्रज्ञान - 2', 9),
    ('Mathematics - 1', 10),
    ('Mathematics - 2', 11),
    ('Science - 1', 12),
    ('Science - 2', 13)
) AS subjects(subject_name, subject_order)
CROSS JOIN public.standards s
WHERE s.code = '10th';

-- Insert the predefined subjects for 11th and 12th standards
INSERT INTO public.subjects_catalog (name, display_order, standard_id, is_active)
SELECT 
  subject_name,
  subject_order,
  s.id,
  true
FROM (
  VALUES 
    ('मराठी', 1),
    ('हिंदी', 2),
    ('इंग्रजी', 3),
    ('इतिहास', 4),
    ('भूगोल', 5),
    ('राज्यशास्त्र', 6),
    ('समाजशास्त्र', 7),
    ('शिक्षणशास्त्र', 8),
    ('मानसशास्त्र', 9),
    ('अर्थशास्त्र', 10),
    ('सहकार', 11),
    ('चिटणीस कार्यपद्धती', 12),
    ('वाणिज्य संघटन', 13),
    ('ACCOUNT', 14),
    ('PHYSICS', 15),
    ('CHEMISTRY', 16),
    ('BIOLOGY', 17),
    ('MATHS', 18),
    ('I.T.', 19),
    ('GEOGRAPHY', 20),
    ('ECONOMICS', 21),
    ('S.P.', 22),
    ('O.C.M', 23)
) AS subjects(subject_name, subject_order)
CROSS JOIN public.standards s
WHERE s.code IN ('11th', '12th');
