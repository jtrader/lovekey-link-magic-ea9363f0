CREATE TABLE public.quiz_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  taker_name text NOT NULL,
  taker_phone text NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  passed boolean NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  emailed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quiz_submissions TO anon, authenticated;
GRANT ALL ON public.quiz_submissions TO service_role;

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone (quiz takers, incl. anonymous) may submit a result
CREATE POLICY "Anyone can submit a quiz result"
ON public.quiz_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);