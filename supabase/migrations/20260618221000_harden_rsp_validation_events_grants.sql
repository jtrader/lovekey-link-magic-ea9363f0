-- Security hardening: rsp_validation_events write access
--
-- Current state (migration 20260617080748):
--   GRANT select, insert, update, delete ON rsp_validation_events TO authenticated;
--   RLS enabled — SELECT policy exists, no INSERT/UPDATE/DELETE policies.
--
-- RLS with no INSERT policy = implicit DENY for direct API inserts.
-- This is currently safe, but the broad GRANT is misleading and fragile:
-- if an INSERT policy were added later for any reason, it would immediately
-- open the table to forged validation events (e.g. spoofing status_to =
-- 'validated' on any hub moment the attacker can reference).
--
-- All legitimate writes go through validate_due_hub_moments(), a
-- SECURITY DEFINER function that runs as the function owner and bypasses
-- both table grants and RLS.  Authenticated users need only SELECT access.
--
-- Fix: revoke INSERT / UPDATE / DELETE from authenticated and add explicit
-- restrictive policies as belt-and-suspenders so the intent survives future
-- migrations.

revoke insert, update, delete
  on public.rsp_validation_events
  from authenticated;

-- Belt-and-suspenders: explicit DENY policies so the intent is documented
-- in the policy list and survives any future grant changes.

create policy "No direct inserts — use validate_due_hub_moments()"
  on public.rsp_validation_events for insert to authenticated
  with check (false);

create policy "No direct updates — immutable audit log"
  on public.rsp_validation_events for update to authenticated
  using (false);

create policy "No direct deletes — immutable audit log"
  on public.rsp_validation_events for delete to authenticated
  using (false);
