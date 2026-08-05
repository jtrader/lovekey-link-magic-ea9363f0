import { createRouteFn, Outlet, useNavigate } from "@/lib/tanstack-shim";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createRouteFn("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }
  return <Outlet />;
}
