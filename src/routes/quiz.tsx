import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PASS_MARK,
  QUIZ_QUESTIONS,
  QUIZ_SUBTITLE,
  QUIZ_TITLE,
  SECTION_LABELS,
  sectionOf,
  sectionSize,
  countAnswered,
  clampIndex,
  nextIndex,
  prevIndex,
  focusTargetFor,
  announcementFor,
} from "@/lib/quiz-data";
import pdfAsset from "@/assets/RSP_Chapter_Law_of_Vibration.pdf.asset.json";
import { Download, FileDown, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { downloadQuizResultPdf } from "@/lib/quiz-result-pdf";

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
  shareToken: string;
  shareExpiresAt: string;
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
  const [copied, setCopied] = useState(false);

  // Which question is "active" for keyboard navigation.
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  // Refs to each question container and each option button for focus handling.
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const optionRefs = useRef<Array<Array<HTMLButtonElement | null>>>([]);
  // Results heading, focused when the form is replaced by the results view.
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);
  // Only steal focus when navigation was explicitly requested (Prev/Next),
  // never on a plain answer selection.
  const pendingFocus = useRef(false);

  const answeredCount = useMemo(() => countAnswered(answers), [answers]);
  const allAnswered = answeredCount === QUIZ_QUESTIONS.length;
  const detailsValid = name.trim().length > 0;

  // Split the quiz into three equal sections (thirds) via shared helpers.
  const SECTION_SIZE = sectionSize();
  const currentSection = sectionOf(
    Math.min(answeredCount, QUIZ_QUESTIONS.length - 1),
  );

  function selectOption(qIndex: number, optIndex: number) {
    setActiveIndex(qIndex);
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  }

  // Move the active question and request focus/announcement.
  const goToQuestion = useCallback(
    (target: number) => {
      const i = clampIndex(target, QUIZ_QUESTIONS.length);
      pendingFocus.current = true;
      setActiveIndex(i);
    },
    [],
  );

  // After the active question changes via navigation, move keyboard focus to
  // the selected option (if answered) or the question container, and announce it.
  useEffect(() => {
    setAnnouncement(announcementFor(activeIndex));

    if (!pendingFocus.current) return;
    pendingFocus.current = false;

    const focusTarget = focusTargetFor(activeIndex, answers);
    const el =
      focusTarget.kind === "option"
        ? optionRefs.current[focusTarget.qIndex]?.[focusTarget.optIndex]
        : questionRefs.current[focusTarget.qIndex];
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex, answers]);


  async function handleSubmit() {
    setError(null);
    if (!detailsValid) {
      setError("Please enter your name.");
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

  async function downloadResultsPdf(r: Result) {
    await downloadQuizResultPdf({
      name: name.trim(),
      phone: phone.trim(),
      score: r.score,
      total: r.total,
      passed: r.passed,
      detail: r.detail,
      attempt: r.attempt,
    });
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
            <p className="mt-1 text-sm text-muted-foreground">
              Attempt {result.attempt} of 3
              {result.attemptsRemaining > 0
                ? ` · ${result.attemptsRemaining} attempt${
                    result.attemptsRemaining === 1 ? "" : "s"
                  } remaining`
                : " · no attempts remaining"}
            </p>
            {result.passed && (
              <div className="mt-8">
                <Button onClick={() => downloadResultsPdf(result)}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download results PDF
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Please download the PDF — or screenshot it once it opens — and
                  keep it for your records.
                </p>
              </div>
            )}

            {result.passed && (
              <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-left">
                <p className="text-sm font-medium">Shareable link</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Save this private link to view your result later.
                </p>
                {(() => {
                  const shareUrl = `${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }/r/${result.shareToken}`;
                  const expiry = new Date(result.shareExpiresAt);
                  return (
                    <>
                      <div className="mt-3 flex items-center gap-2">
                        <Input readOnly value={shareUrl} className="text-xs" />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(shareUrl);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            } catch {
                              /* clipboard unavailable */
                            }
                          }}
                          aria-label="Copy link"
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Time limit:
                        </span>{" "}
                        30 days · expires{" "}
                        {expiry.toLocaleString(undefined, {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </>
                  );
                })()}
              </div>
            )}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/">Love Key Link home →</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/rsp">RSP protocol page →</Link>
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
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              ← Love Key Link home
            </Link>
            <Link to="/rsp" className="hover:text-foreground">
              RSP →
            </Link>
          </div>
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
              <Label htmlFor="phone">
                Phone number{" "}
                <span className="font-medium text-destructive">(optional)</span>
              </Label>
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

        <section
          className="mb-6"
          role="group"
          aria-label="Quiz progress"
        >
          <div className="mb-2 flex items-center justify-between text-sm">
            <span
              className={`font-medium ${
                allAnswered ? "text-primary" : "text-foreground"
              }`}
            >
              {allAnswered
                ? "All questions answered"
                : SECTION_LABELS[currentSection]}
            </span>
            <span
              aria-hidden="true"
              className={
                allAnswered
                  ? "font-medium text-primary"
                  : "text-muted-foreground"
              }
            >
              {answeredCount} of {QUIZ_QUESTIONS.length} answered
            </span>
          </div>
          <Progress
            value={(answeredCount / QUIZ_QUESTIONS.length) * 100}
            aria-label={`Questions answered: ${answeredCount} of ${QUIZ_QUESTIONS.length}`}
          />
          {/* Announce progress and current section changes to screen readers. */}
          <p className="sr-only" aria-live="polite">
            {answeredCount} of {QUIZ_QUESTIONS.length} questions answered.{" "}
            {allAnswered
              ? "All questions answered — ready to submit."
              : `Currently in the ${SECTION_LABELS[currentSection].toLowerCase()} of the quiz.`}
          </p>
          <ol className="mt-2 flex gap-2" aria-label="Quiz sections">
            {SECTION_LABELS.map((label, i) => {
              const isComplete = allAnswered;
              const isCurrent = !allAnswered && i === currentSection;
              const stateText = isComplete
                ? "completed"
                : isCurrent
                  ? "current section"
                  : "not started";
              return (
                <li
                  key={label}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex-1 rounded-full py-1 text-center text-xs transition-colors ${
                    isComplete || isCurrent
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <span aria-hidden="true">{label}</span>
                  <span className="sr-only">
                    {label}, {stateText}
                  </span>
                </li>
              );
            })}
          </ol>
          {allAnswered && (
            <p
              className="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
              role="status"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              All {QUIZ_QUESTIONS.length} questions answered — ready to submit.
            </p>
          )}
        </section>

        {/* Announces the active question when navigating with Previous/Next. */}
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>


        <ol className="space-y-6">
          {QUIZ_QUESTIONS.map((q, qIndex) => {
            const showSectionHeader = qIndex % SECTION_SIZE === 0;
            const sectionIndex = sectionOf(qIndex);
            return (
            <li key={q.id}>
              {showSectionHeader && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="sr-only">Section: </span>
                  {SECTION_LABELS[sectionIndex]}
                </p>
              )}
              <div
                ref={(el) => {
                  questionRefs.current[qIndex] = el;
                }}
                tabIndex={-1}
                role="group"
                aria-labelledby={`question-${q.id}-heading`}
                aria-current={qIndex === activeIndex ? "step" : undefined}
                onFocus={() => setActiveIndex(qIndex)}
                className={`rounded-xl border bg-card p-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  qIndex === activeIndex
                    ? "border-primary ring-1 ring-primary/40"
                    : "border-border"
                }`}
              >
              <p id={`question-${q.id}-heading`} className="font-medium">
                <span className="sr-only">
                  Question {qIndex + 1} of {QUIZ_QUESTIONS.length}:{" "}
                </span>
                <span className="text-muted-foreground" aria-hidden="true">
                  {qIndex + 1}.
                </span>{" "}
                {q.question}
              </p>
              <div className="mt-4 space-y-2">
                {q.options.map((opt, optIndex) => {
                  const selected = answers[qIndex] === optIndex;
                  return (
                    <button
                      key={optIndex}
                      ref={(el) => {
                        if (!optionRefs.current[qIndex]) {
                          optionRefs.current[qIndex] = [];
                        }
                        optionRefs.current[qIndex][optIndex] = el;
                      }}
                      type="button"
                      onClick={() => selectOption(qIndex, optIndex)}
                      disabled={submitting}
                      aria-pressed={selected}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
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
              <div className="mt-4 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => goToQuestion(prevIndex(qIndex))}
                  disabled={qIndex === 0}
                >
                  ← Previous
                </Button>
                <span className="text-xs text-muted-foreground" aria-hidden="true">
                  {qIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => goToQuestion(nextIndex(qIndex))}
                  disabled={qIndex === QUIZ_QUESTIONS.length - 1}
                >
                  Next →
                </Button>
              </div>
              </div>
            </li>
            );
          })}
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
