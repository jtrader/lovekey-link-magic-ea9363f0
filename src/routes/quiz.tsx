import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PASS_MARK,
  QUIZ_QUESTIONS,
  QUIZ_SUBTITLE,
  QUIZ_TITLE,
} from "@/lib/quiz-data";
import pdfAsset from "@/assets/RSP_Chapter_Law_of_Vibration.pdf.asset.json";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "RSP Law of Vibration Quiz · Love Key Link" },
      {
        name: "description",
        content:
          "Test your understanding of the RSP Law of Vibration chapter — 10 multiple-choice questions with a pass mark of 6.",
      },
      { property: "og:title", content: "RSP Law of Vibration Quiz" },
      {
        property: "og:description",
        content:
          "10 multiple-choice questions on reciprocal balance as a coordination principle. Pass mark 6/10.",
      },
    ],
  }),
  component: QuizPage,
});

type ResultDetail = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};
type Result = {
  score: number;
  total: number;
  passed: boolean;
  emailed: boolean;
  attempt: number;
  attemptsRemaining: number;
  detail: ResultDetail[];
};

function QuizPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<number[]>(
    () => Array(QUIZ_QUESTIONS.length).fill(-1),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const answeredCount = useMemo(
    () => answers.filter((a) => a >= 0).length,
    [answers],
  );
  const allAnswered = answeredCount === QUIZ_QUESTIONS.length;
  const detailsValid = name.trim().length > 0 && phone.trim().length >= 3;

  function selectOption(qIndex: number, optIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  }

  async function handleSubmit() {
    setError(null);
    if (!detailsValid) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (!allAnswered) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/quiz-submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), answers }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Submission failed. Please try again.");
      }
      setResult((await res.json()) as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Your result
            </p>
            <h1 className="mt-4 text-5xl font-bold">
              {result.score}
              <span className="text-2xl text-muted-foreground">/{result.total}</span>
            </h1>
            <p
              className={`mt-4 text-xl font-semibold ${
                result.passed ? "text-primary" : "text-destructive"
              }`}
            >
              {result.passed ? "Passed 🎉" : "Not passed"}
            </p>
            <p className="mt-2 text-muted-foreground">
              Pass mark is {PASS_MARK} out of {result.total}.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Thanks, {name.trim()}. Your result has been recorded.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button asChild variant="outline">
                <Link to="/">Back to home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/rsp">Read about RSP</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <header className="mb-8">
          <Link to="/rsp" className="text-sm text-muted-foreground hover:text-foreground">
            ← RSP
          </Link>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{QUIZ_TITLE}</h1>
          <p className="mt-2 text-muted-foreground">{QUIZ_SUBTITLE}</p>
        </header>

        <section className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Read the chapter first</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Download the RSP Law of Vibration chapter before you start.
                <span className="ml-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  ~5–10 min read
                </span>
              </p>
            </div>
            <Button asChild variant="default" size="default">
              <a href={pdfAsset.url} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                maxLength={120}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                value={phone}
                maxLength={40}
                inputMode="tel"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+61 400 000 000"
              />
            </div>
          </div>
        </section>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {answeredCount} of {QUIZ_QUESTIONS.length} answered
            </span>
          </div>
          <Progress value={(answeredCount / QUIZ_QUESTIONS.length) * 100} />
        </div>

        <ol className="space-y-6">
          {QUIZ_QUESTIONS.map((q, qIndex) => (
            <li
              key={q.id}
              className="rounded-xl border border-border bg-card p-6"
            >
              <p className="font-medium">
                <span className="text-muted-foreground">{qIndex + 1}.</span>{" "}
                {q.question}
              </p>
              <div className="mt-4 space-y-2">
                {q.options.map((opt, optIndex) => {
                  const selected = answers[qIndex] === optIndex;
                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => selectOption(qIndex, optIndex)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>

        {error && (
          <p className="mt-6 text-sm font-medium text-destructive">{error}</p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Pass mark: {PASS_MARK}/{QUIZ_QUESTIONS.length}
          </p>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !allAnswered || !detailsValid}
          >
            {submitting ? "Submitting…" : "Submit quiz"}
          </Button>
        </div>
      </div>
    </main>
  );
}
