import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "avatar-creator";

const dataUrl = z
  .string()
  .regex(/^data:image\/(png|jpeg|jpg|webp);base64,/, "Must be an image data URL")
  .max(15_000_000);

function decodeDataUrl(url: string): { bytes: Uint8Array; contentType: string; ext: string } {
  const match = url.match(/^data:(image\/[a-z+]+);base64,(.*)$/i);
  if (!match) throw new Error("Invalid image data.");
  const binary = atob(match[2]);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const contentType = match[1];
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  return { bytes, contentType, ext };
}

async function currentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Sign in to manage saved avatars.");
  return data.user.id;
}

async function signed(path: string): Promise<string | null> {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

type SaveAvatarInput = {
  sourceImage: string;
  resultImage: string;
  sourceType: "uploaded" | "live_capture";
  style: string;
  likeness: number;
};

export async function saveAvatar({ data }: { data: SaveAvatarInput }) {
  const input = z
    .object({
      sourceImage: dataUrl,
      resultImage: dataUrl,
      sourceType: z.enum(["uploaded", "live_capture"]),
      style: z.string().min(1).max(40),
      likeness: z.number().int().min(0).max(100),
    })
    .parse(data);
  const userId = await currentUserId();
  const source = decodeDataUrl(input.sourceImage);
  const result = decodeDataUrl(input.resultImage);
  const stamp = Date.now();
  const sourcePath = `${userId}/sources/${stamp}.${source.ext}`;
  const resultPath = `${userId}/results/${stamp}.${result.ext}`;

  const sourceUpload = await supabase.storage
    .from(BUCKET)
    .upload(sourcePath, source.bytes, { contentType: source.contentType, upsert: false });
  if (sourceUpload.error) throw new Error(sourceUpload.error.message);

  const resultUpload = await supabase.storage
    .from(BUCKET)
    .upload(resultPath, result.bytes, { contentType: result.contentType, upsert: false });
  if (resultUpload.error) throw new Error(resultUpload.error.message);

  const sourceRow = await supabase
    .from("avatar_sources")
    .insert({ user_id: userId, source_type: input.sourceType, original_image_ref: sourcePath })
    .select("id")
    .single();
  if (sourceRow.error) throw new Error(sourceRow.error.message);

  const resultRow = await supabase
    .from("avatar_results")
    .insert({
      user_id: userId,
      avatar_source_id: sourceRow.data.id,
      style_preset: input.style,
      likeness_level: input.likeness,
      generated_image_ref: resultPath,
      is_saved: true,
    })
    .select("id, style_preset, likeness_level, generated_image_ref, created_at")
    .single();
  if (resultRow.error) throw new Error(resultRow.error.message);

  return {
    id: resultRow.data.id,
    style: resultRow.data.style_preset,
    likeness: resultRow.data.likeness_level,
    createdAt: resultRow.data.created_at,
    url: await signed(resultPath),
  };
}

export async function listMyAvatars(_input: Record<string, never>) {
  const userId = await currentUserId();
  const { data, error } = await supabase
    .from("avatar_results")
    .select("id, style_preset, likeness_level, generated_image_ref, created_at")
    .eq("user_id", userId)
    .eq("is_saved", true)
    .order("created_at", { ascending: false })
    .limit(48);
  if (error) throw new Error(error.message);

  return Promise.all(
    (data ?? []).map(async (row) => ({
      id: row.id,
      style: row.style_preset,
      likeness: row.likeness_level,
      createdAt: row.created_at,
      url: await signed(row.generated_image_ref),
    })),
  );
}

export async function deleteAvatar({ data }: { data: { id: string } }) {
  const userId = await currentUserId();
  const input = z.object({ id: z.string().uuid() }).parse(data);
  const { data: row, error } = await supabase
    .from("avatar_results")
    .select("id, generated_image_ref, avatar_source_id, avatar_sources(original_image_ref)")
    .eq("id", input.id)
    .eq("user_id", userId)
    .single();
  if (error) throw new Error(error.message);

  const paths = [row.generated_image_ref];
  const sourceRef = (row as { avatar_sources?: { original_image_ref?: string } }).avatar_sources
    ?.original_image_ref;
  if (sourceRef) paths.push(sourceRef);
  await supabase.storage.from(BUCKET).remove(paths);
  await supabase.from("avatar_sources").delete().eq("id", row.avatar_source_id).eq("user_id", userId);
  return { ok: true };
}
