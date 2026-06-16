import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { z } from "zod";
import lovekeyMark from "@/assets/lovekey-mark.png";
import { Camera, Users, Check, Copy, Plus, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Welcome — Love Key Link" }] }),
});

const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+0-9()\-\s]*$/, "Phone may contain digits, spaces, +, -, ()")
    .optional()
    .or(z.literal("")),
  avatar_url: z.string().url().max(500).optional().or(z.literal("")),
});
const familySchema = z.object({
  name: z.string().trim().min(1, "Please name your family hub").max(80),
  description: z.string().trim().max(280).optional().or(z.literal("")),
});

type Step = "profile" | "family" | "invite";
type ExistingFamilyRow = {
  families: { id: string; name: string } | { id: string; name: string }[] | null;
};

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("profile");
  const [familyId, setFamilyId] = useState<string | null>(null);

  // Load profile + membership; if already onboarded and in a family, skip to /app
  const { data, isLoading } = useQuery({
    queryKey: ["onboarding-status", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [{ data: profile }, { data: members }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
        supabase.from("family_members").select("family_id").eq("user_id", user!.id).limit(1),
      ]);
      return {
        profile,
        hasFamily: (members?.length ?? 0) > 0,
        familyId: members?.[0]?.family_id ?? null,
      };
    },
  });

  useEffect(() => {
    if (!data) return;
    if (data.profile?.onboarded && data.hasFamily) {
      navigate({ to: "/app" });
    } else if (data.profile?.full_name && !data.hasFamily) {
      setStep("family");
    }
    if (data.familyId) setFamilyId(data.familyId);
  }, [data, navigate]);

  if (isLoading) {
    return <CenterLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="mb-8 flex items-center gap-2">
          <img src={lovekeyMark} alt="Love Key" className="h-14 w-14" />
          <span className="font-semibold tracking-tight">
            Love Key <span className="text-primary">Link</span>
          </span>
        </div>

        <Stepper step={step} />

        <div className="mt-6 rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border">
          {step === "profile" && (
            <ProfileStep
              initial={data?.profile ?? null}
              userEmail={user?.email}
              onDone={() => setStep(data?.hasFamily ? "invite" : "family")}
            />
          )}
          {step === "family" && (
            <FamilyStep
              onCreated={(id) => {
                setFamilyId(id);
                setStep("invite");
              }}
            />
          )}
          {step === "invite" && familyId && (
            <InviteStep familyId={familyId} onDone={() => navigate({ to: "/app" })} />
          )}
        </div>
      </div>
    </div>
  );
}

function CenterLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-sm text-muted-foreground">Loading…</div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "profile", label: "Your profile" },
    { key: "family", label: "Family hub" },
    { key: "invite", label: "Invite" },
  ];
  const idx = steps.findIndex((s) => s.key === step);
  return (
    <ol className="flex items-center gap-2 text-xs text-muted-foreground">
      {steps.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium ${
              i <= idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {i < idx ? <Check className="h-3 w-3" /> : i + 1}
          </span>
          <span className={i === idx ? "text-foreground" : ""}>{s.label}</span>
          {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
        </li>
      ))}
    </ol>
  );
}

function ProfileStep({
  initial,
  userEmail,
  onDone,
}: {
  initial: { full_name: string | null; avatar_url: string | null; phone: string | null } | null;
  userEmail?: string;
  onDone: () => void;
}) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = async () => {
    const parsed = profileSchema.safeParse({ full_name: fullName, phone, avatar_url: avatarUrl });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user!.id,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      avatar_url: parsed.data.avatar_url || null,
      email: userEmail,
    });
    setSaving(false);
    if (error) {
      toast.error("Couldn't save your profile.");
      return;
    }
    onDone();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell your circle who you are. You can change any of this later.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted ring-1 ring-border">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Camera className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Photo URL</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://…"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.avatar_url && (
            <p className="mt-1 text-xs text-destructive">{errors.avatar_url}</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label className="text-xs text-muted-foreground">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jamie Lee"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name}</p>}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Phone (optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+61 4xx xxx xxx"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition ease-calm hover:opacity-95 disabled:opacity-60"
        >
          {saving ? (
            "Saving…"
          ) : (
            <>
              Continue <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function FamilyStep({ onCreated }: { onCreated: (id: string) => void }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user already has a family — give them a quick-skip option
  const { data: existing } = useQuery({
    queryKey: ["my-families", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("family_members")
        .select("families(id, name)")
        .eq("user_id", user!.id);
      return data ?? [];
    },
  });

  const create = async () => {
    const parsed = familySchema.safeParse({ name, description });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);
    const { data, error } = await supabase
      .from("families")
      .insert({
        name: parsed.data.name,
        description: parsed.data.description || null,
        created_by: user!.id,
      })
      .select("id")
      .single();
    setSaving(false);
    if (error || !data) {
      toast.error("Couldn't create the family hub.");
      return;
    }
    toast.success("Family hub created.");
    onCreated(data.id);
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Step two
      </div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        Has your first hub been created?
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A family hub is a private, trusted space for the people you coordinate with. It can later
        connect to recovery, community or Help Network support only by consent.
      </p>

      {existing && existing.length > 0 && (
        <div className="mt-5 rounded-2xl bg-surface-warm p-4 ring-1 ring-border">
          <p className="text-sm">You're already part of a family hub.</p>
          <button
            onClick={() => {
              const row = existing[0] as ExistingFamilyRow;
              const family = Array.isArray(row.families) ? row.families[0] : row.families;
              if (family) onCreated(family.id);
            }}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Continue with it <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4">
        <div>
          <label className="text-xs text-muted-foreground">Hub name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="The Lee Household"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">A short description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mum, Dad, two kids and Nan up the road."
            rows={3}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-destructive">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <button
          onClick={create}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition ease-calm hover:opacity-95 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {saving ? "Creating…" : "Create family hub"}
        </button>
      </div>
    </div>
  );
}

function InviteStep({ familyId, onDone }: { familyId: string; onDone: () => void }) {
  const { user } = useAuth();
  const [link, setLink] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const generate = async () => {
    setCreating(true);
    const { data, error } = await supabase
      .from("family_invites")
      .insert({ family_id: familyId, created_by: user!.id })
      .select("token")
      .single();
    setCreating(false);
    if (error || !data) {
      toast.error("Couldn't create invite link.");
      return;
    }
    const url = `${window.location.origin}/invite/${data.token}`;
    setLink(url);
  };

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    toast.success("Invite link copied.");
  };

  // Mark profile as onboarded when entering this step
  useEffect(() => {
    if (user) {
      supabase.from("profiles").update({ onboarded: true }).eq("id", user.id).then();
    }
  }, [user]);

  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Users className="h-3.5 w-3.5 text-primary" />
        Step three
      </div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Invite your people</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Generate a private link and share it however you like — message, email, in person. Anyone
        with the link can request to join your family hub. Share it only with trusted people. Links
        expire in 14 days.
      </p>

      {!link ? (
        <button
          onClick={generate}
          disabled={creating}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition ease-calm hover:opacity-95 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Generating…" : "Generate invite link"}
        </button>
      ) : (
        <div className="mt-6 rounded-2xl bg-surface-warm p-4 ring-1 ring-border">
          <div className="break-all rounded-md bg-background p-3 font-mono text-xs ring-1 ring-border">
            {link}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs ring-1 ring-border hover:bg-accent"
            >
              <Copy className="h-3 w-3" /> Copy link
            </button>
            <button
              onClick={generate}
              className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs ring-1 ring-border hover:bg-accent"
            >
              Generate another
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
        <button onClick={onDone} className="text-sm text-muted-foreground hover:text-foreground">
          Skip for now
        </button>
        <button
          onClick={onDone}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
        >
          Enter your link <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
