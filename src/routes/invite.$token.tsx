import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import lovekeyMark from "@/assets/lovekey-mark.png";
import { Users, Check, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/invite/$token")({
  component: InvitePage,
  head: () => ({ meta: [{ title: "Join a family — LoveKey Link" }] }),
});

function InvitePage() {
  const { token } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "valid" | "expired" | "invalid">("loading");
  const [familyName, setFamilyName] = useState<string>("");
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("get_invite_by_token", { _token: token });
      if (error || !data || data.length === 0) {
        setStatus("invalid");
        return;
      }
      const invite = data[0] as { family_name: string; expires_at: string };
      if (new Date(invite.expires_at) < new Date()) {
        setFamilyName(invite.family_name);
        setStatus("expired");
        return;
      }
      setFamilyName(invite.family_name);
      setStatus("valid");
    })();
  }, [token]);

  const accept = async () => {
    if (!user) {
      // Persist token, send to login, return after sign-in
      sessionStorage.setItem("pending_invite", token);
      navigate({ to: "/login" });
      return;
    }
    setAccepting(true);
    const { error } = await supabase.rpc("accept_family_invite", { _token: token });
    setAccepting(false);
    if (error) {
      toast.error(error.message || "Couldn't accept invite.");
      return;
    }
    sessionStorage.removeItem("pending_invite");
    toast.success(`You're now part of ${familyName}.`);
    navigate({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-6">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-soft ring-1 ring-border">
        <div className="flex items-center gap-2">
          <img src={lovekeyMark} alt="LoveKey" className="h-7 w-7" />
          <span className="font-semibold tracking-tight">
            LoveKey <span className="text-primary">Link</span>
          </span>
        </div>

        {status === "loading" && (
          <p className="mt-6 text-sm text-muted-foreground">Looking up your invite…</p>
        )}

        {status === "invalid" && (
          <>
            <div className="mt-6 flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <h1 className="text-xl font-semibold tracking-tight">Invite not found</h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">This link is no longer valid. Ask whoever sent it for a fresh one.</p>
            <Link to="/" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Go home</Link>
          </>
        )}

        {status === "expired" && (
          <>
            <div className="mt-6 flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <h1 className="text-xl font-semibold tracking-tight">This invite expired</h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              The invite to <span className="font-medium text-foreground">{familyName}</span> has expired. Ask for a new one.
            </p>
          </>
        )}

        {status === "valid" && (
          <>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-primary" /> You've been invited
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Join {familyName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You'll join as an equal member. No ranking, no surveillance — just calm coordination.
            </p>
            <button
              onClick={accept}
              disabled={accepting || loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition ease-calm hover:opacity-95 disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              {accepting ? "Joining…" : user ? "Accept and join" : "Sign in to join"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
