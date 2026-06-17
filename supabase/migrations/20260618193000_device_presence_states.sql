CREATE TABLE public.device_presence_states (
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_state text NOT NULL DEFAULT 'unknown',
  manual_state text,
  manual_until timestamptz,
  last_heartbeat_at timestamptz,
  last_interaction_at timestamptz,
  visibility_state text NOT NULL DEFAULT 'unknown',
  is_idle boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (family_id, user_id),
  CONSTRAINT device_presence_auto_state_check CHECK (
    auto_state IN (
      'active_now',
      'recently_seen',
      'away_or_locked',
      'offline_or_unreachable',
      'unknown'
    )
  ),
  CONSTRAINT device_presence_manual_state_check CHECK (
    manual_state IS NULL OR manual_state IN (
      'active_now',
      'recently_seen',
      'away_or_locked',
      'offline_or_unreachable',
      'unknown'
    )
  )
);

ALTER TABLE public.device_presence_states ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER device_presence_states_updated_at
  BEFORE UPDATE ON public.device_presence_states
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Family members can read device presence"
  ON public.device_presence_states FOR SELECT
  TO authenticated
  USING (public.is_family_member(family_id, auth.uid()));

CREATE POLICY "Users can write own device presence"
  ON public.device_presence_states FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));

CREATE POLICY "Users can update own device presence"
  ON public.device_presence_states FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()))
  WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));
