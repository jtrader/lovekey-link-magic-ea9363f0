import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  hubTypes,
  hubVisibilityOptions,
  privacyPreviewDefaults,
  publicJoinModes,
  type HubRole,
  type HubType,
  type HubVisibility,
  type PublicJoinMode,
} from "@/lib/lovekey-model";
import { toast } from "sonner";
import { z } from "zod";
import lovekeyMark from "@/assets/lovekey-mark.png";
import {
  Camera,
  Users,
  Check,
  Copy,
  Plus,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  LocateFixed,
  LockKeyhole,
  MapPin,
} from "lucide-react";

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
  hub_type: z.enum([
    "immediate_family",
    "birth_family",
    "blended_family",
    "co_parenting",
    "elder_care",
    "sporting_group",
    "book_club",
    "corporate_team",
    "recovery_circle",
  ]),
  role_label: z.string().trim().min(1, "Please choose your role").max(80),
  description: z.string().trim().max(280).optional().or(z.literal("")),
  hub_visibility: z.enum(["private", "public"]),
  public_join_mode: z.enum(["invite", "open", "password"]),
  public_password: z.string().trim().max(120).optional().or(z.literal("")),
  location_label: z.string().trim().max(120).optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  location_accuracy_meters: z.number().nonnegative().nullable(),
});

type Step = "profile" | "family" | "invite";
type ExistingFamilyRow = {
  families: { id: string; name: string } | { id: string; name: string }[] | null;
};
type CapturedLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

async function hashHubPassword(password: string) {
  if (!password.trim()) return null;
  const bytes = new TextEncoder().encode(password.trim());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

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
              onBack={() => navigate({ to: "/" })}
            />
          )}
          {step === "family" && (
            <FamilyStep
              onBack={() => setStep("profile")}
              onCreated={(id) => {
                setFamilyId(id);
                setStep("invite");
              }}
            />
          )}
          {step === "invite" && familyId && (
            <InviteStep
              familyId={familyId}
              onBack={() => setStep("family")}
              onDone={() => navigate({ to: "/app" })}
            />
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
  onBack,
}: {
  initial: { full_name: string | null; avatar_url: string | null; phone: string | null } | null;
  userEmail?: string;
  onDone: () => void;
  onBack: () => void;
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
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Camera className="h-3.5 w-3.5 text-primary" />
        Step one
      </div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Create your account profile.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Start with your name and presence identity. Your hub comes next, after your account has a
        human profile attached to it.
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

function FamilyStep({ onBack, onCreated }: { onBack: () => void; onCreated: (id: string) => void }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [hubType, setHubType] = useState<HubType>("immediate_family");
  const [hubVisibility, setHubVisibility] = useState<HubVisibility>("private");
  const [publicJoinMode, setPublicJoinMode] = useState<PublicJoinMode>("invite");
  const [publicPassword, setPublicPassword] = useState("");
  const [roleLabel, setRoleLabel] = useState<HubRole>("Dad");
  const [description, setDescription] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [capturedLocation, setCapturedLocation] = useState<CapturedLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedHubType = hubTypes.find((type) => type.value === hubType) ?? hubTypes[0];
  const roleSuggestions = selectedHubType.roleSuggestions;

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

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCapturedLocation({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracy: position.coords.accuracy ? Math.round(position.coords.accuracy) : null,
        });
        setLocating(false);
        toast.success("Location captured.");
      },
      () => {
        setLocating(false);
        toast.error("Location permission was not granted.");
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    );
  };

  const create = async () => {
    const parsed = familySchema.safeParse({
      name,
      hub_type: hubType,
      role_label: roleLabel,
      description,
      hub_visibility: hubVisibility,
      public_join_mode: hubVisibility === "public" ? publicJoinMode : "invite",
      public_password: publicPassword,
      location_label: locationLabel,
      latitude: capturedLocation?.latitude ?? null,
      longitude: capturedLocation?.longitude ?? null,
      location_accuracy_meters: capturedLocation?.accuracy ?? null,
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    if (parsed.data.hub_visibility === "public" && !parsed.data.latitude) {
      setErrors({ location: "Public hubs need a location so nearby users can find them." });
      return;
    }
    if (parsed.data.public_join_mode === "password" && !parsed.data.public_password) {
      setErrors({ public_password: "Add a password or choose another public access mode." });
      return;
    }
    setErrors({});
    setSaving(true);
    const publicPasswordHash =
      parsed.data.hub_visibility === "public" && parsed.data.public_join_mode === "password"
        ? await hashHubPassword(parsed.data.public_password ?? "")
        : null;
    const { data, error } = await supabase
      .from("families")
      .insert({
        name: parsed.data.name,
        hub_type: parsed.data.hub_type,
        description: parsed.data.description || null,
        hub_visibility: parsed.data.hub_visibility,
        public_join_mode:
          parsed.data.hub_visibility === "public" ? parsed.data.public_join_mode : "invite",
        public_password_hash: publicPasswordHash,
        location_label: parsed.data.location_label || null,
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        location_accuracy_meters: parsed.data.location_accuracy_meters,
        location_captured_at: parsed.data.latitude ? new Date().toISOString() : null,
        created_by: user!.id,
      })
      .select("id")
      .single();
    setSaving(false);
    if (error || !data) {
      toast.error("Couldn't create the family hub.");
      return;
    }
    const { error: memberError } = await supabase
      .from("family_members")
      .update({
        role_label: parsed.data.role_label,
        member_kind: "owner",
        visibility_state: "summary",
        is_hub_admin: true,
      })
      .eq("family_id", data.id)
      .eq("user_id", user!.id);
    if (memberError) {
      toast.error("Hub created, but your role could not be saved yet.");
      onCreated(data.id);
      return;
    }
    toast.success("Hub created.");
    onCreated(data.id);
  };

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </button>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Step two
      </div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Create your first hub.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose the kind of private space you need now. Love Key keeps the language human while the
        hub type quietly shapes the purpose, invites and coordination patterns.
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
          <label className="text-xs text-muted-foreground">Hub type</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {hubTypes.map((type) => {
              const active = type.value === hubType;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setHubType(type.value);
                    setRoleLabel(type.roleSuggestions[0]);
                  }}
                  className={`min-h-32 rounded-2xl border p-3 text-left transition ease-calm ${
                    active
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-background hover:border-primary/50 hover:bg-accent/40"
                  }`}
                  aria-pressed={active}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-medium text-foreground">{type.label}</span>
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                    </span>
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                    {type.members}
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-foreground/75">
                    {type.purpose}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.hub_type && <p className="mt-1 text-xs text-destructive">{errors.hub_type}</p>}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Hub visibility</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {hubVisibilityOptions.map((option) => {
              const active = hubVisibility === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setHubVisibility(option.value);
                    if (option.value === "private") setPublicJoinMode("invite");
                  }}
                  className={`rounded-2xl border p-4 text-left transition ease-calm ${
                    active
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {option.value === "private" ? (
                      <LockKeyhole className="h-4 w-4 text-primary" />
                    ) : (
                      <Users className="h-4 w-4 text-primary" />
                    )}
                    {option.label}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        {hubVisibility === "public" && (
          <div>
            <label className="text-xs text-muted-foreground">Public access</label>
            <div className="mt-2 grid gap-2">
              {publicJoinModes.map((mode) => {
                const active = publicJoinMode === mode.value;
                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setPublicJoinMode(mode.value)}
                    className={`rounded-2xl border p-3 text-left transition ease-calm ${
                      active
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">{mode.label}</div>
                    <div className="text-xs text-muted-foreground">{mode.description}</div>
                  </button>
                );
              })}
            </div>
            {publicJoinMode === "password" && (
              <div className="mt-3">
                <label className="text-xs text-muted-foreground">Shared hub password</label>
                <input
                  type="password"
                  value={publicPassword}
                  onChange={(e) => setPublicPassword(e.target.value)}
                  placeholder="Create a shared password"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {errors.public_password && (
                  <p className="mt-1 text-xs text-destructive">{errors.public_password}</p>
                )}
              </div>
            )}
          </div>
        )}
        <div>
          <label className="text-xs text-muted-foreground">Hub name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={selectedHubType.namePlaceholder}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="rounded-2xl bg-surface-warm p-4 ring-1 ring-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                Hub location
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Used for nearby public hub search. Private hub locations stay private to members.
              </p>
            </div>
            <button
              type="button"
              onClick={captureLocation}
              disabled={locating}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-60"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              {locating ? "Locating..." : "Use my location"}
            </button>
          </div>
          <input
            value={locationLabel}
            onChange={(e) => setLocationLabel(e.target.value)}
            placeholder="Optional label, e.g. Bendigo Library or North Melbourne"
            className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {capturedLocation ? (
            <div className="mt-3 rounded-xl bg-card px-3 py-2 text-xs text-muted-foreground ring-1 ring-border">
              Captured approximate location: {capturedLocation.latitude},{" "}
              {capturedLocation.longitude}
              {capturedLocation.accuracy ? ` · about ${capturedLocation.accuracy}m accuracy` : ""}
            </div>
          ) : (
            <div className="mt-3 text-xs text-muted-foreground">
              No location captured yet. Public hubs require this before creation.
            </div>
          )}
          {errors.location && <p className="mt-2 text-xs text-destructive">{errors.location}</p>}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Your role in this hub</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {roleSuggestions.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleLabel(role)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ease-calm ${
                  roleLabel === role
                    ? "border-primary/30 bg-primary/5 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          {errors.role_label && (
            <p className="mt-1 text-xs text-destructive">{errors.role_label}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">A short description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={selectedHubType.purpose}
            rows={3}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-destructive">{errors.description}</p>
          )}
        </div>
        <div className="rounded-2xl bg-surface-warm p-4 ring-1 ring-border">
          <div className="text-sm font-medium">What others can see</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Your first hub starts with privacy-first defaults. You can pause, reduce or revoke
            visibility later.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {privacyPreviewDefaults.map(({ Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 ring-1 ring-border"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <div>
                  <div className="text-xs font-medium">{label}</div>
                  <div className="text-[11px] text-muted-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <button
          onClick={create}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition ease-calm hover:opacity-95 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {saving ? "Creating…" : "Create hub"}
        </button>
      </div>
    </div>
  );
}

function InviteStep({
  familyId,
  onBack,
  onDone,
}: {
  familyId: string;
  onBack: () => void;
  onDone: () => void;
}) {
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
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to hub setup
      </button>
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
