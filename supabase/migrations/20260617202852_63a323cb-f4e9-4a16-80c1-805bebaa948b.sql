-- =====================================================================
-- Recovery migration: activate Hub feature tables/columns that were
-- authored but never applied to the live DB (app code already uses them).
-- Idempotent and includes the GRANTs the original drafts omitted.
-- =====================================================================

-- ---------- families: hub type + visibility + location ----------
ALTER TABLE public.families
  ADD COLUMN IF NOT EXISTS hub_type text NOT NULL DEFAULT 'immediate_family',
  ADD COLUMN IF NOT EXISTS hub_visibility text NOT NULL DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS public_join_mode text NOT NULL DEFAULT 'invite',
  ADD COLUMN IF NOT EXISTS public_password_hash text,
  ADD COLUMN IF NOT EXISTS location_label text,
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS location_accuracy_meters double precision,
  ADD COLUMN IF NOT EXISTS location_captured_at timestamptz;

ALTER TABLE public.families DROP CONSTRAINT IF EXISTS families_hub_type_check;
ALTER TABLE public.families ADD CONSTRAINT families_hub_type_check CHECK (
  hub_type IN ('immediate_family','birth_family','blended_family','co_parenting',
    'elder_care','sporting_group','book_club','corporate_team','recovery_circle')
);
ALTER TABLE public.families DROP CONSTRAINT IF EXISTS families_hub_visibility_check;
ALTER TABLE public.families ADD CONSTRAINT families_hub_visibility_check CHECK (
  hub_visibility IN ('private','public')
);
ALTER TABLE public.families DROP CONSTRAINT IF EXISTS families_public_join_mode_check;
ALTER TABLE public.families ADD CONSTRAINT families_public_join_mode_check CHECK (
  public_join_mode IN ('invite','open','password')
);
ALTER TABLE public.families DROP CONSTRAINT IF EXISTS families_location_latitude_check;
ALTER TABLE public.families ADD CONSTRAINT families_location_latitude_check CHECK (
  latitude IS NULL OR (latitude >= -90 AND latitude <= 90)
);
ALTER TABLE public.families DROP CONSTRAINT IF EXISTS families_location_longitude_check;
ALTER TABLE public.families ADD CONSTRAINT families_location_longitude_check CHECK (
  longitude IS NULL OR (longitude >= -180 AND longitude <= 180)
);
CREATE INDEX IF NOT EXISTS families_public_location_idx
  ON public.families (hub_visibility, latitude, longitude)
  WHERE hub_visibility = 'public' AND latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE OR REPLACE FUNCTION public.search_public_hubs_nearby(
  _latitude double precision, _longitude double precision,
  _radius_km double precision DEFAULT 25, _limit integer DEFAULT 24
)
RETURNS TABLE (
  id uuid, name text, description text, hub_type text, public_join_mode text,
  location_label text, latitude double precision, longitude double precision,
  distance_km double precision, password_required boolean
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH nearby AS (
    SELECT f.id, f.name, f.description, f.hub_type, f.public_join_mode,
      f.location_label, f.latitude, f.longitude,
      (6371 * acos(least(1, greatest(-1,
        cos(radians(_latitude)) * cos(radians(f.latitude))
        * cos(radians(f.longitude) - radians(_longitude))
        + sin(radians(_latitude)) * sin(radians(f.latitude)))))) AS distance_km,
      f.public_join_mode = 'password' AS password_required
    FROM public.families f
    WHERE f.hub_visibility = 'public'
      AND f.latitude IS NOT NULL AND f.longitude IS NOT NULL
      AND _latitude BETWEEN -90 AND 90 AND _longitude BETWEEN -180 AND 180
      AND _radius_km > 0
  )
  SELECT * FROM nearby WHERE distance_km <= _radius_km
  ORDER BY distance_km ASC, name ASC LIMIT least(greatest(_limit, 1), 100);
$$;
GRANT EXECUTE ON FUNCTION public.search_public_hubs_nearby(double precision, double precision, double precision, integer) TO authenticated;

-- ---------- family_members: roles ----------
ALTER TABLE public.family_members
  ADD COLUMN IF NOT EXISTS role_label text NOT NULL DEFAULT 'Member',
  ADD COLUMN IF NOT EXISTS member_kind text NOT NULL DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS visibility_state text NOT NULL DEFAULT 'summary',
  ADD COLUMN IF NOT EXISTS is_hub_admin boolean NOT NULL DEFAULT false;
ALTER TABLE public.family_members DROP CONSTRAINT IF EXISTS family_members_member_kind_check;
ALTER TABLE public.family_members ADD CONSTRAINT family_members_member_kind_check CHECK (
  member_kind IN ('owner','admin','member','trusted_contact')
);
ALTER TABLE public.family_members DROP CONSTRAINT IF EXISTS family_members_visibility_state_check;
ALTER TABLE public.family_members ADD CONSTRAINT family_members_visibility_state_check CHECK (
  visibility_state IN ('hidden','summary','contextual','detailed')
);
UPDATE public.family_members fm
SET member_kind = 'owner', is_hub_admin = true
FROM public.families f
WHERE f.id = fm.family_id AND f.created_by = fm.user_id;

-- ---------- hub_events ----------
CREATE TABLE IF NOT EXISTS public.hub_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  event_type text NOT NULL DEFAULT 'shared_event',
  starts_at timestamptz,
  status text NOT NULL DEFAULT 'planned',
  support_context text,
  visibility_level text NOT NULL DEFAULT 'summary',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hub_events_event_type_check CHECK (event_type IN ('shared_event','appointment','reminder','pickup','dinner','support_coordination')),
  CONSTRAINT hub_events_status_check CHECK (status IN ('planned','confirmed','done','cancelled')),
  CONSTRAINT hub_events_visibility_level_check CHECK (visibility_level IN ('hidden','summary','contextual','detailed'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_events TO authenticated;
GRANT ALL ON public.hub_events TO service_role;
ALTER TABLE public.hub_events ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS hub_events_updated_at ON public.hub_events;
CREATE TRIGGER hub_events_updated_at BEFORE UPDATE ON public.hub_events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS hub_events_family_starts_idx ON public.hub_events(family_id, starts_at);
DROP POLICY IF EXISTS "Hub members can read hub events" ON public.hub_events;
CREATE POLICY "Hub members can read hub events" ON public.hub_events FOR SELECT USING (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Hub members can create hub events" ON public.hub_events;
CREATE POLICY "Hub members can create hub events" ON public.hub_events FOR INSERT WITH CHECK (public.is_family_member(family_id, auth.uid()) AND auth.uid() = created_by);
DROP POLICY IF EXISTS "Hub members can update hub events" ON public.hub_events;
CREATE POLICY "Hub members can update hub events" ON public.hub_events FOR UPDATE USING (public.is_family_member(family_id, auth.uid()));

-- ---------- hub_event_participants ----------
CREATE TABLE IF NOT EXISTS public.hub_event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.hub_events(id) ON DELETE CASCADE,
  invited_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  participant_key text NOT NULL,
  participant_label text NOT NULL,
  participant_role text,
  response_status text NOT NULL DEFAULT 'invited',
  visibility_level text NOT NULL DEFAULT 'summary',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hub_event_participants_response_status_check CHECK (response_status IN ('invited','accepted','maybe','declined','tagged')),
  CONSTRAINT hub_event_participants_visibility_level_check CHECK (visibility_level IN ('hidden','summary','contextual','detailed')),
  CONSTRAINT hub_event_participants_unique_key UNIQUE (event_id, participant_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_event_participants TO authenticated;
GRANT ALL ON public.hub_event_participants TO service_role;
ALTER TABLE public.hub_event_participants ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS hub_event_participants_updated_at ON public.hub_event_participants;
CREATE TRIGGER hub_event_participants_updated_at BEFORE UPDATE ON public.hub_event_participants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS hub_event_participants_family_event_idx ON public.hub_event_participants(family_id, event_id);
DROP POLICY IF EXISTS "Hub members can read event participants" ON public.hub_event_participants;
CREATE POLICY "Hub members can read event participants" ON public.hub_event_participants FOR SELECT USING (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Hub members can create event participants" ON public.hub_event_participants;
CREATE POLICY "Hub members can create event participants" ON public.hub_event_participants FOR INSERT WITH CHECK (public.is_family_member(family_id, auth.uid()) AND auth.uid() = created_by);
DROP POLICY IF EXISTS "Hub members can update event participants" ON public.hub_event_participants;
CREATE POLICY "Hub members can update event participants" ON public.hub_event_participants FOR UPDATE USING (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Hub members can delete event participants" ON public.hub_event_participants;
CREATE POLICY "Hub members can delete event participants" ON public.hub_event_participants FOR DELETE USING (public.is_family_member(family_id, auth.uid()));

-- ---------- calendar_connections ----------
CREATE TABLE IF NOT EXISTS public.calendar_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL, protocol text NOT NULL, display_name text NOT NULL,
  source_label text, credential_ref text,
  sync_direction text NOT NULL DEFAULT 'read_availability',
  availability_granularity text NOT NULL DEFAULT 'busy_free',
  include_event_titles boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'connected',
  last_synced_at timestamptz, sync_cursor text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT calendar_connections_provider_check CHECK (provider IN ('apple_ical','google_calendar','outlook','microsoft_365','caldav','webcal_ics','other')),
  CONSTRAINT calendar_connections_protocol_check CHECK (protocol IN ('oauth_2','caldav','webcal_ics','ical_file')),
  CONSTRAINT calendar_connections_sync_direction_check CHECK (sync_direction IN ('read_availability','two_way_later')),
  CONSTRAINT calendar_connections_granularity_check CHECK (availability_granularity IN ('busy_free','summary','contextual')),
  CONSTRAINT calendar_connections_status_check CHECK (status IN ('connected','paused','error','revoked'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_connections TO authenticated;
GRANT ALL ON public.calendar_connections TO service_role;
ALTER TABLE public.calendar_connections ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS calendar_connections_updated_at ON public.calendar_connections;
CREATE TRIGGER calendar_connections_updated_at BEFORE UPDATE ON public.calendar_connections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS calendar_connections_family_user_idx ON public.calendar_connections(family_id, user_id);
DROP POLICY IF EXISTS "Hub members can read calendar connection summaries" ON public.calendar_connections;
CREATE POLICY "Hub members can read calendar connection summaries" ON public.calendar_connections FOR SELECT USING (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can manage their own calendar connections" ON public.calendar_connections;
CREATE POLICY "Users can manage their own calendar connections" ON public.calendar_connections FOR ALL USING (public.is_family_member(family_id, auth.uid()) AND auth.uid() = user_id) WITH CHECK (public.is_family_member(family_id, auth.uid()) AND auth.uid() = user_id);

-- ---------- calendar_availability_windows ----------
CREATE TABLE IF NOT EXISTS public.calendar_availability_windows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id uuid REFERENCES public.calendar_connections(id) ON DELETE SET NULL,
  starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
  availability text NOT NULL DEFAULT 'busy',
  source_protocol text NOT NULL DEFAULT 'webcal_ics',
  visibility_level text NOT NULL DEFAULT 'summary',
  share_label text NOT NULL DEFAULT 'Busy',
  external_event_hash text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT calendar_availability_order_check CHECK (ends_at > starts_at),
  CONSTRAINT calendar_availability_state_check CHECK (availability IN ('free','busy','tentative','out_of_office')),
  CONSTRAINT calendar_availability_protocol_check CHECK (source_protocol IN ('oauth_2','caldav','webcal_ics','ical_file')),
  CONSTRAINT calendar_availability_visibility_check CHECK (visibility_level IN ('hidden','summary','contextual'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_availability_windows TO authenticated;
GRANT ALL ON public.calendar_availability_windows TO service_role;
ALTER TABLE public.calendar_availability_windows ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS calendar_availability_windows_updated_at ON public.calendar_availability_windows;
CREATE TRIGGER calendar_availability_windows_updated_at BEFORE UPDATE ON public.calendar_availability_windows FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS calendar_availability_family_time_idx ON public.calendar_availability_windows(family_id, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS calendar_availability_user_time_idx ON public.calendar_availability_windows(user_id, starts_at, ends_at);
DROP POLICY IF EXISTS "Hub members can read shared calendar availability" ON public.calendar_availability_windows;
CREATE POLICY "Hub members can read shared calendar availability" ON public.calendar_availability_windows FOR SELECT USING (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can manage their own calendar availability" ON public.calendar_availability_windows;
CREATE POLICY "Users can manage their own calendar availability" ON public.calendar_availability_windows FOR ALL USING (public.is_family_member(family_id, auth.uid()) AND auth.uid() = user_id) WITH CHECK (public.is_family_member(family_id, auth.uid()) AND auth.uid() = user_id);

-- ---------- calendar_sync_logs ----------
CREATE TABLE IF NOT EXISTS public.calendar_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id uuid REFERENCES public.calendar_connections(id) ON DELETE SET NULL,
  status text NOT NULL, windows_imported integer NOT NULL DEFAULT 0, message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT calendar_sync_logs_status_check CHECK (status IN ('started','completed','partial','failed'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_sync_logs TO authenticated;
GRANT ALL ON public.calendar_sync_logs TO service_role;
ALTER TABLE public.calendar_sync_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS calendar_sync_logs_connection_created_idx ON public.calendar_sync_logs(connection_id, created_at DESC);
DROP POLICY IF EXISTS "Hub members can read calendar sync logs" ON public.calendar_sync_logs;
CREATE POLICY "Hub members can read calendar sync logs" ON public.calendar_sync_logs FOR SELECT USING (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can create their own calendar sync logs" ON public.calendar_sync_logs;
CREATE POLICY "Users can create their own calendar sync logs" ON public.calendar_sync_logs FOR INSERT WITH CHECK (public.is_family_member(family_id, auth.uid()) AND auth.uid() = user_id);

-- ---------- hub_conversations / participants / messages ----------
CREATE TABLE IF NOT EXISTS public.hub_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  conversation_type text NOT NULL DEFAULT 'hub',
  title text NOT NULL DEFAULT 'Hub chat',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hub_conversations_type_check CHECK (conversation_type IN ('hub','private'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_conversations TO authenticated;
GRANT ALL ON public.hub_conversations TO service_role;
ALTER TABLE public.hub_conversations ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS hub_conversations_updated_at ON public.hub_conversations;
CREATE TRIGGER hub_conversations_updated_at BEFORE UPDATE ON public.hub_conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE UNIQUE INDEX IF NOT EXISTS hub_conversations_one_public_hub_idx ON public.hub_conversations(family_id) WHERE conversation_type = 'hub';
CREATE INDEX IF NOT EXISTS hub_conversations_family_type_idx ON public.hub_conversations(family_id, conversation_type, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.hub_conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES public.hub_conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  participant_key text NOT NULL, participant_label text NOT NULL, participant_role text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hub_conversation_participants_unique_key UNIQUE (conversation_id, participant_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_conversation_participants TO authenticated;
GRANT ALL ON public.hub_conversation_participants TO service_role;
ALTER TABLE public.hub_conversation_participants ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS hub_conversation_participants_conversation_idx ON public.hub_conversation_participants(conversation_id);

CREATE TABLE IF NOT EXISTS public.hub_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES public.hub_conversations(id) ON DELETE CASCADE,
  sender_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_label text NOT NULL DEFAULT 'LoveKey',
  message_type text NOT NULL DEFAULT 'message',
  body text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  visibility_level text NOT NULL DEFAULT 'summary',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hub_chat_messages_type_check CHECK (message_type IN ('message','system','event','action','alert','support')),
  CONSTRAINT hub_chat_messages_visibility_check CHECK (visibility_level IN ('hidden','summary','contextual','detailed'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_chat_messages TO authenticated;
GRANT ALL ON public.hub_chat_messages TO service_role;
ALTER TABLE public.hub_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS hub_chat_messages_conversation_created_idx ON public.hub_chat_messages(conversation_id, created_at DESC);

DROP POLICY IF EXISTS "Hub members can create conversations" ON public.hub_conversations;
CREATE POLICY "Hub members can create conversations" ON public.hub_conversations FOR INSERT WITH CHECK (public.is_family_member(family_id, auth.uid()) AND auth.uid() = created_by);
DROP POLICY IF EXISTS "Hub members can read hub conversations" ON public.hub_conversations;
CREATE POLICY "Hub members can read hub conversations" ON public.hub_conversations FOR SELECT USING (
  public.is_family_member(family_id, auth.uid()) AND (
    conversation_type = 'hub' OR created_by = auth.uid() OR EXISTS (
      SELECT 1 FROM public.hub_conversation_participants p
      WHERE p.conversation_id = id AND p.user_id = auth.uid()
    )
  )
);
DROP POLICY IF EXISTS "Conversation creators can update conversations" ON public.hub_conversations;
CREATE POLICY "Conversation creators can update conversations" ON public.hub_conversations FOR UPDATE USING (public.is_family_member(family_id, auth.uid()) AND created_by = auth.uid());
DROP POLICY IF EXISTS "Hub members can create conversation participants" ON public.hub_conversation_participants;
CREATE POLICY "Hub members can create conversation participants" ON public.hub_conversation_participants FOR INSERT WITH CHECK (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Hub members can read conversation participants" ON public.hub_conversation_participants;
CREATE POLICY "Hub members can read conversation participants" ON public.hub_conversation_participants FOR SELECT USING (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Hub members can create chat messages" ON public.hub_chat_messages;
CREATE POLICY "Hub members can create chat messages" ON public.hub_chat_messages FOR INSERT WITH CHECK (
  public.is_family_member(family_id, auth.uid()) AND (sender_user_id = auth.uid() OR sender_user_id IS NULL)
);
DROP POLICY IF EXISTS "Hub members can read chat messages" ON public.hub_chat_messages;
CREATE POLICY "Hub members can read chat messages" ON public.hub_chat_messages FOR SELECT USING (
  public.is_family_member(family_id, auth.uid()) AND EXISTS (
    SELECT 1 FROM public.hub_conversations c
    WHERE c.id = conversation_id AND (
      c.conversation_type = 'hub' OR c.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.hub_conversation_participants p
        WHERE p.conversation_id = c.id AND p.user_id = auth.uid()
      )
    )
  )
);

-- ---------- device_presence_states ----------
CREATE TABLE IF NOT EXISTS public.device_presence_states (
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_state text NOT NULL DEFAULT 'unknown',
  manual_state text, manual_until timestamptz,
  last_heartbeat_at timestamptz, last_interaction_at timestamptz,
  visibility_state text NOT NULL DEFAULT 'unknown',
  is_idle boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (family_id, user_id),
  CONSTRAINT device_presence_auto_state_check CHECK (auto_state IN ('active_now','recently_seen','away_or_locked','offline_or_unreachable','unknown')),
  CONSTRAINT device_presence_manual_state_check CHECK (manual_state IS NULL OR manual_state IN ('active_now','recently_seen','away_or_locked','offline_or_unreachable','unknown'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.device_presence_states TO authenticated;
GRANT ALL ON public.device_presence_states TO service_role;
ALTER TABLE public.device_presence_states ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS device_presence_states_updated_at ON public.device_presence_states;
CREATE TRIGGER device_presence_states_updated_at BEFORE UPDATE ON public.device_presence_states FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP POLICY IF EXISTS "Family members can read device presence" ON public.device_presence_states;
CREATE POLICY "Family members can read device presence" ON public.device_presence_states FOR SELECT TO authenticated USING (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can write own device presence" ON public.device_presence_states;
CREATE POLICY "Users can write own device presence" ON public.device_presence_states FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can update own device presence" ON public.device_presence_states;
CREATE POLICY "Users can update own device presence" ON public.device_presence_states FOR UPDATE TO authenticated USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid())) WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));

-- ---------- location_hotspots ----------
CREATE TABLE IF NOT EXISTS public.location_hotspots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL, hotspot_type text NOT NULL DEFAULT 'custom',
  latitude double precision NOT NULL, longitude double precision NOT NULL,
  radius_meters integer NOT NULL DEFAULT 150,
  visibility text NOT NULL DEFAULT 'hub',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT location_hotspots_type_check CHECK (hotspot_type IN ('home','school','work','care','custom')),
  CONSTRAINT location_hotspots_visibility_check CHECK (visibility IN ('private','hub','emergency_only')),
  CONSTRAINT location_hotspots_latitude_check CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT location_hotspots_longitude_check CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT location_hotspots_radius_check CHECK (radius_meters BETWEEN 50 AND 2000)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.location_hotspots TO authenticated;
GRANT ALL ON public.location_hotspots TO service_role;
ALTER TABLE public.location_hotspots ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS location_hotspots_updated_at ON public.location_hotspots;
CREATE TRIGGER location_hotspots_updated_at BEFORE UPDATE ON public.location_hotspots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP POLICY IF EXISTS "Users can read own location hotspots" ON public.location_hotspots;
CREATE POLICY "Users can read own location hotspots" ON public.location_hotspots FOR SELECT TO authenticated USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can create own location hotspots" ON public.location_hotspots;
CREATE POLICY "Users can create own location hotspots" ON public.location_hotspots FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can update own location hotspots" ON public.location_hotspots;
CREATE POLICY "Users can update own location hotspots" ON public.location_hotspots FOR UPDATE TO authenticated USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid())) WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can delete own location hotspots" ON public.location_hotspots;
CREATE POLICY "Users can delete own location hotspots" ON public.location_hotspots FOR DELETE TO authenticated USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));

-- ---------- location_presence_states ----------
CREATE TABLE IF NOT EXISTS public.location_presence_states (
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inferred_state text NOT NULL DEFAULT 'unknown',
  status_label text NOT NULL DEFAULT 'Location unknown',
  availability text NOT NULL DEFAULT 'unknown',
  nearest_hotspot_id uuid REFERENCES public.location_hotspots(id) ON DELETE SET NULL,
  nearest_hotspot_name text, nearest_hotspot_type text,
  distance_to_hotspot_meters integer, speed_kmh double precision,
  dwell_minutes integer NOT NULL DEFAULT 0,
  is_tracking boolean NOT NULL DEFAULT false,
  accuracy_meters double precision, last_signal_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (family_id, user_id),
  CONSTRAINT location_presence_state_check CHECK (inferred_state IN ('at_hotspot_available','resting_available','commuting_unavailable','moving_maybe_unavailable','paused','unknown')),
  CONSTRAINT location_presence_availability_check CHECK (availability IN ('available','maybe','unavailable','unknown'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.location_presence_states TO authenticated;
GRANT ALL ON public.location_presence_states TO service_role;
ALTER TABLE public.location_presence_states ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS location_presence_states_updated_at ON public.location_presence_states;
CREATE TRIGGER location_presence_states_updated_at BEFORE UPDATE ON public.location_presence_states FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP POLICY IF EXISTS "Family members can read location presence" ON public.location_presence_states;
CREATE POLICY "Family members can read location presence" ON public.location_presence_states FOR SELECT TO authenticated USING (public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can write own location presence" ON public.location_presence_states;
CREATE POLICY "Users can write own location presence" ON public.location_presence_states FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));
DROP POLICY IF EXISTS "Users can update own location presence" ON public.location_presence_states;
CREATE POLICY "Users can update own location presence" ON public.location_presence_states FOR UPDATE TO authenticated USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid())) WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));