import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "avatar-creator";

const dataUrl = z
  .string()
  .regex(/^data:image\/(png|jpeg|jpg|webp);base64,/, "Must be an image data URL")
  .max(15_000_000);

function decodeDataUrl(url: string): { bytes: Uint8Array; contentType: string; ext: string } {
  const match = url.match(/^data:(image\/[a-z+]+);base64,(.*)$/i);
  if (!match) throw new Error("Invalid image data.");
  const contentType = match[1];
  const bytes = Uint8Array.from(Buffer.from(match[2], "base64"));
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  return { bytes, contentType, ext };
}

async function signed(supabase: any, path: string): Promise<string | null> {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

export const saveAvatar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        sourceImage: dataUrl,
        resultImage: dataUrl,
        sourceType: z.enum(["uploaded", "live_capture"]),
        style: z.string().min(1).max(40),
        likeness: z.number().int().min(0).max(100),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const src = decodeDataUrl(data.sourceImage);
    const res = decodeDataUrl(data.resultImage);
    const stamp = Date.now();
    const sourcePath = `${userId}/sources/${stamp}.${src.ext}`;
    const resultPath = `${userId}/results/${stamp}.${res.ext}`;

    const up1 = await supabase.storage
      .from(BUCKET)
      .upload(sourcePath, src.bytes, { contentType: src.contentType, upsert: false });
    if (up1.error) throw new Error(up1.error.message);

    const up2 = await supabase.storage
      .from(BUCKET)
      .upload(resultPath, res.bytes, { contentType: res.contentType, upsert: false });
    if (up2.error) throw new Error(up2.error.message);

    const insSource = await supabase
      .from("avatar_sources")
      .insert({ user_id: userId, source_type: data.sourceType, original_image_ref: sourcePath })
      .select("id")
      .single();
    if (insSource.error) throw new Error(insSource.error.message);

    const insResult = await supabase
      .from("avatar_results")
      .insert({
        user_id: userId,
        avatar_source_id: insSource.data.id,
        style_preset: data.style,
        likeness_level: data.likeness,
        generated_image_ref: resultPath,
        is_saved: true,
      })
      .select("id, style_preset, likeness_level, generated_image_ref, created_at")
      .single();
    if (insResult.error) throw new Error(insResult.error.message);

    // Admin-safe activity log (no photo data).
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("avatar_activity_log").insert({
        user_id: userId,
        action: "save",
        style_preset: data.style,
        likeness_level: data.likeness,
        source_type: data.sourceType,
        status: "success",
      });
    } catch {
      /* never block a save on logging */
    }

    return {
      id: insResult.data.id,
      style: insResult.data.style_preset,
      likeness: insResult.data.likeness_level,
      createdAt: insResult.data.created_at,
      url: await signed(supabase, resultPath),
    };
  });

export const listActivityLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await supabase
      .from("avatar_activity_log")
      .select("id, user_id, action, style_preset, likeness_level, source_type, status, error_detail, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });


export const listMyAvatars = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("avatar_results")
      .select("id, style_preset, likeness_level, generated_image_ref, created_at")
      .eq("is_saved", true)
      .order("created_at", { ascending: false })
      .limit(48);
    if (error) throw new Error(error.message);
    return Promise.all(
      (data ?? []).map(async (r) => ({
        id: r.id,
        style: r.style_preset,
        likeness: r.likeness_level,
        createdAt: r.created_at,
        url: await signed(supabase, r.generated_image_ref),
      })),
    );
  });

export const deleteAvatar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: row, error } = await supabase
      .from("avatar_results")
      .select("id, generated_image_ref, avatar_source_id, avatar_sources(original_image_ref)")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    const paths: string[] = [row.generated_image_ref];
    const sourceRef = (row as any).avatar_sources?.original_image_ref;
    if (sourceRef) paths.push(sourceRef);
    await supabase.storage.from(BUCKET).remove(paths);

    // Deleting the source cascades to the result row.
    await supabase.from("avatar_sources").delete().eq("id", row.avatar_source_id);
    return { ok: true };
  });
