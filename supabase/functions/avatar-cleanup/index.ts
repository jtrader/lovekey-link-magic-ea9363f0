import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const retentionDays = 7;
const bucket = "avatar-creator";

Deno.serve(async (request) => {
  const provided = request.headers.get("apikey") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expected = Deno.env.get("SUPABASE_ANON_KEY");
  if (!expected || provided !== expected) return json({ error: "Unauthorized" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const cutoff = new Date(Date.now() - retentionDays * 86_400_000).toISOString();
  const { data: oldSources, error: sourceError } = await supabase
    .from("avatar_sources")
    .select("id, original_image_ref")
    .lt("created_at", cutoff);
  if (sourceError) return json({ error: sourceError.message }, 500);
  if (!oldSources?.length) return json({ ok: true, deleted: 0 });

  const ids = oldSources.map((source) => source.id);
  const { data: keptRows, error: keptError } = await supabase
    .from("avatar_results")
    .select("avatar_source_id")
    .eq("is_saved", true)
    .in("avatar_source_id", ids);
  if (keptError) return json({ error: keptError.message }, 500);

  const kept = new Set((keptRows ?? []).map((row) => row.avatar_source_id));
  const expired = oldSources.filter((source) => !kept.has(source.id));
  if (!expired.length) return json({ ok: true, deleted: 0 });

  const paths = expired.map((source) => source.original_image_ref).filter(Boolean);
  if (paths.length) await supabase.storage.from(bucket).remove(paths);
  const { error: deleteError } = await supabase
    .from("avatar_sources")
    .delete()
    .in("id", expired.map((source) => source.id));
  if (deleteError) return json({ error: deleteError.message }, 500);
  return json({ ok: true, deleted: expired.length, retention_days: retentionDays });
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
