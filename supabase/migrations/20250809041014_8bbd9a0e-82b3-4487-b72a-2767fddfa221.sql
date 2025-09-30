-- Create pricing entries for papers that don't have them yet
INSERT INTO public.paper_pricing (paper_id, price, is_free)
SELECT p.id, 0, true 
FROM public.papers p
LEFT JOIN public.paper_pricing pp ON p.id = pp.paper_id
WHERE pp.paper_id IS NULL;