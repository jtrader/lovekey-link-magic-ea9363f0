import { createFileRoute } from "@tanstack/react-router";

// Retention window for unsaved original photos.
const RETENTION_DAYS = 7;
const BUCKET = "avatar-creator";

/**
 * Enforces the source-photo retention policy: deletes original uploaded/captured
 * photos that were never kept as part of a saved avatar and are older than
 * RETENTION_DAYS, along with their stored files. Saved avatars are never touched.
 *
 * Called by pg_cron. Protected by the project apikey header (this /api/public
 * route bypasses edge auth, so we verify the caller here).
 */
export const Route = createFileRoute("/api/public/hooks/avatar-cleanup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const provided =
          request.headers.get("apikey") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        const expected = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected || provided !== expected) {
          return json({ error: "Unauthorized" }, 401);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString();

        // Sources older than the retention window.
        const { data: oldSources, error: srcErr } = await supabaseAdmin
          .from("avatar_sources")
          .select("id, original_image_ref, created_at")
          .lt("created_at", cutoff);
        if (srcErr) return json({ error: srcErr.message }, 500);
        if (!oldSources || oldSources.length === 0) {
          return json({ ok: true, deleted: 0 }, 200);
        }

        // Which of those still back a kept (saved) avatar?
        const ids = oldSources.map((s) => s.id);
        const { data: keptRows, error: keptErr } = await supabaseAdmin
          .from("avatar_results")
          .select("avatar_source_id")
          .eq("is_saved", true)
          .in("avatar_source_id", ids);
        if (keptErr) return json({ error: keptErr.message }, 500);
        const kept = new Set((keptRows ?? []).map((r) => r.avatar_source_id));

        const toDelete = oldSources.filter((s) => !kept.has(s.id));
        if (toDelete.length === 0) return json({ ok: true, deleted: 0 }, 200);

        const paths = toDelete.map((s) => s.original_image_ref).filter(Boolean);
        if (paths.length) await supabaseAdmin.storage.from(BUCKET).remove(paths);

        const { error: delErr } = await supabaseAdmin
          .from("avatar_sources")
          .delete()
          .in(
            "id",
            toDelete.map((s) => s.id),
          );
        if (delErr) return json({ error: delErr.message }, 500);

        return json({ ok: true, deleted: toDelete.length, retention_days: RETENTION_DAYS }, 200);
      },
    },
  },
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
