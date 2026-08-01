import { supabase } from "@/integrations/supabase/client";

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

export async function getQuizAttempts(): Promise<{
  authorized: boolean;
  attempts: QuizAttempt[];
}> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { authorized: false, attempts: [] };

  const { data: isAdmin } = await supabase.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  if (!isAdmin) return { authorized: false, attempts: [] };

  const { data, error } = await supabase
    .from("quiz_submissions")
    .select("id, taker_name, taker_phone, score, total, passed, created_at, answers")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load quiz attempts.");

  return {
    authorized: true,
    attempts: (data ?? []).map((row) => ({
      id: row.id,
      name: row.taker_name,
      phone: row.taker_phone,
      score: row.score,
      total: row.total,
      passed: row.passed,
      createdAt: row.created_at,
      answers: Array.isArray(row.answers) ? (row.answers as unknown as QuizAnswerDetail[]) : [],
    })),
  };
}
