import { definePage, useNavigate } from "@/lib/router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import lovekeyMark from "@/assets/lovekey-mark.png";
import { Nucleus } from "@/components/Nucleus";

export const Route = definePage("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — Love Key Link" },
      { name: "description", content: "Sign in to Love Key Link with Google or Apple." },
    ],
  }),
});

function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<"google" | "apple" | "facebook" | null>(null);

  useEffect(() => {
    if (!loading && user) {
      const pending = typeof window !== "undefined" ? sessionStorage.getItem("pending_invite") : null;
      if (pending) {
        navigate({ to: "/invite/$token", params: { token: pending } });
      } else {
        navigate({ to: "/app" });
      }
    }
  }, [user, loading, navigate]);

  const signIn = async (provider: "google" | "apple") => {
    setBusy(provider);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin + "/app",
      });
      if (result.error) {
        toast.error("Sign-in failed. Please try again.");
        setBusy(null);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/app" });
    } catch {
      toast.error("Sign-in failed.");
      setBusy(null);
    }
  };

  const signInWithFacebook = async () => {
    setBusy("facebook");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: window.location.origin + "/app",
          // public_profile gives name + avatar; email gives email address;
          // user_friends returns mutual friends who have also connected this app
          // (user_friends requires Facebook App Review for production — works for test users now)
          scopes: "public_profile,email,user_friends",
        },
      });
      if (error) {
        toast.error("Facebook sign-in failed. Please try again.");
        setBusy(null);
      }
      // On success Supabase redirects — no further action needed here
    } catch {
      toast.error("Facebook sign-in failed.");
      setBusy(null);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-hero px-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <Nucleus />
      </div>
      <div className="relative w-full max-w-md rounded-3xl bg-card p-8 shadow-soft ring-1 ring-border">
        <div className="flex items-center gap-2">
          <img src={lovekeyMark} alt="Love Key" className="h-16 w-16" width={64} height={64} />
          <span className="text-lg font-semibold tracking-tight">
            Love Key <span className="text-primary">Link</span>
          </span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Coordination, not surveillance. Use the account you already trust.
        </p>

        <div className="mt-6 space-y-3">
          {/* Facebook — primary easy sign-in; imports name, photo and (with App Review) mutual friends */}
          <button
            onClick={signInWithFacebook}
            disabled={busy !== null}
            className="flex w-full items-center justify-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#1877F2" }}
          >
            <FacebookIcon />
            {busy === "facebook" ? "Connecting…" : "Continue with Facebook"}
          </button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={() => signIn("google")}
            disabled={busy !== null}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-accent disabled:opacity-60"
          >
            <GoogleIcon />
            {busy === "google" ? "Connecting…" : "Continue with Google"}
          </button>
          <button
            onClick={() => signIn("apple")}
            disabled={busy !== null}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
          >
            <AppleIcon />
            {busy === "apple" ? "Connecting…" : "Continue with Apple"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Facebook sign-in imports your name, profile photo and friend connections to help you build your hub. By continuing, you agree that Love Key Link stores your name, photo and email to identify you within your circle.
        </p>
      </div>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11.5 0 20-8.4 20-20.5 0-1.5-.2-2.9-.4-4.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.7 8.7 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.2-7.2 2.2-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 41.2 16.3 45.5 24 45.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C41 35.5 44 30.5 44 25c0-1.5-.2-2.9-.4-4.5z"/>
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.49 2.27-1.31 3.07-.86.83-2.18 1.46-3.27 1.39-.13-1.1.42-2.27 1.22-3.05.87-.86 2.34-1.5 3.36-1.41zM20.5 17.31c-.55 1.27-.81 1.84-1.51 2.97-1 1.6-2.4 3.6-4.13 3.62-1.55.02-1.95-1-4.06-.99-2.1.01-2.55 1.01-4.1.99-1.74-.02-3.06-1.83-4.06-3.43C-.16 16.66-.49 11.4 2.13 8.66c1.18-1.24 3.04-2.02 4.79-2.02 1.78 0 2.9 1 4.36 1 1.42 0 2.28-1 4.34-1 1.56 0 3.21.85 4.39 2.32-3.86 2.12-3.23 7.64.5 8.35z"/>
    </svg>
  );
}
