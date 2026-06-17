CREATE TABLE public.location_hotspots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  hotspot_type text NOT NULL DEFAULT 'custom',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  radius_meters integer NOT NULL DEFAULT 150,
  visibility text NOT NULL DEFAULT 'hub',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT location_hotspots_type_check CHECK (
    hotspot_type IN ('home', 'school', 'work', 'care', 'custom')
  ),
  CONSTRAINT location_hotspots_visibility_check CHECK (
    visibility IN ('private', 'hub', 'emergency_only')
  ),
  CONSTRAINT location_hotspots_latitude_check CHECK (
    latitude >= -90 AND latitude <= 90
  ),
  CONSTRAINT location_hotspots_longitude_check CHECK (
    longitude >= -180 AND longitude <= 180
  ),
  CONSTRAINT location_hotspots_radius_check CHECK (
    radius_meters BETWEEN 50 AND 2000
  )
);

ALTER TABLE public.location_hotspots ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER location_hotspots_updated_at
  BEFORE UPDATE ON public.location_hotspots
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Users can read own location hotspots"
  ON public.location_hotspots FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));

CREATE POLICY "Users can create own location hotspots"
  ON public.location_hotspots FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));

CREATE POLICY "Users can update own location hotspots"
  ON public.location_hotspots FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()))
  WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));

CREATE POLICY "Users can delete own location hotspots"
  ON public.location_hotspots FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));

CREATE TABLE public.location_presence_states (
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inferred_state text NOT NULL DEFAULT 'unknown',
  status_label text NOT NULL DEFAULT 'Location unknown',
  availability text NOT NULL DEFAULT 'unknown',
  nearest_hotspot_id uuid REFERENCES public.location_hotspots(id) ON DELETE SET NULL,
  nearest_hotspot_name text,
  nearest_hotspot_type text,
  distance_to_hotspot_meters integer,
  speed_kmh double precision,
  dwell_minutes integer NOT NULL DEFAULT 0,
  is_tracking boolean NOT NULL DEFAULT false,
  accuracy_meters double precision,
  last_signal_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (family_id, user_id),
  CONSTRAINT location_presence_state_check CHECK (
    inferred_state IN (
      'at_hotspot_available',
      'resting_available',
      'commuting_unavailable',
      'moving_maybe_unavailable',
      'paused',
      'unknown'
    )
  ),
  CONSTRAINT location_presence_availability_check CHECK (
    availability IN ('available', 'maybe', 'unavailable', 'unknown')
  )
);

ALTER TABLE public.location_presence_states ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER location_presence_states_updated_at
  BEFORE UPDATE ON public.location_presence_states
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Family members can read location presence"
  ON public.location_presence_states FOR SELECT
  TO authenticated
  USING (public.is_family_member(family_id, auth.uid()));

CREATE POLICY "Users can write own location presence"
  ON public.location_presence_states FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));

CREATE POLICY "Users can update own location presence"
  ON public.location_presence_states FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()))
  WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));
