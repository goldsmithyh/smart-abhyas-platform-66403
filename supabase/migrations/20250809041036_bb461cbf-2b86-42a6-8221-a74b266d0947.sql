-- Enable RLS on tables that are missing it
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standards ENABLE ROW LEVEL SECURITY;