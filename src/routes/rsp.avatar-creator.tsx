import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { saveAvatar, listMyAvatars, deleteAvatar } from "@/lib/avatar.functions";

export const Route = createFileRoute("/rsp/avatar-creator")({
  head: () => ({
    meta: [
      { title: "Avatar Creator — Make an AI profile picture · Identity Avatars" },
      {
        name: "description",
        content:
          "Upload or snap a photo and turn it into a stylized AI avatar. A likeness gauge lets you dial the result from close to your real photo to fully stylized.",
      },
      { property: "og:title", content: "Avatar Creator" },
      {
        property: "og:description",
        content:
          "Turn a photo into a stylized profile picture, with a likeness gauge to control how closely it resembles you.",
      },
    ],
  }),
  component: AvatarCreator,
});

// ─── Config ──────────────────────────────────────────────────────────────
type SourceType = "uploaded" | "live_capture";

const STYLES = [
  { id: "illustrated", label: "Illustrated", desc: "Bold, flat digital illustration" },
  { id: "painterly", label: "Painterly", desc: "Soft hand-painted portrait" },
  { id: "3d-render", label: "3D render", desc: "Friendly stylized 3D character" },
  { id: "line-art", label: "Line art", desc: "Minimal single-weight linework" },
  { id: "photographic", label: "Enhanced photo", desc: "Polished studio headshot" },
] as const;

// Discrete likeness steps — avoids per-drag regeneration cost.
const LIKENESS_STEPS = [10, 30, 50, 70, 90];
const STEP_LABELS = ["Very stylized", "Stylized", "Balanced", "Recognizable", "Realistic"];

const EXPORT_SIZES = [
  { label: "Full", size: 0 },
  { label: "1024px", size: 1024 },
  { label: "512px", size: 512 },
  { label: "400px", size: 400 },
];

type Screen = "input" | "style" | "result";

// ─── Image helpers ─────────────────────────────────────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = src;
  });
}

// Center-crop to square and downscale.
async function toSquareDataUrl(src: string, max = 1024): Promise<{ url: string; w: number; h: number }> {
  const img = await loadImage(src);
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const out = Math.min(side, max);
  const canvas = document.createElement("canvas");
  canvas.width = out;
  canvas.height = out;
  const ctx = canvas.getContext("2d")!;
  const sx = (img.naturalWidth - side) / 2;
  const sy = (img.naturalHeight - side) / 2;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
  return { url: canvas.toDataURL("image/jpeg", 0.92), w: img.naturalWidth, h: img.naturalHeight };
}

async function resizeDataUrl(src: string, size: number): Promise<string> {
  if (!size) return src;
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  return canvas.toDataURL("image/png");
}

function download(dataUrl: string, name: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Best-effort face validation. Uses the browser FaceDetector where available.
async function validateFace(src: string): Promise<string | null> {
  const img = await loadImage(src);
  if (Math.min(img.naturalWidth, img.naturalHeight) < 256) {
    return "That image is a bit small. Please use a photo at least 256×256 pixels.";
  }
  const FD = (window as any).FaceDetector;
  if (typeof FD === "function") {
    try {
      const detector = new FD({ fastMode: true, maxDetectedFaces: 5 });
      const faces = await detector.detect(img);
      if (!faces || faces.length === 0) {
        return "We couldn't find a face in that photo. Please use a clear, front-facing portrait.";
      }
      if (faces.length > 1) {
        return "We found more than one face. Please use a photo with just you, or crop to one face.";
      }
    } catch {
      /* detector unavailable — fall through to allow */
    }
  }
  return null;
}

// ─── Component ───────────────────────────────────────────────────────────────
function AvatarCreator() {
  const { user } = useAuth();
  const save = useServerFn(saveAvatar);
  const listSaved = useServerFn(listMyAvatars);
  const removeSaved = useServerFn(deleteAvatar);

  const [screen, setScreen] = useState<Screen>("input");
  const [sourceType, setSourceType] = useState<SourceType>("uploaded");
  const [original, setOriginal] = useState<string | null>(null);
  const [style, setStyle] = useState<string>(STYLES[0].id);
  const [stepIdx, setStepIdx] = useState(2);
  const [inputError, setInputError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [compare, setCompare] = useState(false);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const [result, setResult] = useState<string | null>(null);

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [exportSize, setExportSize] = useState(0);

  const likeness = LIKENESS_STEPS[stepIdx];
  const cacheKey = (s: string, l: number) => `${s}:${l}`;

  // ── Camera ──
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  async function startCamera() {
    setInputError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      setSourceType("live_capture");
      queueMicrotask(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setInputError("We couldn't access your camera. Check permissions, or upload a photo instead.");
    }
  }

  async function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    const side = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = side;
    canvas.height = side;
    const ctx = canvas.getContext("2d")!;
    const sx = (video.videoWidth - side) / 2;
    const sy = (video.videoHeight - side) / 2;
    ctx.drawImage(video, sx, sy, side, side, 0, 0, side, side);
    const raw = canvas.toDataURL("image/jpeg", 0.92);
    stopCamera();
    await acceptImage(raw, "live_capture");
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/image\/(jpe?g|png|heic|heif|webp)/i.test(file.type) && !/\.hei[cf]$/i.test(file.name)) {
      setInputError("Please choose a JPG, PNG or HEIC image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => acceptImage(String(reader.result), "uploaded");
    reader.onerror = () => setInputError("We couldn't read that file. Try another photo.");
    reader.readAsDataURL(file);
  }

  async function acceptImage(raw: string, type: SourceType) {
    setInputError(null);
    setValidating(true);
    try {
      const err = await validateFace(raw);
      if (err) {
        setInputError(err);
        return;
      }
      const { url } = await toSquareDataUrl(raw, 1024);
      cacheRef.current.clear();
      setOriginal(url);
      setResult(null);
      setSourceType(type);
      setScreen("style");
    } catch (e) {
      setInputError(e instanceof Error ? e.message : "Something went wrong reading that image.");
    } finally {
      setValidating(false);
    }
  }

  const generate = useCallback(
    async (s: string, l: number) => {
      if (!original) return;
      const key = cacheKey(s, l);
      const cached = cacheRef.current.get(key);
      if (cached) {
        setResult(cached);
        setGenError(null);
        return;
      }
      setGenerating(true);
      setGenError(null);
      try {
        const res = await fetch("/api/avatar-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: original, style: s, likeness: l }),
        });
        const body = (await res.json().catch(() => ({}))) as { image?: string; error?: string };
        if (!res.ok || !body.image) {
          setGenError(body.error ?? "Generation failed. Please try again.");
          return;
        }
        cacheRef.current.set(key, body.image);
        setResult(body.image);
      } catch {
        setGenError("We couldn't reach the avatar generator. Please try again.");
      } finally {
        setGenerating(false);
      }
    },
    [original],
  );

  // Start first generation when entering the result screen.
  async function startGeneration() {
    setScreen("result");
    setSaveState("idle");
    setSaveMsg(null);
    await generate(style, likeness);
  }

  function changeStep(idx: number) {
    setStepIdx(idx);
    setSaveState("idle");
    generate(style, LIKENESS_STEPS[idx]);
  }

  function changeStyle(id: string) {
    setStyle(id);
    setSaveState("idle");
    generate(id, likeness);
  }

  function startOver() {
    setResult(null);
    setGenError(null);
    setSaveState("idle");
    setSaveMsg(null);
    setScreen("style");
  }

  function newPhoto() {
    stopCamera();
    cacheRef.current.clear();
    setOriginal(null);
    setResult(null);
    setInputError(null);
    setSaveState("idle");
    setScreen("input");
  }

  async function handleExport() {
    if (!result) return;
    const sized = await resizeDataUrl(result, exportSize);
    download(sized, `avatar-${style}-${likeness}${exportSize ? `-${exportSize}` : ""}.png`);
  }

  async function handleSave() {
    if (!result || !original) return;
    if (!user) return;
    setSaveState("saving");
    setSaveMsg(null);
    try {
      await save({
        data: { sourceImage: original, resultImage: result, sourceType, style, likeness },
      });
      setSaveState("saved");
      setSaveMsg("Saved to your account.");
      loadGallery();
    } catch (e) {
      setSaveState("error");
      setSaveMsg(e instanceof Error ? e.message : "Could not save. Please try again.");
    }
  }

  // ── Saved gallery ──
  const [gallery, setGallery] = useState<
    { id: string; url: string | null; style: string; likeness: number }[]
  >([]);
  const loadGallery = useCallback(() => {
    if (!user) return;
    listSaved({})
      .then((rows) => setGallery(rows as any))
      .catch(() => {});
  }, [user, listSaved]);
  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  async function handleDelete(id: string) {
    try {
      await removeSaved({ data: { id } });
      setGallery((g) => g.filter((x) => x.id !== id));
    } catch {
      /* noop */
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="rsp-section avc-root">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Identity Avatars · Tool</div>
          <h2 className="rsp-h2">Avatar Creator</h2>
          <p className="rsp-lead">
            Turn a photo into a stylized profile picture. The likeness gauge lets you dial the result
            from close to your real photo all the way to clearly stylized.
          </p>
        </div>

        {/* Stepper */}
        <ol className="avc-steps" aria-label="Progress">
          {(["input", "style", "result"] as Screen[]).map((s, i) => (
            <li key={s} className={`avc-step ${screen === s ? "is-active" : ""}`}>
              <span className="avc-step-num">{i + 1}</span>
              <span>{s === "input" ? "Photo" : s === "style" ? "Style" : "Generate"}</span>
            </li>
          ))}
        </ol>

        {/* ── Screen 1: input ── */}
        {screen === "input" && (
          <div className="avc-card">
            {!cameraOn ? (
              <>
                <div className="avc-inputs">
                  <label className="avc-drop">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/heic,image/heif,image/webp,.heic,.heif"
                      onChange={onFile}
                      className="avc-file"
                    />
                    <span className="avc-drop-icon" aria-hidden>⬆</span>
                    <span className="avc-drop-title">Upload a photo</span>
                    <span className="avc-drop-sub">JPG, PNG or HEIC</span>
                  </label>
                  <button type="button" className="avc-drop avc-drop-btn" onClick={startCamera}>
                    <span className="avc-drop-icon" aria-hidden>◉</span>
                    <span className="avc-drop-title">Use your camera</span>
                    <span className="avc-drop-sub">Front-facing selfie</span>
                  </button>
                </div>

                {validating && <p className="avc-note avc-info">Checking your photo…</p>}
                {inputError && (
                  <p className="avc-note avc-error" role="alert">
                    {inputError}
                  </p>
                )}

                <div className="avc-privacy">
                  <strong>Your photo, handled with care.</strong> When you generate, your photo is
                  sent once to our AI provider to create the avatar. It is <strong>not stored</strong>{" "}
                  by this app unless you choose “Save to my account”. If you do save, both your photo
                  and the avatar are kept privately in your account until you delete them — you can
                  remove them any time below. We never use your photo for anything other than
                  generating your avatar.
                </div>
              </>
            ) : (
              <div className="avc-camera">
                <video ref={videoRef} className="avc-video" playsInline muted aria-label="Camera preview" />
                <div className="avc-actions">
                  <button type="button" className="rsp-btn-primary" onClick={capture}>
                    Capture
                  </button>
                  <button type="button" className="avc-btn-ghost" onClick={stopCamera}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Screen 2: style ── */}
        {screen === "style" && original && (
          <div className="avc-card">
            <div className="avc-style-head">
              <img src={original} alt="Your uploaded photo" className="avc-thumb" />
              <div>
                <h3 className="avc-h3">Pick a starting style</h3>
                <p className="avc-muted">
                  You can switch styles and fine-tune the likeness on the next screen.
                </p>
              </div>
            </div>
            <div className="avc-style-grid" role="radiogroup" aria-label="Avatar style">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={style === s.id}
                  className={`avc-style ${style === s.id ? "is-sel" : ""}`}
                  onClick={() => setStyle(s.id)}
                >
                  <span className="avc-style-label">{s.label}</span>
                  <span className="avc-style-desc">{s.desc}</span>
                </button>
              ))}
            </div>
            <div className="avc-actions">
              <button type="button" className="rsp-btn-primary" onClick={startGeneration}>
                Generate avatar →
              </button>
              <button type="button" className="avc-btn-ghost" onClick={newPhoto}>
                Use a different photo
              </button>
            </div>
          </div>
        )}

        {/* ── Screen 3: result ── */}
        {screen === "result" && original && (
          <div className="avc-card">
            <div className="avc-result-grid">
              <div className="avc-stage">
                <div className={`avc-canvas ${compare ? "is-compare" : ""}`}>
                  {compare && <img src={original} alt="Your original photo" className="avc-img" />}
                  <div className="avc-img-wrap">
                    {generating && (
                      <div className="avc-loading" aria-live="polite">
                        <div className="avc-spinner" aria-hidden />
                        <span>Creating your avatar…</span>
                      </div>
                    )}
                    {result ? (
                      <img
                        src={result}
                        alt="Generated avatar"
                        className={`avc-img ${generating ? "is-dim" : ""}`}
                      />
                    ) : (
                      !generating && <div className="avc-placeholder">No avatar yet</div>
                    )}
                  </div>
                </div>
                <div className="avc-stage-tools">
                  <label className="avc-toggle">
                    <input
                      type="checkbox"
                      checked={compare}
                      onChange={(e) => setCompare(e.target.checked)}
                    />
                    Compare with original
                  </label>
                </div>
              </div>

              <div className="avc-controls">
                <div className="avc-gauge">
                  <div className="avc-gauge-head">
                    <label htmlFor="avc-likeness" className="avc-h3">
                      Likeness
                    </label>
                    <span className="avc-gauge-val">{STEP_LABELS[stepIdx]}</span>
                  </div>
                  <input
                    id="avc-likeness"
                    className="avc-slider"
                    type="range"
                    min={0}
                    max={LIKENESS_STEPS.length - 1}
                    step={1}
                    value={stepIdx}
                    onChange={(e) => changeStep(Number(e.target.value))}
                    aria-valuetext={STEP_LABELS[stepIdx]}
                    list="avc-ticks"
                  />
                  <datalist id="avc-ticks">
                    {LIKENESS_STEPS.map((_, i) => (
                      <option key={i} value={i} />
                    ))}
                  </datalist>
                  <div className="avc-gauge-ends">
                    <span>Stylized</span>
                    <span>Realistic</span>
                  </div>
                </div>

                <div className="avc-field">
                  <span className="avc-field-label">Style</span>
                  <div className="avc-chip-row">
                    {STYLES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`avc-chip ${style === s.id ? "is-sel" : ""}`}
                        onClick={() => changeStyle(s.id)}
                        disabled={generating}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {genError && (
                  <p className="avc-note avc-error" role="alert">
                    {genError}{" "}
                    <button type="button" className="avc-link" onClick={() => generate(style, likeness)}>
                      Retry
                    </button>
                  </p>
                )}

                <div className="avc-field">
                  <span className="avc-field-label">Export size</span>
                  <div className="avc-chip-row">
                    {EXPORT_SIZES.map((sz) => (
                      <button
                        key={sz.label}
                        type="button"
                        className={`avc-chip ${exportSize === sz.size ? "is-sel" : ""}`}
                        onClick={() => setExportSize(sz.size)}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="avc-actions avc-actions-wrap">
                  <button
                    type="button"
                    className="rsp-btn-primary"
                    onClick={handleExport}
                    disabled={!result || generating}
                  >
                    Download
                  </button>
                  {user ? (
                    <button
                      type="button"
                      className="avc-btn-outline"
                      onClick={handleSave}
                      disabled={!result || generating || saveState === "saving"}
                    >
                      {saveState === "saving"
                        ? "Saving…"
                        : saveState === "saved"
                          ? "Saved ✓"
                          : "Save to my account"}
                    </button>
                  ) : (
                    <Link to="/login" className="avc-btn-outline">
                      Sign in to save
                    </Link>
                  )}
                  <button type="button" className="avc-btn-ghost" onClick={startOver}>
                    Restyle
                  </button>
                  <button type="button" className="avc-btn-ghost" onClick={newPhoto}>
                    New photo
                  </button>
                </div>
                {saveMsg && (
                  <p className={`avc-note ${saveState === "error" ? "avc-error" : "avc-info"}`}>
                    {saveMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Saved gallery */}
        {user && gallery.length > 0 && (
          <div className="avc-gallery">
            <h3 className="avc-h3">Your saved avatars</h3>
            <div className="avc-gallery-grid">
              {gallery.map((g) => (
                <figure key={g.id} className="avc-gallery-item">
                  {g.url ? (
                    <img src={g.url} alt={`Saved ${g.style} avatar`} />
                  ) : (
                    <div className="avc-placeholder">Unavailable</div>
                  )}
                  <figcaption>
                    <span>{g.style}</span>
                    <button type="button" className="avc-link" onClick={() => handleDelete(g.id)}>
                      Delete
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

// ─── Scoped styles ───────────────────────────────────────────────────────────
const css = `
  .avc-root { --avc-line: var(--rsp-border, #e6e0dd); }
  .avc-steps { display:flex; gap:10px; justify-content:center; list-style:none; padding:0; margin:0 0 28px; flex-wrap:wrap; }
  .avc-step { display:flex; align-items:center; gap:8px; font-size:.82rem; color:var(--rsp-text-muted); opacity:.7; }
  .avc-step.is-active { opacity:1; color:var(--rsp-text); font-weight:600; }
  .avc-step-num { display:grid; place-items:center; width:24px; height:24px; border-radius:999px; background:var(--rsp-primary-light); color:var(--rsp-primary); font-size:.78rem; font-weight:700; }
  .avc-step.is-active .avc-step-num { background:var(--rsp-primary); color:#fff; }

  .avc-card { max-width:900px; margin:0 auto; background:var(--rsp-surface,#fff); border:1px solid var(--avc-line); border-radius:16px; padding:28px; }
  .avc-inputs { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .avc-drop { position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; text-align:center; padding:36px 18px; border:1.5px dashed var(--rsp-border-strong,#cfc7c3); border-radius:14px; background:var(--rsp-bg-warm,#faf7f5); cursor:pointer; transition:border-color .2s, background .2s; font:inherit; color:inherit; }
  .avc-drop:hover { border-color:var(--rsp-primary); background:var(--rsp-primary-light); }
  .avc-drop-btn { border-style:solid; }
  .avc-file { position:absolute; inset:0; opacity:0; cursor:pointer; }
  .avc-drop-icon { font-size:1.6rem; color:var(--rsp-primary); }
  .avc-drop-title { font-weight:600; }
  .avc-drop-sub { font-size:.78rem; color:var(--rsp-text-muted); }

  .avc-note { margin:16px 0 0; font-size:.86rem; border-radius:10px; padding:10px 12px; }
  .avc-error { background:oklch(96% .04 25); color:oklch(45% .18 25); }
  .avc-info { background:var(--rsp-primary-light); color:var(--rsp-text-muted); }

  .avc-privacy { margin-top:20px; font-size:.82rem; line-height:1.6; color:var(--rsp-text-muted); background:var(--rsp-bg-warm,#faf7f5); border:1px solid var(--avc-line); border-radius:12px; padding:14px 16px; }
  .avc-privacy strong { color:var(--rsp-text); }

  .avc-camera { display:flex; flex-direction:column; align-items:center; gap:16px; }
  .avc-video { width:100%; max-width:420px; aspect-ratio:1/1; object-fit:cover; border-radius:14px; transform:scaleX(-1); background:#000; }

  .avc-actions { display:flex; gap:12px; align-items:center; margin-top:22px; flex-wrap:wrap; }
  .avc-actions-wrap { margin-top:8px; }
  .avc-btn-ghost { background:none; border:none; color:var(--rsp-text-muted); font:inherit; font-size:.85rem; cursor:pointer; text-decoration:underline; }
  .avc-btn-ghost:hover { color:var(--rsp-text); }
  .avc-btn-outline { display:inline-flex; align-items:center; font:inherit; font-size:.85rem; font-weight:600; padding:9px 18px; border-radius:999px; border:1px solid var(--rsp-primary); color:var(--rsp-primary); background:transparent; cursor:pointer; text-decoration:none; }
  .avc-btn-outline:hover:not(:disabled) { background:var(--rsp-primary-light); }
  .avc-btn-outline:disabled, .rsp-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
  .avc-link { background:none; border:none; color:var(--rsp-primary); font:inherit; cursor:pointer; text-decoration:underline; padding:0; }

  .avc-h3 { font-size:1.05rem; font-weight:600; margin:0 0 4px; color:var(--rsp-text); }
  .avc-muted { font-size:.84rem; color:var(--rsp-text-muted); margin:0; }
  .avc-style-head { display:flex; gap:16px; align-items:center; margin-bottom:20px; }
  .avc-thumb { width:64px; height:64px; border-radius:12px; object-fit:cover; border:1px solid var(--avc-line); }
  .avc-style-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; }
  .avc-style { text-align:left; display:flex; flex-direction:column; gap:4px; padding:14px; border:1.5px solid var(--avc-line); border-radius:12px; background:var(--rsp-surface,#fff); cursor:pointer; font:inherit; color:inherit; transition:border-color .15s, background .15s; }
  .avc-style:hover { border-color:var(--rsp-primary); }
  .avc-style.is-sel { border-color:var(--rsp-primary); background:var(--rsp-primary-light); }
  .avc-style-label { font-weight:600; }
  .avc-style-desc { font-size:.78rem; color:var(--rsp-text-muted); }

  .avc-result-grid { display:grid; grid-template-columns:1fr 1fr; gap:28px; align-items:start; }
  .avc-stage { display:flex; flex-direction:column; gap:10px; }
  .avc-canvas { display:grid; grid-template-columns:1fr; gap:10px; }
  .avc-canvas.is-compare { grid-template-columns:1fr 1fr; }
  .avc-img-wrap { position:relative; aspect-ratio:1/1; border-radius:14px; overflow:hidden; background:var(--rsp-bg-warm,#faf7f5); border:1px solid var(--avc-line); }
  .avc-img { width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:14px; display:block; }
  .avc-img.is-dim { opacity:.35; }
  .avc-placeholder { position:absolute; inset:0; display:grid; place-items:center; color:var(--rsp-text-muted); font-size:.85rem; }
  .avc-loading { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:var(--rsp-text-muted); font-size:.85rem; z-index:2; }
  .avc-spinner { width:34px; height:34px; border-radius:50%; border:3px solid var(--rsp-primary-light); border-top-color:var(--rsp-primary); animation:avc-spin .8s linear infinite; }
  @keyframes avc-spin { to { transform:rotate(360deg); } }
  .avc-stage-tools { display:flex; justify-content:flex-end; }
  .avc-toggle { display:inline-flex; gap:8px; align-items:center; font-size:.82rem; color:var(--rsp-text-muted); cursor:pointer; }

  .avc-controls { display:flex; flex-direction:column; gap:20px; }
  .avc-gauge-head { display:flex; justify-content:space-between; align-items:baseline; }
  .avc-gauge-val { font-size:.82rem; font-weight:600; color:var(--rsp-primary); }
  .avc-slider { width:100%; margin:12px 0 4px; accent-color:var(--rsp-primary); }
  .avc-gauge-ends { display:flex; justify-content:space-between; font-size:.74rem; color:var(--rsp-text-muted); }
  .avc-field-label { display:block; font-size:.8rem; font-weight:600; color:var(--rsp-text); margin-bottom:8px; }
  .avc-chip-row { display:flex; flex-wrap:wrap; gap:8px; }
  .avc-chip { font:inherit; font-size:.8rem; padding:6px 12px; border-radius:999px; border:1px solid var(--avc-line); background:var(--rsp-surface,#fff); cursor:pointer; color:var(--rsp-text-muted); }
  .avc-chip:hover:not(:disabled) { border-color:var(--rsp-primary); color:var(--rsp-text); }
  .avc-chip.is-sel { background:var(--rsp-primary); border-color:var(--rsp-primary); color:#fff; }
  .avc-chip:disabled { opacity:.5; cursor:not-allowed; }

  .avc-gallery { max-width:900px; margin:36px auto 0; }
  .avc-gallery-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:14px; margin-top:14px; }
  .avc-gallery-item { margin:0; }
  .avc-gallery-item img { width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:12px; border:1px solid var(--avc-line); }
  .avc-gallery-item figcaption { display:flex; justify-content:space-between; align-items:center; font-size:.75rem; color:var(--rsp-text-muted); margin-top:6px; text-transform:capitalize; }

  @media (max-width:720px) {
    .avc-inputs { grid-template-columns:1fr; }
    .avc-result-grid { grid-template-columns:1fr; }
    .avc-card { padding:18px; }
  }
`;
