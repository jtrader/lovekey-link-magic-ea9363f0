import { createFileRoute } from "@tanstack/react-router";

type Body = {
  image?: string; // data URL
  style?: string;
  likeness?: number; // 0 (stylized) .. 100 (realistic)
  sourceType?: string; // 'uploaded' | 'live_capture'
};

// Resolve the signed-in user (if any) from the request bearer token — used only
// to attribute activity-log rows. Generation works with or without a session.
async function resolveUserId(request: Request): Promise<string | null> {
  const auth = request.headers.get("authorization");
  const token = auth?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supa = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data } = await supa.auth.getUser(token);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

async function logActivity(row: {
  user_id: string | null;
  style_preset?: string;
  likeness_level?: number;
  source_type?: string;
  status: "success" | "error";
  error_detail?: string;
}) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("avatar_activity_log").insert({ action: "generate", ...row });
  } catch {
    /* logging must never break generation */
  }
}


const STYLE_PROMPTS: Record<string, string> = {
  illustrated:
    "a clean modern digital illustration / cartoon avatar with bold clean linework and flat vibrant shading",
  painterly:
    "a soft painterly portrait avatar with visible brush strokes, warm lighting, in the style of a hand-painted illustration",
  "3d-render":
    "a friendly stylized 3D-rendered character avatar, smooth shading, soft studio lighting, Pixar-like",
  "line-art":
    "a minimalist single-weight line-art avatar, elegant continuous lines, mostly monochrome with a single accent color",
  photographic:
    "a polished, professionally-lit photographic-style headshot avatar with tasteful color grading and a clean background",
};

function buildPrompt(style: string, likeness: number) {
  const stylePhrase = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.illustrated;
  let fidelity: string;
  if (likeness >= 80) {
    fidelity =
      "Keep the person's real facial features, proportions, hairstyle and identity very accurate and clearly recognizable.";
  } else if (likeness >= 60) {
    fidelity =
      "Keep the person clearly recognizable while applying the artistic style.";
  } else if (likeness >= 40) {
    fidelity =
      "Balance real likeness with artistic stylization — recognizable but noticeably stylized.";
  } else if (likeness >= 20) {
    fidelity =
      "Lean strongly into the artistic style; keep only a loose resemblance to the original person.";
  } else {
    fidelity =
      "Fully reinterpret the person as an abstracted, heavily stylized character; keep only the general vibe, not an exact likeness.";
  }

  return [
    `Transform this portrait photo into ${stylePhrase}.`,
    fidelity,
    "This is a general-purpose profile-picture / avatar. Keep it wholesome and appropriate. Square composition, head and shoulders, pleasant simple background. Output only the image.",
  ].join(" ");
}

export const Route = createFileRoute("/api/avatar-generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return json({ error: "Invalid request body." }, 400);
        }

        const { image, style = "illustrated", likeness = 50, sourceType } = body;
        const userId = await resolveUserId(request);
        const clampLikeness = Math.max(0, Math.min(100, Math.round(likeness)));

        const fail = async (msg: string, status: number) => {
          await logActivity({
            user_id: userId,
            style_preset: style,
            likeness_level: clampLikeness,
            source_type: sourceType,
            status: "error",
            error_detail: `${status}: ${msg}`.slice(0, 300),
          });
          return json({ error: msg }, status);
        };

        if (!image || !image.startsWith("data:image/")) {
          return fail("A valid image is required.", 400);
        }
        if (image.length > 12_000_000) {
          return fail("Image is too large. Please use a smaller photo.", 413);
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return fail("Image generation is not configured.", 500);

        const prompt = buildPrompt(style, clampLikeness);

        let upstream: Response;
        try {
          upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: image } },
                  ],
                },
              ],
              modalities: ["image", "text"],
            }),
          });
        } catch {
          return fail("Could not reach the image generator. Try again.", 502);
        }

        if (upstream.status === 429)
          return fail("The generator is busy right now. Please try again in a moment.", 429);
        if (upstream.status === 402)
          return fail("Image generation credits are exhausted.", 402);

        if (!upstream.ok) {
          const txt = await upstream.text().catch(() => "");
          return fail(`Generation failed. ${txt.slice(0, 200)}`, 502);
        }

        const data = (await upstream.json().catch(() => null)) as
          | { data?: Array<{ b64_json?: string }> }
          | null;
        const b64 = data?.data?.[0]?.b64_json;
        if (!b64) {
          return fail("The generator did not return an image. Try a different photo or style.", 502);
        }

        await logActivity({
          user_id: userId,
          style_preset: style,
          likeness_level: clampLikeness,
          source_type: sourceType,
          status: "success",
        });
        return json({ image: `data:image/png;base64,${b64}` }, 200);

      },
    },
  },
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
