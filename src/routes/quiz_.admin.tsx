import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  adminLogin,
  adminLogout,
  getQuizAttempts,
  type QuizAttempt,
} from "@/lib/quiz-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/quiz_/admin")({
  head: () => ({
    meta: [
      { title: "Quiz Attempts · Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuizAdminPage,
});

function QuizAdminPage() {
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const fetchAttempts = useServerFn(getQuizAttempts);

  const [authorized, setAuthorized] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAttempts();
      setAuthorized(res.authorized);
      setAttempts(res.attempts);
    } catch {
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [fetchAttempts]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleLogin() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await login({ data: { email: email.trim(), password } });
      if (!res.ok) {
        setError("Incorrect email or password.");
        return;
      }
      setPassword("");
      await load();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    setAuthorized(false);
    setAttempts([]);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-md px-6 py-24 text-center text-muted-foreground">
          Loading…
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-md px-6 py-20">
          <h1 className="text-2xl font-bold">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to view quiz attempts.
          </p>
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleLogin();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button asChild variant="link">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
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
          <Button variant="outline" onClick={handleLogout}>
            Sign out
          </Button>
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
              id={`answers-${a.id}`}
              aria-label={`Answers submitted by ${a.name}`}
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
