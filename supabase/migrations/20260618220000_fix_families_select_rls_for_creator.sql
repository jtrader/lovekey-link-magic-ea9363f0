-- Fix: families SELECT policy blocks the INSERT...RETURNING path.
--
-- Root cause: the `on_family_created` AFTER trigger adds the creator to
-- family_members, but PostgreSQL evaluates RETURNING *before* AFTER triggers
-- fire. So when Supabase's `insert(...).select("id")` checks the SELECT RLS
-- policy (`is_family_member(id, auth.uid())`), the member row doesn't exist
-- yet → 403 Forbidden.
--
-- Fix: replace the SELECT policy so it also passes when auth.uid() = created_by,
-- matching the existing INSERT policy. Once the trigger fires and the member
-- row exists, subsequent selects use the is_family_member path as normal.

drop policy if exists "Members can view their families" on public.families;

create policy "Members or creator can view their families"
  on public.families for select
  using (
    auth.uid() = created_by
    or public.is_family_member(id, auth.uid())
  );
