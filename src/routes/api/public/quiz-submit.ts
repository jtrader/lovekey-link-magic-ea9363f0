import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PASS_MARK, QUIZ_QUESTIONS } from "@/lib/quiz-data";

// Correct option index (0-based) for each question id. Server-side only.
const ANSWER_KEY: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 0,
  8: 1,
  9: 0,
  10: 1,
};

const submissionSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(3).max(40),
  // answers[i] is the selected option index for QUIZ_QUESTIONS[i]
  answers: z.array(z.number().int().min(-1).max(3)).length(QUIZ_QUESTIONS.length),
});

const RESULT_RECIPIENT = "support@lovekey.com.au";

export const Route = createFileRoute("/api/public/quiz-submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid request body" }, 400);
        }

        const parsed = submissionSchema.safeParse(body);
        if (!parsed.success) {
          return json({ error: "Invalid submission" }, 400);
        }
        const { name, phone, answers } = parsed.data;

        // Authoritative scoring on the server.
        let score = 0;
        const detail = QUIZ_QUESTIONS.map((q, i) => {
          const selected = answers[i];
          const correct = ANSWER_KEY[q.id];
          const isCorrect = selected === correct;
          if (isCorrect) score += 1;
          return {
            question: q.question,
            selected: selected >= 0 ? q.options[selected] : "(no answer)",
            correct: q.options[correct],
            isCorrect,
          };
        });
        const total = QUIZ_QUESTIONS.length;
        const passed = score >= PASS_MARK;

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const { data: inserted, error: insertError } = await supabaseAdmin
          .from("quiz_submissions")
          .insert({
            taker_name: name,
            taker_phone: phone,
            score,
            total,
            passed,
            answers: detail,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("[quiz-submit] insert failed:", insertError);
          return json({ error: "Could not save your result" }, 500);
        }

        // Attempt to email the result. Email delivery requires a verified
        // sender domain; if it isn't configured yet this fails softly and the
        // result is still stored.
        let emailed = false;
        try {
          emailed = await sendResultEmail({
            id: inserted.id,
            name,
            phone,
            score,
            total,
            passed,
            detail,
          });
          if (emailed) {
            await supabaseAdmin
              .from("quiz_submissions")
              .update({ emailed: true })
              .eq("id", inserted.id);
          }
        } catch (e) {
          console.error("[quiz-submit] email step failed:", e);
        }

        return json({ score, total, passed, emailed });
      },
    },
  },
});

interface ResultPayload {
  id: string;
  name: string;
  phone: string;
  score: number;
  total: number;
  passed: boolean;
  detail: { question: string; selected: string; correct: string; isCorrect: boolean }[];
}

async function sendResultEmail(r: ResultPayload): Promise<boolean> {
  // Enqueue via the Lovable email infrastructure if it has been set up.
  // Falls back to no-op (returns false) when infra/domain isn't ready.
  try {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const lines = r.detail
      .map(
        (d, i) =>
          `${i + 1}. ${d.isCorrect ? "✔" : "�’"} ${d.question}\n   Chosen: ${d.selected}\n   Correct: ${d.correct}`,
      )
      .join("\n\n");
    const text =
      `New RSP quiz submission\n\n` +
      `Name: ${r.name}\n` +
      `Phone: ${r.phone}\n` +
      `Score: ${r.score}/${r.total} — ${r.passed ? "PASS" : "FAIL"}\n\n` +
      `Answers:\n${lines}\n`;

    const { error } = await supabaseAdmin.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      message: {
        to: RESULT_RECIPIENT,
        subject: `RSP Quiz result: ${r.name} — ${r.score}/${r.total} (${r.passed ? "PASS" : "FAIL"})`,
        text,
        idempotency_key: `quiz-${r.id}`,
      },
    });
    if (error) {
      console.error("[quiz-submit] enqueue_email error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[quiz-submit] enqueue_email threw:", e);
    return false;
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
