import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
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
              </tr>
            </thead>
            <tbody>
              {attempts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No attempts yet.
                  </td>
                </tr>
              )}
              {attempts.map((a) => (
                <tr key={a.id} className="border-t border-border">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
