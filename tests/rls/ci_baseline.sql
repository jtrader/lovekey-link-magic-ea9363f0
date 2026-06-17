-- CI-only baseline for the RLS regression suite.
--
-- presence_states and family_presence were created outside the captured
-- migration history, so a clean `supabase db reset` against supabase/migrations
-- alone has no table for the later policy migrations to attach to. The CI
-- workflow copies this file into supabase/migrations with a name that sorts
-- AFTER the families table is created (20260510183205_*) but BEFORE the policy
-- migrations (20260615183615_*), making the local migration chain
-- self-contained. It is never applied to the live database.

CREATE TABLE IF NOT EXISTS public.presence_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  family_id uuid NOT NULL REFERENCES public.families(id),
  node_id text NOT NULL,
  status text NOT NULL,
  mood_ring text NOT NULL,
  label text NOT NULL,
  needs_support boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, family_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.presence_states TO authenticated;
GRANT ALL ON public.presence_states TO service_role;
ALTER TABLE public.presence_states ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.family_presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id),
  health text NOT NULL,
  status_line text NOT NULL,
  support_needed_count integer NOT NULL DEFAULT 0,
  active_member_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_presence TO authenticated;
GRANT ALL ON public.family_presence TO service_role;
ALTER TABLE public.family_presence ENABLE ROW LEVEL SECURITY;
