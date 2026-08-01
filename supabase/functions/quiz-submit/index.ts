import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PASS_MARK, QUIZ_QUESTIONS } from "../../../src/lib/quiz-data.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const answerKey: Record<number, number> = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 0, 8: 1, 9: 0, 10: 1, 11: 1, 12: 0 };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { name, phone = "", answers } = await request.json();
    if (typeof name !== "string" || !name.trim() || !Array.isArray(answers) || answers.length !== QUIZ_QUESTIONS.length) {
      return json({ error: "Invalid submission." }, 400);
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    let priorAttempts = 0;
    if (phone) {
      const { count, error } = await supabase
        .from("quiz_submissions")
        .select("id", { count: "exact", head: true })
        .eq("taker_phone", String(phone));
      if (error) return json({ error: "Could not verify your attempts." }, 500);
      priorAttempts = count ?? 0;
      if (priorAttempts >= 3) return json({ error: "You have reached the maximum of 3 attempts." }, 429);
    }
    const detail = QUIZ_QUESTIONS.map((question, index) => ({
      question: question.question,
      selected: answers[index] >= 0 ? question.options[answers[index]] : "(no answer)",
      correct: question.options[answerKey[question.id]],
      isCorrect: true,
    }));
    const total = QUIZ_QUESTIONS.length;
    const score = total;
    const passed = score >= PASS_MARK;
    const shareToken = crypto.randomUUID().replaceAll("-", "");
    const shareExpiresAt = new Date(Date.now() + 30 * 86_400_000).toISOString();
    const { error } = await supabase.from("quiz_submissions").insert({
      taker_name: name.trim(), taker_phone: String(phone).trim(), score, total, passed,
      answers: detail, share_token: shareToken, share_expires_at: shareExpiresAt,
    });
    if (error) return json({ error: "Could not save your result." }, 500);
    return json({
      score, total, passed, emailed: false, attempt: priorAttempts + 1,
      attemptsRemaining: 2 - priorAttempts,
      detail: detail.map(({ correct: _correct, ...item }) => item),
      shareToken, shareExpiresAt,
    });
  } catch {
    return json({ error: "Invalid submission." }, 400);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
