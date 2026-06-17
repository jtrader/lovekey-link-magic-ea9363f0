-- Security fix: restrict families UPDATE to hub admins only.
--
-- Current policy ("Members can update their families") allows ANY family
-- member to UPDATE the entire families row, including sensitive fields:
--   hub_visibility        — public / private / unlisted
--   public_join_mode      — open / request / invite
--   public_password_hash  — password-gates the hub
--
-- A regular member (child, sibling, etc.) should never be able to flip a
-- private hub to public, remove a password, or open join mode to strangers.
--
-- Fix: replace the broad member policy with an admin-only policy.
-- Hub admins are identified by is_hub_admin = true in family_members.

drop policy if exists "Members can update their families" on public.families;

create policy "Hub admins can update their families"
  on public.families for update
  using (
    exists (
      select 1
      from public.family_members fm
      where fm.family_id = id
        and fm.user_id   = auth.uid()
        and fm.is_hub_admin = true
    )
  );
