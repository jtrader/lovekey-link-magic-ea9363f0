# RLS Regression Suite

Cross-family Row-Level-Security tests for LoveKey Link. They guarantee that an
authenticated member of one family can **never** read or write another family's
data — locking in the isolation guarantees of our RLS policies so a future
schema or policy change can't silently regress them.

## What it guards

For each family-scoped table (`presence_states`, `family_presence`, `families`,
`family_members`, `hub_moments`, `rsp_validation_events`) the suite asserts:

- **Read isolation** — a member sees only their own family's rows.
- **Write isolation** — inserting into another family's `family_id` is rejected.
- **Self-scoping** — a user can't write rows on behalf of another user.
- **Anon lockout** — an unauthenticated client sees zero rows.

## How CI runs it

`.github/workflows/rls-regression.yml` triggers on any change under
`supabase/migrations/**` or `tests/rls/**`. It:

1. Starts a throwaway local Supabase stack (`supabase start`).
2. Injects `ci_baseline.sql` into the migration chain (it backfills
   `presence_states` / `family_presence`, which predate the captured migration
   history) and applies every migration with `supabase db reset`.
3. Runs `pytest tests/rls`.

No production secrets are used — everything runs against the local instance.

## Run it locally

```bash
supabase start
cp tests/rls/ci_baseline.sql supabase/migrations/20260510183210_ci_baseline_presence.sql
supabase db reset --no-seed
export SUPABASE_URL="http://127.0.0.1:54321"
export SUPABASE_ANON_KEY="$(supabase status -o env | grep '^ANON_KEY=' | cut -d= -f2- | tr -d '"')"
export SUPABASE_SERVICE_ROLE_KEY="$(supabase status -o env | grep '^SERVICE_ROLE_KEY=' | cut -d= -f2- | tr -d '"')"
pip install -r tests/rls/requirements.txt
pytest tests/rls -v
# clean up the injected baseline afterwards:
rm supabase/migrations/20260510183210_ci_baseline_presence.sql
```

## Extending it

When you add a new family-scoped table, add a read-isolation and a
write-isolation assertion in `test_cross_family_isolation.py`. The path filter
already re-runs the suite on every migration change.
