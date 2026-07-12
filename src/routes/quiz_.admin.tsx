import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { getQuizAttempts, type QuizAttempt } from "@/lib/quiz-admin.functions";
import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/quiz_/admin")({
function QuizAdminPage() {
  const fetchAttempts = useServerFn(getQuizAttempts);

  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAttempts();
      setAttempts(res.attempts);
    } catch {
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAttempts]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-md px-6 py-24 text-center text-muted-foreground">
          Loading…
        </div>
      </main>
    );
  }

  const passedCount = attempts.filter((a) => a.passed).length;
  const toggleExpanded = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Quiz attempts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {attempts.length} total · {passedCount} passed
            </p>
          </div>
        </div>


        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Number</th>
                <th className="px-4 py-3 font-medium">Result</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Answers</th>
              </tr>
            </thead>
            <tbody>
              {attempts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No attempts yet.
                  </td>
                </tr>
              )}
              {attempts.map((a) => (
                <FragmentRow
                  key={a.id}
                  attempt={a}
                  open={!!expanded[a.id]}
                  onToggle={() => toggleExpanded(a.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function FragmentRow({
  attempt: a,
  open,
  onToggle,
}: {
  attempt: QuizAttempt;
  open: boolean;
  onToggle: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (open === prevOpen.current) return;
    if (open) {
      sectionRef.current?.focus();
    } else {
      buttonRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <tr className="border-t border-border">
        <td className="px-4 py-3">{a.name}</td>
        <td className="px-4 py-3">{a.phone}</td>
        <td className="px-4 py-3">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              a.passed
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {a.passed ? "Passed" : "Not passed"}
          </span>
        </td>
        <td className="px-4 py-3">
          {a.score}/{a.total}
        </td>
        <td className="px-4 py-3 text-muted-foreground">
          {new Date(a.createdAt).toLocaleString()}
        </td>
        <td className="px-4 py-3">
          {a.answers.length > 0 ? (
            <Button
              ref={buttonRef}
              variant="ghost"
              size="sm"
              onClick={onToggle}
              aria-expanded={open}
              aria-controls={`answers-${a.id}`}
              aria-label={`${open ? "Hide" : "View"} ${a.answers.length} answers for ${a.name}`}
            >
              {open ? "Hide" : `View (${a.answers.length})`}
            </Button>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
      </tr>
      {open && a.answers.length > 0 && (
        <tr className="border-t border-border bg-muted/30">
          <td colSpan={6} className="px-4 py-4">
            <section
              ref={sectionRef}
              id={`answers-${a.id}`}
              tabIndex={-1}
              aria-label={`Answers submitted by ${a.name}`}
              className="outline-none"
            >
              <ol className="space-y-3">
                {a.answers.map((ans, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium text-foreground">
                      {i + 1}. {ans.question}
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      <span className="sr-only">Selected answer: </span>
                      <span aria-hidden="true">Selected: </span>
                      <span className="font-medium text-foreground">
                        {ans.selected}
                      </span>
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </td>
        </tr>
      )}
    </>
  );
}
