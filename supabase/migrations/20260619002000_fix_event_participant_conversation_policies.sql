-- Security fixes (batch):
--
-- 1. hub_events UPDATE — any family member can edit any member's event
--    Fix: restrict UPDATE to the event creator (or hub admins).
--
-- 2. hub_event_participants UPDATE/DELETE — any member can mutate any
--    participant row, including rows they don't own.
--    Fix: restrict to own rows + hub admins for UPDATE; own rows only for DELETE.
--
-- 3. hub_conversations SELECT — self-referencing join bug.
--    The EXISTS subquery `p.conversation_id = id` resolves to
--    `p.conversation_id = p.id` because hub_conversation_participants has its
--    own `id` column which takes precedence over the outer hub_conversations.id.
--    Fix: qualify as `p.conversation_id = hub_conversations.id`.
--
-- 4. rsp_validation_events — already hardened in migration 20260618221000.
--    Confirmed: no INSERT/UPDATE/DELETE policy + GRANT revoked.  All writes
--    go exclusively through validate_due_hub_moments() SECURITY DEFINER.
--    No action needed here; documented for audit completeness.
--
-- 5. profiles exposure — confirmed safe.
--    SELECT policy: auth.uid() = id (own row only).
--    No SECURITY DEFINER function queries public.profiles.
--    handle_new_user() only INSERTs the caller's own row.
--    family_members exposes user_id UUIDs but the profiles SELECT policy
--    blocks cross-user lookups, so no escalation path exists.
--    No action needed; documented for audit completeness.

-- ─── 1. hub_events: restrict UPDATE to creator or hub admin ──────────────────

DROP POLICY IF EXISTS "Hub members can update hub events"   ON public.hub_events;
DROP POLICY IF EXISTS "Hub members can update their events" ON public.hub_events;

CREATE POLICY "Creators and admins can update hub events"
  ON public.hub_events FOR UPDATE
  USING (
    -- Event creator can always edit their own event
    auth.uid() = created_by
    OR
    -- Hub admins can edit any event in their hub
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.family_id   = hub_events.family_id
        AND fm.user_id     = auth.uid()
        AND fm.is_hub_admin = true
    )
  );

-- ─── 2. hub_event_participants: scope UPDATE/DELETE to own rows + admins ──────

DROP POLICY IF EXISTS "Hub members can update event participants" ON public.hub_event_participants;
DROP POLICY IF EXISTS "Hub members can delete event participants" ON public.hub_event_participants;

-- UPDATE: own participation row, or hub admin
CREATE POLICY "Members can update own participation"
  ON public.hub_event_participants FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.family_id   = hub_event_participants.family_id
        AND fm.user_id     = auth.uid()
        AND fm.is_hub_admin = true
    )
  );

-- DELETE: own participation row only (admins can remove via hub admin tooling)
CREATE POLICY "Members can delete own participation"
  ON public.hub_event_participants FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 3. hub_conversations SELECT: fix self-referencing join ──────────────────
--
-- Bug: inside the EXISTS subquery, unqualified `id` resolves to
-- hub_conversation_participants.id (the inner table) rather than
-- hub_conversations.id (the outer table), making the participant check
-- always false and private conversations invisible to participants.

DROP POLICY IF EXISTS "Hub members can read hub conversations" ON public.hub_conversations;

CREATE POLICY "Hub members can read hub conversations"
  ON public.hub_conversations FOR SELECT
  USING (
    public.is_family_member(family_id, auth.uid())
    AND (
      conversation_type = 'hub'
      OR created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.hub_conversation_participants p
        WHERE p.conversation_id = hub_conversations.id  -- qualified: outer table
          AND p.user_id = auth.uid()
      )
    )
  );
