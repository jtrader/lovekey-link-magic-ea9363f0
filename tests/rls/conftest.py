"""Shared fixtures for the LoveKey Link RLS regression suite.

Connects to a Supabase stack (a throwaway local instance in CI) using env vars:
  SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

The suite seeds two independent families (A and B) with one row in each
family-scoped table, then asserts that an authenticated member of one family
can never read or write another family's data.
"""

import os
import uuid

import pytest
from supabase import create_client, Client

SUPABASE_URL = os.environ["SUPABASE_URL"]
ANON_KEY = os.environ["SUPABASE_ANON_KEY"]
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]


def _service() -> Client:
    return create_client(SUPABASE_URL, SERVICE_KEY)


def _anon() -> Client:
    return create_client(SUPABASE_URL, ANON_KEY)


def _create_user(svc: Client, email: str, password: str) -> str:
    res = svc.auth.admin.create_user(
        {"email": email, "password": password, "email_confirm": True}
    )
    return res.user.id


def _user_client(email: str, password: str) -> Client:
    client = create_client(SUPABASE_URL, ANON_KEY)
    client.auth.sign_in_with_password({"email": email, "password": password})
    return client


class Family:
    """Holds the seeded identifiers for a single test family."""

    def __init__(self, name: str):
        self.name = name
        self.password = "Test-Pass-123!"
        self.email = f"{name}-{uuid.uuid4().hex[:8]}@rls-test.local"
        self.user_id: str | None = None
        self.family_id: str | None = None
        self.hub_moment_id: str | None = None
        self.client: Client | None = None


def _seed_family(svc: Client, fam: Family) -> None:
    fam.user_id = _create_user(svc, fam.email, fam.password)

    family = (
        svc.table("families")
        .insert({"name": fam.name, "created_by": fam.user_id})
        .execute()
    )
    fam.family_id = family.data[0]["id"]
    # on_family_created trigger adds the creator as a member automatically.

    svc.table("presence_states").insert(
        {
            "user_id": fam.user_id,
            "family_id": fam.family_id,
            "node_id": f"node-{fam.name}",
            "status": "available",
            "mood_ring": "calm",
            "label": "Home",
        }
    ).execute()

    svc.table("family_presence").insert(
        {
            "family_id": fam.family_id,
            "health": "good",
            "status_line": "All settled",
        }
    ).execute()

    moment = (
        svc.table("hub_moments")
        .insert(
            {
                "family_id": fam.family_id,
                "actor_user_id": fam.user_id,
                "contact_label": "Mum",
                "event_type": "check_in",
                "event_summary": "Checked in",
            }
        )
        .execute()
    )
    fam.hub_moment_id = moment.data[0]["id"]

    svc.table("rsp_validation_events").insert(
        {
            "hub_moment_id": fam.hub_moment_id,
            "family_id": fam.family_id,
            "status_to": "pending",
            "reason": "seeded",
        }
    ).execute()

    fam.client = _user_client(fam.email, fam.password)


@pytest.fixture(scope="session")
def families():
    svc = _service()
    fam_a = Family("fama")
    fam_b = Family("famb")
    _seed_family(svc, fam_a)
    _seed_family(svc, fam_b)

    yield {"a": fam_a, "b": fam_b, "service": svc, "anon": _anon()}

    # Teardown: families.created_by is ON DELETE RESTRICT, so drop families
    # (cascades child rows) before removing the users.
    for fam in (fam_a, fam_b):
        if fam.family_id:
            svc.table("families").delete().eq("id", fam.family_id).execute()
    for fam in (fam_a, fam_b):
        if fam.user_id:
            try:
                svc.auth.admin.delete_user(fam.user_id)
            except Exception:
                pass
