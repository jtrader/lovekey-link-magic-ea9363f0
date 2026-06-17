DROP POLICY IF EXISTS "users_write_own_presence" ON public.presence_states;
CREATE POLICY "users_write_own_presence" ON public.presence_states
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));

DROP POLICY IF EXISTS "users_update_own_presence" ON public.presence_states;
CREATE POLICY "users_update_own_presence" ON public.presence_states
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()))
  WITH CHECK (user_id = auth.uid() AND public.is_family_member(family_id, auth.uid()));