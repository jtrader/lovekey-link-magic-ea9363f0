import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env.QUIZ_ADMIN_SESSION_SECRET!,
    name: "quiz-admin",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const email = process.env.QUIZ_ADMIN_EMAIL;
    const password = process.env.QUIZ_ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error("Admin credentials are not configured.");
    }
    const ok =
      matches(data.email.trim().toLowerCase(), email.trim().toLowerCase()) &&
      matches(data.password, password);
    if (!ok) return { ok: false as const };

    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export type QuizAnswerDetail = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};

export type QuizAttempt = {
  id: string;
  name: string;
  phone: string;
  score: number;
  total: number;
  passed: boolean;
  createdAt: string;
  answers: QuizAnswerDetail[];
};

export const getQuizAttempts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ authorized: boolean; attempts: QuizAttempt[] }> => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("quiz_submissions")
      .select(
        "id, taker_name, taker_phone, score, total, passed, created_at, answers",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[quiz-admin] fetch failed:", error);
      throw new Error("Could not load quiz attempts.");
    }

    return {
      authorized: true,
      attempts: (data ?? []).map((r) => ({
        id: r.id,
        name: r.taker_name,
        phone: r.taker_phone,
        score: r.score,
        total: r.total,
        passed: r.passed,
        createdAt: r.created_at,
        answers: Array.isArray(r.answers)
          ? (r.answers as unknown as QuizAnswerDetail[])
          : [],
      })),
    };
  },
);
