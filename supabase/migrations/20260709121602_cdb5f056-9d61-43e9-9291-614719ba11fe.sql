-- Restrict hub_events UPDATE to the event creator or hub admins
DROP POLICY IF EXISTS "Hub members can update hub events" ON public.hub_events;
CREATE POLICY "Event creators or hub admins can update hub events"
ON public.hub_events
FOR UPDATE
USING (
  auth.uid() = created_by
  OR EXISTS (
    SELECT 1 FROM public.family_members fm
    WHERE fm.family_id = hub_events.family_id
      AND fm.user_id = auth.uid()
      AND fm.is_hub_admin = true
  )
)
WITH CHECK (
  auth.uid() = created_by
  OR EXISTS (
    SELECT 1 FROM public.family_members fm
    WHERE fm.family_id = hub_events.family_id
      AND fm.user_id = auth.uid()
      AND fm.is_hub_admin = true
  )
);

-- Tighten quiz_submissions INSERT policy so it is no longer an always-true rule.
-- Public quiz submissions are still allowed, but must contain sane, bounded values.
DROP POLICY IF EXISTS "Anyone can submit a quiz result" ON public.quiz_submissions;
CREATE POLICY "Anyone can submit a valid quiz result"
ON public.quiz_submissions
FOR INSERT
WITH CHECK (
  char_length(taker_name) BETWEEN 1 AND 200
  AND char_length(taker_phone) <= 40
  AND score >= 0
  AND total >= 0
  AND score <= total
);

-- Note: quiz_submissions intentionally has NO SELECT policy, so taker PII
-- (name/phone) and results are never readable through the Data API by anon or
-- authenticated clients. All reads (admin dashboard, shareable result links)
-- go through trusted server functions using the service role, which validate
-- the caller or an unguessable share_token server-side.
