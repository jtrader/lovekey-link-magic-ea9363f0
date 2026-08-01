import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { token } = await request.json();
    if (typeof token !== "string" || token.length < 8 || token.length > 64) {
      return json({ error: "Invalid link." }, 400);
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await supabase
      .from("quiz_submissions")
      .select("taker_name, score, total, passed, answers, created_at, share_expires_at")
      .eq("share_token", token.trim())
      .maybeSingle();
    if (error) return json({ error: "Could not load this result." }, 500);
    if (!data) return json({ error: "This result link is not valid." }, 404);
    if (data.share_expires_at && new Date(data.share_expires_at).getTime() < Date.now()) {
      return json({ error: "This result link has expired." }, 410);
    }
    return json({
      name: data.taker_name, score: data.score, total: data.total, passed: data.passed,
      detail: data.answers, createdAt: data.created_at, expiresAt: data.share_expires_at,
    });
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
