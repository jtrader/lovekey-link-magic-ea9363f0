import { createFileRoute } from "@tanstack/react-router";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/quiz-result/$token")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const token = params.token?.trim();
        if (!token || token.length < 8 || token.length > 64) {
          return json({ error: "Invalid link" }, 400);
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const { data, error } = await supabaseAdmin
          .from("quiz_submissions")
          .select(
            "taker_name, score, total, passed, answers, created_at, share_expires_at",
          )
          .eq("share_token", token)
          .maybeSingle();

        if (error) {
          console.error("[quiz-result] lookup failed:", error);
          return json({ error: "Could not load this result" }, 500);
        }
        if (!data) {
          return json({ error: "This result link is not valid." }, 404);
        }
        if (
          data.share_expires_at &&
          new Date(data.share_expires_at).getTime() < Date.now()
        ) {
          return json({ error: "This result link has expired." }, 410);
        }

        return json({
          name: data.taker_name,
          score: data.score,
          total: data.total,
          passed: data.passed,
          detail: data.answers,
          createdAt: data.created_at,
          expiresAt: data.share_expires_at,
        });
      },
    },
  },
});
