-- 1. Restrict family_invites SELECT to hub admins or the invite creator
DROP POLICY IF EXISTS "Members can view family invites" ON public.family_invites;

CREATE POLICY "Admins or creators can view family invites"
ON public.family_invites
FOR SELECT
USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.family_members fm
    WHERE fm.family_id = family_invites.family_id
      AND fm.user_id = auth.uid()
      AND fm.is_hub_admin = true
  )
);

-- 2. Remove public INSERT on quiz_submissions.
-- Submissions are written server-side via the service role (which bypasses RLS),
-- so this permissive public policy is unnecessary and is an exposure vector.
DROP POLICY IF EXISTS "Anyone can submit a valid quiz result" ON public.quiz_submissions;

REVOKE INSERT ON public.quiz_submissions FROM anon;
