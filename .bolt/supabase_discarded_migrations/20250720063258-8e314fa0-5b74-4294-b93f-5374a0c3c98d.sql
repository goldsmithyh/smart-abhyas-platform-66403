
-- Create table for storing question/answer papers
CREATE TABLE public.papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  paper_type TEXT NOT NULL CHECK (paper_type IN ('question', 'answer')),
  class_level TEXT NOT NULL CHECK (class_level IN ('Class X', 'Class XI', 'Class XII')),
  exam_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create table for admin users
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for download logs
CREATE TABLE public.download_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paper_id UUID REFERENCES public.papers NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  school_name TEXT,
  mobile TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for papers table
CREATE POLICY "Anyone can view active papers" 
  ON public.papers 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can manage papers" 
  ON public.papers 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for admin_users table
CREATE POLICY "Admins can view admin users" 
  ON public.admin_users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage admin users" 
  ON public.admin_users 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Create policies for download_logs table
CREATE POLICY "Admins can view download logs" 
  ON public.download_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert download logs" 
  ON public.download_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Create trigger for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_papers_updated_at 
  BEFORE UPDATE ON public.papers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample subjects for different classes and exams
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  class_level TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subjects" 
  ON public.subjects 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage subjects" 
  ON public.subjects 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Insert sample subjects for Class X
INSERT INTO public.subjects (name, class_level, exam_type, display_order) VALUES
('मराठी', 'Class X', 'Unit Test Exam', 1),
('हिंदी', 'Class X', 'Unit Test Exam', 2),
('English', 'Class X', 'Unit Test Exam', 3),
('गणित', 'Class X', 'Unit Test Exam', 4),
('विज्ञान', 'Class X', 'Unit Test Exam', 5),
('सामाजिक विज्ञान', 'Class X', 'Unit Test Exam', 6);

-- Insert sample subjects for Class XI
INSERT INTO public.subjects (name, class_level, exam_type, display_order) VALUES
('मराठी', 'Class XI', 'Unit Test Exam', 1),
('हिंदी', 'Class XI', 'Unit Test Exam', 2),
('English', 'Class XI', 'Unit Test Exam', 3),
('भौतिकशास्त्र', 'Class XI', 'Unit Test Exam', 4),
('रसायनशास्त्र', 'Class XI', 'Unit Test Exam', 5),
('जीवशास्त्र', 'Class XI', 'Unit Test Exam', 6),
('गणित', 'Class XI', 'Unit Test Exam', 7);

-- Insert sample subjects for Class XII
INSERT INTO public.subjects (name, class_level, exam_type, display_order) VALUES
('मराठी', 'Class XII', 'Unit Test Exam', 1),
('हिंदी', 'Class XII', 'Unit Test Exam', 2),
('English', 'Class XII', 'Unit Test Exam', 3),
('भौतिकशास्त्र', 'Class XII', 'Unit Test Exam', 4),
('रसायनशास्त्र', 'Class XII', 'Unit Test Exam', 5),
('जीवशास्त्र', 'Class XII', 'Unit Test Exam', 6),
('गणित', 'Class XII', 'Unit Test Exam', 7);
