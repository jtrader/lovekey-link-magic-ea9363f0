import { supabase } from "@/integrations/supabase/client";
import type { HubType, PublicJoinMode, HubVisibility } from "@/lib/lovekey-model";

type CreateFamilyHubInput = {
  userId: string;
  name: string;
  hubType: HubType;
  description?: string | null;
  hubVisibility?: HubVisibility;
  publicJoinMode?: PublicJoinMode;
  plaintextPassword?: string | null;
  roleLabel?: string;
  locationLabel?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationAccuracyMeters?: number | null;
  locationCapturedAt?: string | null;
};

type CreateFamilyHubResult =
  | { id: string; error: null }
  | { id: null; error: { message: string; cause?: unknown } };

function isMissingCreateFamilyRpc(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.includes("Could not find the function public.create_family")
  );
}

async function createFamilyHubDirect(
  input: CreateFamilyHubInput,
  hubVisibility: HubVisibility,
  publicJoinMode: PublicJoinMode,
): Promise<CreateFamilyHubResult> {
  const { data: hub, error: insertError } = await supabase
    .from("families")
    .insert({
      name: input.name,
      hub_type: input.hubType,
      description: input.description ?? null,
      hub_visibility: hubVisibility,
      public_join_mode: publicJoinMode,
      location_label: input.locationLabel ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      location_accuracy_meters: input.locationAccuracyMeters ?? null,
      location_captured_at: input.locationCapturedAt ?? null,
      created_by: input.userId,
    })
    .select("id")
    .single();

  if (insertError || !hub?.id) {
    return {
      id: null,
      error: { message: insertError?.message ?? "Couldn't create the family hub.", cause: insertError },
    };
  }

  const { error: memberError } = await supabase.from("family_members").upsert(
    {
      family_id: hub.id,
      user_id: input.userId,
      role_label: input.roleLabel ?? "Member",
      member_kind: "owner",
      visibility_state: "summary",
      is_hub_admin: true,
    },
    { onConflict: "family_id,user_id" },
  );

  if (memberError) {
    console.warn("[createFamilyHub] Hub created, but membership metadata was not updated.", memberError);
  }

  return { id: hub.id, error: null };
}

async function createFamilyHubWithRpc(
  input: CreateFamilyHubInput,
  hubVisibility: HubVisibility,
  publicJoinMode: PublicJoinMode,
  plaintextPassword: string | null,
): Promise<CreateFamilyHubResult> {
  const { data: rpcId, error: rpcError } = await supabase.rpc("create_family", {
    _name: input.name,
    _hub_type: input.hubType,
    _description: input.description ?? undefined,
    _hub_visibility: hubVisibility,
    _public_join_mode: publicJoinMode,
    _plaintext_password: plaintextPassword ?? undefined,
    _role_label: input.roleLabel ?? "Member",
    _location_label: input.locationLabel ?? undefined,
    _latitude: input.latitude ?? undefined,
    _longitude: input.longitude ?? undefined,
    _location_accuracy_meters: input.locationAccuracyMeters ?? undefined,
    _location_captured_at: input.locationCapturedAt ?? undefined,
  });

  if (!rpcError && rpcId) return { id: rpcId, error: null };
  if (isMissingCreateFamilyRpc(rpcError) && plaintextPassword) {
    return {
      id: null,
      error: {
        message:
          "Password-protected public hubs need the create_family database function before they can be created.",
        cause: rpcError,
      },
    };
  }
  return {
    id: null,
    error: { message: rpcError?.message ?? "Couldn't create the family hub.", cause: rpcError },
  };
}

export async function createFamilyHub(input: CreateFamilyHubInput): Promise<CreateFamilyHubResult> {
  const hubVisibility = input.hubVisibility ?? "private";
  const publicJoinMode = hubVisibility === "public" ? (input.publicJoinMode ?? "invite") : "invite";
  const plaintextPassword = publicJoinMode === "password" ? input.plaintextPassword : null;

  if (!plaintextPassword) {
    return createFamilyHubDirect(input, hubVisibility, publicJoinMode);
  }

  return createFamilyHubWithRpc(input, hubVisibility, publicJoinMode, plaintextPassword);
}
