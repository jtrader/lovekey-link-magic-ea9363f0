## Goal

Commit a versioned **RLS regression suite** plus a **GitHub Actions workflow** that boots a throwaway local Supabase, applies all migrations, and runs the suite — failing the build if any policy lets a user touch another family's data. This locks in the cross-family isolation we verified manually so a future migration can't silently regress it.

## How it works

```text
push / PR touching supabase/migrations/** or tests/rls/**
        │
        ▼
GitHub Actions runner
   1. checkout + setup Supabase CLI
   2. supabase start            → local Postgres + Data API on localhost
   3. supabase db reset         → applies every migration in supabase/migrations/ in order
   4. python tests/rls/run.py   → seeds 2 families, asserts no cross-family read/write
        │ exit 0 = pass / exit 1 = fail
        ▼
   build status (red blocks the merge)
```

The suite runs only against the **local** ephemeral database — no production secrets, fully isolated and repeatable. The local CLI exposes fixed dev keys (anon + service_role) that are safe to hardcode in the workflow since they only ever reach the throwaway instance.

## What gets created

**1. `tests/rls/` — committed Python regression suite**
Reconstructs the earlier ad-hoc `/tmp` scripts as a permanent, runnable suite:
- `requirements.txt` — `supabase`, `requests`, `pytest`.
- `conftest.py` — reads `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` from env (set by CI); helpers to create a confirmed test user via the Auth Admin API, sign in to get a user-scoped client, and seed a family with one row in each guarded table.
- `test_cross_family_isolation.py` — the core assertions, one fixture building **UserA/FamA** and **UserB/FamB**:
  - **Read isolation**: each user, querying `presence_states`, `family_presence`, `hub_moments`, `families`, `family_members`, `rsp_validation_events`, sees only their own family's rows (1 each), never the other's.
  - **Write isolation**: UserA inserting/updating a `presence_states` (and `family_presence`, `hub_moments`) row into FamB is rejected (403 / RLS violation).
  - **Self-scoping**: insert with `user_id != auth.uid()` into own family is rejected.
  - **Anon lockout**: an unauthenticated client reading each table returns zero rows.
- `teardown` — deletes seeded rows + users via service role so reruns are clean (and harmless since the DB is ephemeral anyway).

The table/policy coverage mirrors the policies confirmed earlier (`is_family_member` + `user_id = auth.uid()` on writes; family-scoped reads).

**2. `.github/workflows/rls-regression.yml` — the pipeline**
- Triggers: `pull_request` and `push` filtered to `paths: supabase/migrations/**` and `tests/rls/**`, plus `workflow_dispatch` for manual runs.
- Steps: checkout → `supabase/setup-cli` → `supabase start` → `supabase db reset` (apply migrations) → `pip install -r tests/rls/requirements.txt` → `pytest tests/rls -v`.
- Env: `SUPABASE_URL=http://127.0.0.1:54321` and the standard local-CLI anon/service_role demo JWTs captured from `supabase status -o env`.

**3. `tests/rls/README.md`**
Short doc: what the suite guards, how to run it locally (`supabase start && pytest tests/rls`), and how to extend it when a new family-scoped table is added — so new tables get coverage by habit.

## Notes / trade-offs

- This validates RLS against the migration files in the repo. It does **not** reach into the live Lovable Cloud DB — that's the point (isolation), but it means the suite is only as good as the migrations being the source of truth (they are).
- Requires the Supabase CLI to start successfully in CI (Docker-based; GitHub-hosted runners support this out of the box).
- When you later add a new family-scoped table + policies, add a couple of assertions in `test_cross_family_isolation.py`; the path filter already re-runs the suite on any migration change.

## Out of scope

- No app/runtime code changes, no schema changes, no changes to existing policies.
- Not running against production; not adding production secrets to CI.