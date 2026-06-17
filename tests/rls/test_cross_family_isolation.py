"""Cross-family RLS regression tests.

Each test runs as an authenticated member of family A and/or B and asserts that
row-level security prevents any access to another family's data. A regression in
a policy (e.g. a future migration loosening a WHERE clause) fails the build.
"""


def _ids(rows):
    return {r.get("id") for r in rows}


def test_presence_states_read_isolation(families):
    a, b = families["a"], families["b"]
    rows_a = a.client.table("presence_states").select("*").execute().data
    rows_b = b.client.table("presence_states").select("*").execute().data
    assert all(r["family_id"] == a.family_id for r in rows_a)
    assert all(r["family_id"] == b.family_id for r in rows_b)
    assert b.family_id not in {r["family_id"] for r in rows_a}


def test_family_presence_read_isolation(families):
    a, b = families["a"], families["b"]
    rows_a = a.client.table("family_presence").select("*").execute().data
    assert {r["family_id"] for r in rows_a} <= {a.family_id}


def test_families_read_isolation(families):
    a, b = families["a"], families["b"]
    rows_a = a.client.table("families").select("*").execute().data
    assert _ids(rows_a) == {a.family_id}
    assert b.family_id not in _ids(rows_a)


def test_family_members_read_isolation(families):
    a, b = families["a"], families["b"]
    rows_a = a.client.table("family_members").select("*").execute().data
    assert all(r["family_id"] == a.family_id for r in rows_a)


def test_hub_moments_read_isolation(families):
    a, b = families["a"], families["b"]
    rows_a = a.client.table("hub_moments").select("*").execute().data
    assert _ids(rows_a) == {a.hub_moment_id}
    assert b.hub_moment_id not in _ids(rows_a)


def test_validation_events_read_isolation(families):
    a, b = families["a"], families["b"]
    rows_a = a.client.table("rsp_validation_events").select("*").execute().data
    assert all(r["family_id"] == a.family_id for r in rows_a)


def _insert_blocked(client, table, payload):
    """Return True if the insert is rejected by RLS (no row persisted)."""
    try:
        res = client.table(table).insert(payload).execute()
        return not res.data
    except Exception:
        return True


def test_cross_family_write_blocked(families):
    """User A cannot insert presence into family B."""
    a, b = families["a"], families["b"]
    assert _insert_blocked(
        a.client,
        "presence_states",
        {
            "user_id": a.user_id,
            "family_id": b.family_id,
            "node_id": "intruder",
            "status": "available",
            "mood_ring": "calm",
            "label": "x",
        },
    )


def test_cross_family_family_presence_write_blocked(families):
    a, b = families["a"], families["b"]
    assert _insert_blocked(
        a.client,
        "family_presence",
        {"family_id": b.family_id, "health": "good", "status_line": "x"},
    )


def test_cross_family_hub_moment_write_blocked(families):
    a, b = families["a"], families["b"]
    assert _insert_blocked(
        a.client,
        "hub_moments",
        {
            "family_id": b.family_id,
            "actor_user_id": a.user_id,
            "contact_label": "x",
            "event_type": "check_in",
            "event_summary": "x",
        },
    )


def test_self_scoped_insert_enforced(families):
    """User A cannot insert a presence row for another user, even in own family."""
    a, b = families["a"], families["b"]
    assert _insert_blocked(
        a.client,
        "presence_states",
        {
            "user_id": b.user_id,
            "family_id": a.family_id,
            "node_id": "spoof",
            "status": "available",
            "mood_ring": "calm",
            "label": "x",
        },
    )


def test_anonymous_sees_nothing(families):
    anon = families["anon"]
    for table in (
        "presence_states",
        "family_presence",
        "families",
        "family_members",
        "hub_moments",
        "rsp_validation_events",
    ):
        rows = anon.table(table).select("*").execute().data
        assert rows == [], f"anon should see no rows in {table}"
