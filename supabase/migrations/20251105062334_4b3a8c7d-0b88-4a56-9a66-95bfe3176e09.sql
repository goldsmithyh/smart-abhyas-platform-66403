-- Create standards table
CREATE TABLE IF NOT EXISTS public.standards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exam_types table
CREATE TABLE IF NOT EXISTS public.exam_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  standard_id UUID REFERENCES public.standards(id),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects_catalog table
CREATE TABLE IF NOT EXISTS public.subjects_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  standard_id UUID REFERENCES public.standards(id),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects_catalog ENABLE ROW LEVEL SECURITY;

-- Create policies for standards
CREATE POLICY "Anyone can view standards" ON public.standards FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage standards" ON public.standards FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);

-- Create policies for exam_types
CREATE POLICY "Anyone can view exam types" ON public.exam_types FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage exam types" ON public.exam_types FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);

-- Create policies for subjects_catalog
CREATE POLICY "Anyone can view subjects" ON public.subjects_catalog FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage subjects" ON public.subjects_catalog FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);

-- Insert standards
INSERT INTO public.standards (code, display_order, is_active) VALUES
  ('10th', 1, true),
  ('11th', 2, true),
  ('12th', 3, true)
ON CONFLICT (code) DO NOTHING;

-- Get the standard IDs
DO $$
DECLARE
  std_10_id UUID;
  std_11_id UUID;
  std_12_id UUID;
BEGIN
  SELECT id INTO std_10_id FROM public.standards WHERE code = '10th';
  SELECT id INTO std_11_id FROM public.standards WHERE code = '11th';
  SELECT id INTO std_12_id FROM public.standards WHERE code = '12th';

  -- Insert exam types for 10th
  INSERT INTO public.exam_types (name, standard_id, display_order, is_active) VALUES
    ('युनिट टेस्ट - 1', std_10_id, 1, true),
    ('पहिली सत्र परीक्षा', std_10_id, 2, true),
    ('युनिट टेस्ट - 2', std_10_id, 3, true),
    ('दुसरी सत्र परीक्षा', std_10_id, 4, true)
  ON CONFLICT DO NOTHING;

  -- Insert exam types for 11th
  INSERT INTO public.exam_types (name, standard_id, display_order, is_active) VALUES
    ('युनिट टेस्ट - 1', std_11_id, 1, true),
    ('पहिली सत्र परीक्षा', std_11_id, 2, true),
    ('युनिट टेस्ट - 2', std_11_id, 3, true),
    ('दुसरी सत्र परीक्षा', std_11_id, 4, true)
  ON CONFLICT DO NOTHING;

  -- Insert exam types for 12th (including the 3 new ones)
  INSERT INTO public.exam_types (name, standard_id, display_order, is_active) VALUES
    ('युनिट टेस्ट - 1', std_12_id, 1, true),
    ('पहिली सत्र परीक्षा', std_12_id, 2, true),
    ('युनिट टेस्ट - 2', std_12_id, 3, true),
    ('पूर्व / सराव परीक्षा - 1', std_12_id, 4, true),
    ('पूर्व / सराव परीक्षा - 2', std_12_id, 5, true),
    ('पूर्व / सराव परीक्षा - 3', std_12_id, 6, true),
    ('फेब्रुवारी / मार्च 2022', std_12_id, 7, true),
    ('फेब्रुवारी / मार्च 2023', std_12_id, 8, true),
    ('फेब्रुवारी / मार्च 2024', std_12_id, 9, true),
    ('दुसरी सत्र परीक्षा', std_12_id, 10, true)
  ON CONFLICT DO NOTHING;
END $$;