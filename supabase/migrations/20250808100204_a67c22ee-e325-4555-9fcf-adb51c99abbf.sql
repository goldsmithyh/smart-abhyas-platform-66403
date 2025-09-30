-- Create standards table
CREATE TABLE public.standards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  class_level TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exam_types table
CREATE TABLE public.exam_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects_catalog table
CREATE TABLE public.subjects_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects_catalog ENABLE ROW LEVEL SECURITY;

-- Create policies for viewing (public access)
CREATE POLICY "Anyone can view active standards" ON public.standards
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active exam types" ON public.exam_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active subjects catalog" ON public.subjects_catalog
  FOR SELECT USING (is_active = true);

-- Create policies for admin management
CREATE POLICY "Only admins can manage standards" ON public.standards
  FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Only admins can manage exam types" ON public.exam_types
  FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Only admins can manage subjects catalog" ON public.subjects_catalog
  FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_standards_updated_at
  BEFORE UPDATE ON public.standards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_types_updated_at
  BEFORE UPDATE ON public.exam_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_catalog_updated_at
  BEFORE UPDATE ON public.subjects_catalog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default standards
INSERT INTO public.standards (code, label, class_level, display_order) VALUES
('10th', 'दहावी', 'Class X', 1),
('11th', 'अकरावी', 'Class XI', 2),
('12th', 'बारावी', 'Class XII', 3);

-- Insert default exam types
INSERT INTO public.exam_types (code, label, display_order) VALUES
('unit1', 'प्रथम घटक चाचणी परीक्षा', 1),
('term1', 'प्रथम सत्र परीक्षा', 2),
('unit2', 'द्वितीय घटक चाचणी परीक्षा', 3),
('prelim1', 'पूर्व/सराव परीक्षा -१', 4),
('prelim2', 'पूर्व/सराव परीक्षा -२', 5),
('prelim3', 'पूर्व/सराव परीक्षा -३', 6),
('term2', 'द्वितीय सत्र परीक्षा', 7),
('internal', 'अंतर्गत मूल्यमापन परीक्षा', 8),
('chapter', 'प्रकरणानुसार परीक्षा', 9);

-- Insert default subjects
INSERT INTO public.subjects_catalog (name, display_order) VALUES
('English', 1),
('हिंदी', 2),
('मराठी', 3),
('Mathematics', 4),
('Science', 5),
('Social Science', 6),
('Physics', 7),
('Chemistry', 8),
('Biology', 9),
('History', 10),
('Geography', 11),
('Economics', 12),
('Political Science', 13),
('Psychology', 14),
('Sociology', 15);