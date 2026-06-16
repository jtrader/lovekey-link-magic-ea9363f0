CREATE TABLE public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  requester_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'low',
  message TEXT,
  route_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_requests TO authenticated;
GRANT ALL ON public.support_requests TO service_role;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family members can view support requests"
  ON public.support_requests FOR SELECT TO authenticated
  USING (public.is_family_member(family_id, auth.uid()));
CREATE POLICY "Members can create their own support requests"
  ON public.support_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_user_id AND public.is_family_member(family_id, auth.uid()));

CREATE TABLE public.rsp_consent_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  signal_type TEXT,
  consent_state TEXT,
  context TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsp_consent_events TO authenticated;
GRANT ALL ON public.rsp_consent_events TO service_role;
ALTER TABLE public.rsp_consent_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family members can view consent events"
  ON public.rsp_consent_events FOR SELECT TO authenticated
  USING (public.is_family_member(family_id, auth.uid()));
CREATE POLICY "Members can create their own consent events"
  ON public.rsp_consent_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_user_id AND public.is_family_member(family_id, auth.uid()));