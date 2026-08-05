import { createRouteFn, Link } from "@/lib/tanstack-shim";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import {
  downloadQuizResultPdf,
  type ResultDetail,
} from "@/lib/quiz-result-pdf";

export const Route = createRouteFn("/r/$token")({
  head: () => ({
    meta: [
      { title: "Your RSP Quiz Result · Love Key Link" },
      {
        name: "description",
        content: "View and download your saved RSP Law of Vibration quiz result.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SharedResultPage,
});

type SharedResult = {
  name: string;
  score: number;
  total: number;
  passed: boolean;
  detail: ResultDetail[];
  createdAt: string;
  expiresAt: string;
};

function SharedResultPage() {
  const { token } = Route.useParams();
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; data: SharedResult }
  >({ status: "loading" });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/public/quiz-result/${token}`);
        const body = await res.json();
        if (!active) return;
        if (!res.ok) {
          setState({
            status: "error",
            message: body?.error ?? "Could not load this result.",
          });
          return;
        }
        setState({ status: "ready", data: body as SharedResult });
      } catch {
        if (active) {
          setState({ status: "error", message: "Could not load this result." });
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          {state.status === "loading" && (
            <p className="text-muted-foreground">Loading your result…</p>
          )}

          {state.status === "error" && (
            <>
              <h1 className="text-xl font-semibold">Result unavailable</h1>
              <p className="mt-2 text-muted-foreground">{state.message}</p>
              <div className="mt-8 flex justify-center gap-3">
                <Button asChild variant="outline">
                  <Link to="/quiz">Take the quiz</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </>
          )}

          {state.status === "ready" && (
            <>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Saved result
              </p>
              <h1 className="mt-4 text-5xl font-bold">
                {state.data.score}
                <span className="text-2xl text-muted-foreground">
                  /{state.data.total}
                </span>
              </h1>
              <p
                className={`mt-4 text-xl font-semibold ${
                  state.data.passed ? "text-primary" : "text-destructive"
                }`}
              >
                {state.data.passed ? "Passed 🎉" : "Not passed"}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {state.data.name} ·{" "}
                {new Date(state.data.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                This link expires{" "}
                {new Date(state.data.expiresAt).toLocaleDateString()}.
              </p>
              <div className="mt-8">
                <Button
                  onClick={() =>
                    downloadQuizResultPdf({
                      name: state.data.name,
                      score: state.data.score,
                      total: state.data.total,
                      passed: state.data.passed,
                      detail: state.data.detail,
                      date: new Date(state.data.createdAt).toLocaleString(),
                    })
                  }
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Download results PDF
                </Button>
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <Button asChild variant="outline">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
