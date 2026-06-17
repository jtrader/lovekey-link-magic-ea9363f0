import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
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
  Upload,
  Info,
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
  avatar_url: z
    .string()
    .trim()
    .max(1000)
    .refine(
      (value) =>
        !value ||
        value.startsWith("/avatar-presence/") ||
        z.string().url().safeParse(value).success,
      "Use a valid image URL or choose one of the Love Key avatars",
    )
    .optional()
    .or(z.literal("")),
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
type ProfileDraft = {
  fullName: string;
  phone: string;
  avatarUrl: string;
};
type FamilyDraft = {
  name: string;
  hubType: HubType;
  hubVisibility: HubVisibility;
  publicJoinMode: PublicJoinMode;
  publicPassword: string;
  roleLabel: HubRole;
  description: string;
  locationLabel: string;
  capturedLocation: CapturedLocation | null;
};

const genericAvatarChoices = Array.from(
  { length: 15 },
  (_, index) => `/avatar-presence/avatar-${String(index + 1).padStart(2, "0")}.png`,
);
const avatarMaxBytes = 5 * 1024 * 1024;
const avatarAccept = ".jpg,.jpeg,.png,.webp,.gif";
const avatarAllowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const avatarMimeByExtension: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};
const avatarExtensionByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const defaultProfileDraft: ProfileDraft = {
  fullName: "",
  phone: "",
  avatarUrl: "",
};

const defaultFamilyDraft: FamilyDraft = {
  name: "",
  hubType: "immediate_family",
  hubVisibility: "private",
  publicJoinMode: "invite",
  publicPassword: "",
  roleLabel: "Dad",
  description: "",
  locationLabel: "",
  capturedLocation: null,
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
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>(defaultProfileDraft);
  const [familyDraft, setFamilyDraft] = useState<FamilyDraft>(defaultFamilyDraft);
  const profileHydratedRef = useRef(false);
  const familyHydratedRef = useRef(false);

  // Load profile + membership; if already onboarded and in a family, skip to /app
  const { data, isLoading } = useQuery({
    queryKey: ["onboarding-status", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [{ data: profile }, { data: members }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
        supabase
          .from("family_members")
          .select(
            "family_id, role_label, families(id, name, description, hub_type, hub_visibility, public_join_mode, location_label, latitude, longitude, location_accuracy_meters)",
          )
          .eq("user_id", user!.id)
          .limit(1),
      ]);
      const member = members?.[0] as
        | {
            family_id: string;
            role_label: HubRole | null;
            families:
              | {
                  id: string;
                  name: string | null;
                  description: string | null;
                  hub_type: HubType | null;
                  hub_visibility: HubVisibility | null;
                  public_join_mode: PublicJoinMode | null;
                  location_label: string | null;
                  latitude: number | null;
                  longitude: number | null;
                  location_accuracy_meters: number | null;
                }
              | {
                  id: string;
                  name: string | null;
                  description: string | null;
                  hub_type: HubType | null;
                  hub_visibility: HubVisibility | null;
                  public_join_mode: PublicJoinMode | null;
                  location_label: string | null;
                  latitude: number | null;
                  longitude: number | null;
                  location_accuracy_meters: number | null;
                }[]
              | null;
          }
        | undefined;
      const family = Array.isArray(member?.families)
        ? (member.families[0] ?? null)
        : (member?.families ?? null);
      return {
        profile,
        hasFamily: (members?.length ?? 0) > 0,
        familyId: member?.family_id ?? null,
        member,
        family,
      };
    },
  });

  useEffect(() => {
    if (!data) return;
    if (!profileHydratedRef.current) {
      setProfileDraft({
        fullName: data.profile?.full_name ?? "",
        phone: data.profile?.phone ?? "",
        avatarUrl: data.profile?.avatar_url ?? "",
      });
      profileHydratedRef.current = true;
    }
    if (!familyHydratedRef.current && data.family) {
      setFamilyDraft({
        name: data.family.name ?? "",
        hubType: data.family.hub_type ?? "immediate_family",
        hubVisibility: data.family.hub_visibility ?? "private",
        publicJoinMode: data.family.public_join_mode ?? "invite",
        publicPassword: "",
        roleLabel: data.member?.role_label ?? "Dad",
        description: data.family.description ?? "",
        locationLabel: data.family.location_label ?? "",
        capturedLocation:
          data.family.latitude && data.family.longitude
            ? {
                latitude: data.family.latitude,
                longitude: data.family.longitude,
                accuracy: data.family.location_accuracy_meters,
              }
            : null,
      });
      familyHydratedRef.current = true;
    }
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
              draft={profileDraft}
              onDraftChange={setProfileDraft}
              userEmail={user?.email}
              onDone={() => setStep(data?.hasFamily ? "invite" : "family")}
              onBack={() => navigate({ to: "/" })}
            />
          )}
          {step === "family" && (
            <FamilyStep
              draft={familyDraft}
              onDraftChange={setFamilyDraft}
              familyId={familyId}
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
  draft,
  onDraftChange,
  userEmail,
  onDone,
  onBack,
}: {
  draft: ProfileDraft;
  onDraftChange: (draft: ProfileDraft) => void;
  userEmail?: string;
  onDone: () => void;
  onBack: () => void;
}) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateDraft = (patch: Partial<ProfileDraft>) => onDraftChange({ ...draft, ...patch });
  const { fullName, phone, avatarUrl } = draft;
  const facebookAvatarUrl =
    typeof user?.user_metadata?.picture === "string"
      ? user.user_metadata.picture
      : typeof user?.user_metadata?.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : "";

  const importFacebookPhoto = () => {
    if (!facebookAvatarUrl) {
      toast.error("No Facebook profile image is available for this account.");
      return;
    }
    updateDraft({ avatarUrl: facebookAvatarUrl });
    toast.success("Facebook profile image selected.");
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;

    const extension =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
    const contentType = avatarAllowedMimeTypes.has(file.type)
      ? file.type
      : avatarMimeByExtension[extension];

    if (!contentType) {
      toast.error("Upload a JPG, PNG, WebP or GIF image.");
      return;
    }
    if (file.size > avatarMaxBytes) {
      toast.error("Avatar images need to be under 5MB.");
      return;
    }

    setUploadingAvatar(true);
    const storageExtension = extension === "jpeg" ? "jpg" : extension || avatarExtensionByMime[contentType];
    const path = `${user.id}/avatar-${Date.now()}.${storageExtension}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      cacheControl: "3600",
      contentType,
      upsert: true,
    });
    setUploadingAvatar(false);

    if (error) {
      console.error(error);
      toast.error("Avatar upload failed. Please try another image.");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    updateDraft({ avatarUrl: data.publicUrl });
    toast.success("Avatar uploaded.");
  };

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

      <div className="mt-6 rounded-2xl bg-surface-warm p-4 ring-1 ring-border">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted ring-4 ring-white shadow-soft">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Camera className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">Your avatar</div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Use your Facebook photo, upload one, or choose a Love Key avatar.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={importFacebookPhoto}
                disabled={!facebookAvatarUrl}
                className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-xs font-medium ring-1 ring-border transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Camera className="h-3.5 w-3.5" />
                Import Facebook photo
              </button>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-card px-3 py-2 text-xs font-medium ring-1 ring-border transition hover:bg-accent">
                <Upload className="h-3.5 w-3.5" />
                {uploadingAvatar ? "Uploading..." : "Upload image"}
                <input
                  type="file"
                  accept={avatarAccept}
                  onChange={uploadAvatar}
                  disabled={uploadingAvatar}
                  className="sr-only"
                />
              </label>
              <div className="group relative inline-flex items-center">
                <button
                  type="button"
                  aria-label="Accepted avatar image formats"
                  aria-describedby="avatar-upload-help"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
                <div
                  id="avatar-upload-help"
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-xl bg-popover px-3 py-2 text-xs leading-relaxed text-popover-foreground opacity-0 shadow-soft ring-1 ring-border transition group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  Accepted formats: JPG, PNG, WebP or GIF. Maximum file size: 5MB.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            Choose a Love Key avatar
          </div>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
            {genericAvatarChoices.map((src) => {
              const selected = avatarUrl === src;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => updateDraft({ avatarUrl: src })}
                  aria-label="Choose this avatar"
                  aria-pressed={selected}
                  className={`aspect-square overflow-hidden rounded-full transition ${
                    selected
                      ? "ring-4 ring-primary"
                      : "ring-2 ring-white hover:ring-primary/50"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {avatarUrl.startsWith("/avatar-presence/") ? (
            <p className="text-xs text-muted-foreground">Using a bundled Love Key avatar.</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {avatarUrl ? "Using your selected profile image." : "No avatar selected yet."}
            </p>
          )}
          {avatarUrl ? (
            <button
              type="button"
              onClick={() => updateDraft({ avatarUrl: "" })}
              className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Remove avatar
            </button>
          ) : null}
        </div>
        {errors.avatar_url && <p className="mt-2 text-xs text-destructive">{errors.avatar_url}</p>}
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label className="text-xs text-muted-foreground">Full name</label>
          <input
            value={fullName}
            onChange={(e) => updateDraft({ fullName: e.target.value })}
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
            onChange={(e) => updateDraft({ phone: e.target.value })}
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

function FamilyStep({
  draft,
  onDraftChange,
  familyId,
  onBack,
  onCreated,
}: {
  draft: FamilyDraft;
  onDraftChange: (draft: FamilyDraft) => void;
  familyId: string | null;
  onBack: () => void;
  onCreated: (id: string) => void;
}) {
  const { user } = useAuth();
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateDraft = (patch: Partial<FamilyDraft>) => onDraftChange({ ...draft, ...patch });
  const {
    name,
    hubType,
    hubVisibility,
    publicJoinMode,
    publicPassword,
    roleLabel,
    description,
    locationLabel,
    capturedLocation,
  } = draft;
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
        updateDraft({
          capturedLocation: {
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracy: position.coords.accuracy ? Math.round(position.coords.accuracy) : null,
          },
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
    const familyPayload = {
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
    };
    // Use array select (not .single()) — if RLS blocks the SELECT return,
    // .single() errors even when the INSERT succeeded. Array access is resilient.
    const { data: familyRows, error } = familyId
      ? await supabase
          .from("families")
          .update(familyPayload)
          .eq("id", familyId)
          .select("id")
      : await supabase
          .from("families")
          .insert({
            ...familyPayload,
            created_by: user!.id,
          })
          .select("id");
    setSaving(false);

    // Surface the real Supabase error in devtools for debugging
    if (error) console.error("[onboarding] families insert/update error:", error);

    const hubId = familyRows?.[0]?.id ?? familyId;
    if (error || !hubId) {
      toast.error(
        error?.message
          ? `Hub error: ${error.message}`
          : familyId
            ? "Couldn't update the family hub."
            : "Couldn't create the family hub.",
      );
      return;
    }
    const { error: memberError } = await supabase
      .from("family_members")
      .upsert(
        {
          family_id: hubId,
          user_id: user!.id,
          role_label: parsed.data.role_label,
          member_kind: "owner",
          visibility_state: "summary",
          is_hub_admin: true,
        },
        { onConflict: "family_id,user_id" },
      );
    if (memberError) {
      console.error("[onboarding] family_members upsert error:", memberError);
      toast.error("Hub created, but your role could not be saved yet.");
      onCreated(hubId);
      return;
    }
    toast.success(familyId ? "Hub details saved." : "Hub created.");
    onCreated(hubId);
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
                    updateDraft({
                      hubType: type.value,
                      roleLabel: type.roleSuggestions[0],
                    });
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
                    updateDraft({
                      hubVisibility: option.value,
                      publicJoinMode: option.value === "private" ? "invite" : publicJoinMode,
                    });
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
                    onClick={() => updateDraft({ publicJoinMode: mode.value })}
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
                  onChange={(e) => updateDraft({ publicPassword: e.target.value })}
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
            onChange={(e) => updateDraft({ name: e.target.value })}
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
            onChange={(e) => updateDraft({ locationLabel: e.target.value })}
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
                onClick={() => updateDraft({ roleLabel: role })}
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
            onChange={(e) => updateDraft({ description: e.target.value })}
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
          {saving ? "Saving…" : familyId ? "Save hub details" : "Create hub"}
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
