ALTER TABLE public.quiz_submissions
  ADD COLUMN IF NOT EXISTS share_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS share_expires_at timestamptz;

CREATE INDEX IF NOT EXISTS quiz_submissions_share_token_idx
  ON public.quiz_submissions (share_token);