const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const styles: Record<string, string> = {
  illustrated: "a clean modern digital illustration with bold linework and flat vibrant shading",
  painterly: "a soft hand-painted portrait with warm lighting",
  "3d-render": "a friendly stylized 3D-rendered character with soft studio lighting",
  "line-art": "minimalist single-weight line art with one accent color",
  photographic: "a polished professionally-lit photographic headshot",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await request.json();
    if (typeof body.image !== "string" || !body.image.startsWith("data:image/")) {
      return json({ error: "A valid image is required." }, 400);
    }
    if (body.image.length > 12_000_000) return json({ error: "Image is too large." }, 413);

    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) return json({ error: "Image generation is not configured." }, 500);
    const likeness = Math.max(0, Math.min(100, Math.round(Number(body.likeness) || 50)));
    const style = styles[body.style] ?? styles.illustrated;
    const fidelity = likeness >= 70
      ? "Keep the person's facial features and identity clearly recognizable."
      : likeness >= 40
        ? "Balance recognizable likeness with artistic stylization."
        : "Lean strongly into stylization while retaining the person's general character.";

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: `Transform this portrait into ${style}. ${fidelity} Square, wholesome head-and-shoulders profile picture.` },
            { type: "image_url", image_url: { url: body.image } },
          ],
        }],
        modalities: ["image", "text"],
      }),
    });
    if (!upstream.ok) return json({ error: "Image generation failed. Please try again." }, upstream.status);
    const result = await upstream.json();
    const image = result?.data?.[0]?.b64_json;
    return image
      ? json({ image: `data:image/png;base64,${image}` })
      : json({ error: "The generator did not return an image." }, 502);
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
