import { createRouteFn, Link } from "@/lib/tanstack-shim";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@/lib/tanstack-start-shim";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { saveAvatar, listMyAvatars, deleteAvatar } from "@/lib/avatar.functions";

export const Route = createRouteFn("/rsp/avatar-creator")({
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
type FacingMode = "user" | "environment";
type Box = { x: number; y: number; width: number; height: number };

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

const PLATFORM_PRESETS: { label: string; size: number }[] = [
  { label: "Full quality", size: 0 },
  { label: "LinkedIn · 400", size: 400 },
  { label: "Instagram · 320", size: 320 },
  { label: "X / Twitter · 400", size: 400 },
  { label: "Facebook · 500", size: 500 },
  { label: "Discord · 512", size: 512 },
  { label: "WhatsApp · 640", size: 640 },
  { label: "Slack · 512", size: 512 },
];

const FORMATS = [
  { id: "png", label: "PNG", mime: "image/png" },
  { id: "jpeg", label: "JPG", mime: "image/jpeg" },
  { id: "webp", label: "WebP", mime: "image/webp" },
] as const;
type FormatId = (typeof FORMATS)[number]["id"];

type Screen = "input" | "faces" | "style" | "result";

// ─── Image helpers ─────────────────────────────────────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = src;
  });
}

async function toSquareDataUrl(src: string, max = 1024): Promise<string> {
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
  return canvas.toDataURL("image/jpeg", 0.92);
}

// Crop a square around a detected face box (with padding), then downscale.
async function cropFaceToSquare(src: string, box: Box, max = 1024): Promise<string> {
  const img = await loadImage(src);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  let side = Math.max(box.width, box.height) * 1.8;
  side = Math.min(side, img.naturalWidth, img.naturalHeight);
  let sx = cx - side / 2;
  let sy = cy - side / 2;
  sx = Math.max(0, Math.min(sx, img.naturalWidth - side));
  sy = Math.max(0, Math.min(sy, img.naturalHeight - side));
  const out = Math.min(side, max);
  const canvas = document.createElement("canvas");
  canvas.width = out;
  canvas.height = out;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
  return canvas.toDataURL("image/jpeg", 0.92);
}

// Remove a plain background by flood-filling from the edges (best-effort).
function floodTransparent(ctx: CanvasRenderingContext2D, w: number, h: number, tol = 36) {
  const data = ctx.getImageData(0, 0, w, h);
  const p = data.data;
  const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + (w - 1)) * 4];
  let r = 0, g = 0, b = 0;
  corners.forEach((i) => {
    r += p[i];
    g += p[i + 1];
    b += p[i + 2];
  });
  r /= 4;
  g /= 4;
  b /= 4;
  const visited = new Uint8Array(w * h);
  const stack: number[] = [];
  const push = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const idx = y * w + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    stack.push(idx);
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  const tol2 = tol * tol;
  while (stack.length) {
    const idx = stack.pop()!;
    const i = idx * 4;
    const dr = p[i] - r, dg = p[i + 1] - g, db = p[i + 2] - b;
    if (dr * dr + dg * dg + db * db <= tol2) {
      p[i + 3] = 0;
      const x = idx % w;
      const y = (idx / w) | 0;
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
  }
  ctx.putImageData(data, 0, 0);
}

async function exportImage(
  src: string,
  opts: { size: number; format: FormatId; transparent: boolean },
): Promise<string> {
  const img = await loadImage(src);
  const target = opts.size || img.naturalWidth;
  const canvas = document.createElement("canvas");
  canvas.width = target;
  canvas.height = target;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, target, target);
  if (opts.transparent && opts.format === "png") {
    floodTransparent(ctx, target, target);
  }
  const mime = FORMATS.find((f) => f.id === opts.format)!.mime;
  return canvas.toDataURL(mime, 0.92);
}

function download(dataUrl: string, name: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Detect faces. Returns boxes in the image's natural pixel coordinates, or null
// when the browser has no FaceDetector (we can't validate — allow through).
async function detectFaces(src: string): Promise<Box[] | null> {
  const FD = (window as any).FaceDetector;
  if (typeof FD !== "function") return null;
  try {
    const img = await loadImage(src);
    const detector = new FD({ fastMode: true, maxDetectedFaces: 10 });
    const faces = await detector.detect(img);
    return (faces ?? []).map((f: any) => ({
      x: f.boundingBox.x,
      y: f.boundingBox.y,
      width: f.boundingBox.width,
      height: f.boundingBox.height,
    }));
  } catch {
    return null;
  }
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

  // Face selection
  const [pendingRaw, setPendingRaw] = useState<string | null>(null);
  const [faceBoxes, setFaceBoxes] = useState<Box[]>([]);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({ w: 1, h: 1 });

  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [compare, setCompare] = useState(false);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const [result, setResult] = useState<string | null>(null);

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Export
  const [presetIdx, setPresetIdx] = useState(0);
  const [format, setFormat] = useState<FormatId>("png");
  const [transparent, setTransparent] = useState(false);
  const [customSize, setCustomSize] = useState<string>("");
  const [exporting, setExporting] = useState(false);

  const likeness = LIKENESS_STEPS[stepIdx];
  const cacheKey = (s: string, l: number) => `${s}:${l}`;

  // ── Camera ──
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>("user");
  const [multiCamera, setMultiCamera] = useState(false);
  const [permissionState, setPermissionState] = useState<"idle" | "denied" | "unavailable" | "error">("idle");
  const [captured, setCaptured] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const attachStream = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    setCameraOn(true);
    setPermissionState("idle");
    queueMicrotask(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    });
  }, []);

  async function startCamera(mode: FacingMode) {
    setInputError(null);
    setCaptured(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState("unavailable");
      setCameraOn(true);
      return;
    }
    // Stop any prior stream so switching cameras releases the device.
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setSourceType("live_capture");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      setFacingMode(mode);
      attachStream(stream);
      // Detect if a second camera exists to offer a toggle.
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setMultiCamera(devices.filter((d) => d.kind === "videoinput").length > 1);
      } catch {
        /* ignore */
      }
    } catch (err) {
      setCameraOn(true);
      const name = (err as DOMException)?.name;
      if (name === "NotAllowedError" || name === "SecurityError") setPermissionState("denied");
      else if (name === "NotFoundError" || name === "DevicesNotFoundError")
        setPermissionState("unavailable");
      else setPermissionState("error");
    }
  }

  function switchCamera() {
    startCamera(facingMode === "user" ? "environment" : "user");
  }

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    const side = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = side;
    canvas.height = side;
    const ctx = canvas.getContext("2d")!;
    if (facingMode === "user") {
      // Mirror to match the preview the user sees.
      ctx.translate(side, 0);
      ctx.scale(-1, 1);
    }
    const sx = (video.videoWidth - side) / 2;
    const sy = (video.videoHeight - side) / 2;
    ctx.drawImage(video, sx, sy, side, side, 0, 0, side, side);
    setCaptured(canvas.toDataURL("image/jpeg", 0.92));
    // Freeze the frame; keep the stream so "Retake" is instant.
  }

  function retake() {
    setCaptured(null);
  }

  async function confirmCapture() {
    if (!captured) return;
    const raw = captured;
    stopCamera();
    setCaptured(null);
    await acceptImage(raw, "live_capture");
  }

  function closeCamera() {
    stopCamera();
    setCaptured(null);
    setPermissionState("idle");
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
      const img = await loadImage(raw);
      if (Math.min(img.naturalWidth, img.naturalHeight) < 256) {
        setInputError("That image is a bit small. Please use a photo at least 256×256 pixels.");
        return;
      }
      setSourceType(type);
      const faces = await detectFaces(raw);
      if (faces && faces.length === 0) {
        setInputError("We couldn't find a face in that photo. Please use a clear, front-facing portrait.");
        return;
      }
      if (faces && faces.length > 1) {
        // Offer face selection instead of forcing a re-take.
        setPendingRaw(raw);
        setFaceBoxes(faces);
        setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
        setScreen("faces");
        return;
      }
      let squared: string;
      if (faces && faces.length === 1) {
        squared = await cropFaceToSquare(raw, faces[0]);
      } else {
        squared = await toSquareDataUrl(raw);
      }
      cacheRef.current.clear();
      setOriginal(squared);
      setResult(null);
      setScreen("style");
    } catch (e) {
      setInputError(e instanceof Error ? e.message : "Something went wrong reading that image.");
    } finally {
      setValidating(false);
    }
  }

  async function pickFace(box: Box) {
    if (!pendingRaw) return;
    setValidating(true);
    try {
      const squared = await cropFaceToSquare(pendingRaw, box);
      cacheRef.current.clear();
      setOriginal(squared);
      setResult(null);
      setPendingRaw(null);
      setFaceBoxes([]);
      setScreen("style");
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
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const { data: sess } = await supabase.auth.getSession();
        if (sess.session?.access_token) headers.Authorization = `Bearer ${sess.session.access_token}`;
        const res = await fetch("/api/avatar-generate", {
          method: "POST",
          headers,
          body: JSON.stringify({ image: original, style: s, likeness: l, sourceType }),
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
    [original, sourceType],
  );

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
    setPendingRaw(null);
    setInputError(null);
    setSaveState("idle");
    setScreen("input");
  }

  async function handleExport() {
    if (!result) return;
    setExporting(true);
    try {
      const custom = parseInt(customSize, 10);
      const size = Number.isFinite(custom) && custom > 0 ? Math.min(custom, 2048) : PLATFORM_PRESETS[presetIdx].size;
      const out = await exportImage(result, { size, format, transparent });
      const px = size || "full";
      download(out, `avatar-${style}-${likeness}-${px}.${format === "jpeg" ? "jpg" : format}`);
    } finally {
      setExporting(false);
    }
  }

  async function handleSave() {
    if (!result || !original || !user) return;
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

        <ol className="avc-steps" aria-label="Progress">
          {(["input", "style", "result"] as const).map((s, i) => (
            <li
              key={s}
              className={`avc-step ${screen === s || (s === "input" && screen === "faces") ? "is-active" : ""}`}
            >
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
                  <button type="button" className="avc-drop avc-drop-btn" onClick={() => startCamera("user")}>
                    <span className="avc-drop-icon" aria-hidden>◉</span>
                    <span className="avc-drop-title">Use your camera</span>
                    <span className="avc-drop-sub">We’ll ask for camera permission</span>
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
                  and the avatar are kept privately in your account until you delete them — and any
                  unsaved photo is automatically purged within 7 days. We never use your photo for
                  anything other than generating your avatar.
                </div>
              </>
            ) : (
              <div className="avc-camera">
                {permissionState === "idle" && !captured && (
                  <>
                    <div className="avc-video-wrap">
                      <video
                        ref={videoRef}
                        className={`avc-video ${facingMode === "user" ? "is-mirror" : ""}`}
                        playsInline
                        muted
                        aria-label="Camera preview"
                      />
                      {multiCamera && (
                        <button
                          type="button"
                          className="avc-cam-flip"
                          onClick={switchCamera}
                          aria-label="Switch camera"
                          title="Switch camera"
                        >
                          ⇄
                        </button>
                      )}
                    </div>
                    <p className="avc-cam-hint">
                      {facingMode === "user" ? "Front camera" : "Back camera"} · Line up your face and
                      capture.
                    </p>
                    <div className="avc-actions">
                      <button type="button" className="rsp-btn-primary" onClick={capture}>
                        Capture
                      </button>
                      <button type="button" className="avc-btn-ghost" onClick={closeCamera}>
                        Cancel
                      </button>
                    </div>
                  </>
                )}

                {captured && (
                  <>
                    <div className="avc-video-wrap">
                      <img src={captured} alt="Captured photo preview" className="avc-video" />
                    </div>
                    <p className="avc-cam-hint">Happy with this shot?</p>
                    <div className="avc-actions">
                      <button type="button" className="rsp-btn-primary" onClick={confirmCapture}>
                        Use this photo
                      </button>
                      <button type="button" className="avc-btn-outline" onClick={retake}>
                        Retake
                      </button>
                      <button type="button" className="avc-btn-ghost" onClick={closeCamera}>
                        Cancel
                      </button>
                    </div>
                  </>
                )}

                {permissionState !== "idle" && (
                  <div className="avc-perm">
                    <p className="avc-note avc-error" role="alert">
                      {permissionState === "denied" &&
                        "Camera access was blocked. Allow camera access in your browser’s address-bar or site settings, then try again."}
                      {permissionState === "unavailable" &&
                        "No camera is available on this device. You can upload a photo instead."}
                      {permissionState === "error" &&
                        "Something went wrong opening the camera. Try again, or upload a photo instead."}
                    </p>
                    <div className="avc-actions">
                      {permissionState !== "unavailable" && (
                        <button type="button" className="rsp-btn-primary" onClick={() => startCamera(facingMode)}>
                          Try again
                        </button>
                      )}
                      <button type="button" className="avc-btn-ghost" onClick={closeCamera}>
                        Back to upload
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Screen: face selection ── */}
        {screen === "faces" && pendingRaw && (
          <div className="avc-card">
            <h3 className="avc-h3">We found more than one face</h3>
            <p className="avc-muted" style={{ marginBottom: 16 }}>
              Tap the face you want to turn into an avatar.
            </p>
            <div
              className="avc-face-stage"
              style={{ aspectRatio: `${naturalSize.w} / ${naturalSize.h}` }}
            >
              <img src={pendingRaw} alt="Your photo with detected faces" className="avc-face-img" />
              {faceBoxes.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  className="avc-face-box"
                  onClick={() => pickFace(b)}
                  aria-label={`Choose face ${i + 1}`}
                  style={{
                    left: `${(b.x / naturalSize.w) * 100}%`,
                    top: `${(b.y / naturalSize.h) * 100}%`,
                    width: `${(b.width / naturalSize.w) * 100}%`,
                    height: `${(b.height / naturalSize.h) * 100}%`,
                  }}
                >
                  <span className="avc-face-num">{i + 1}</span>
                </button>
              ))}
            </div>
            <div className="avc-actions">
              <button type="button" className="avc-btn-ghost" onClick={newPhoto}>
                Use a different photo
              </button>
            </div>
          </div>
        )}

        {/* ── Screen 2: style ── */}
        {screen === "style" && original && (
          <div className="avc-card">
            <div className="avc-style-head">
              <img src={original} alt="Your selected photo" className="avc-thumb" />
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

                <details className="avc-export">
                  <summary>Export options</summary>
                  <div className="avc-field">
                    <span className="avc-field-label">Size preset</span>
                    <div className="avc-chip-row">
                      {PLATFORM_PRESETS.map((p, i) => (
                        <button
                          key={p.label}
                          type="button"
                          className={`avc-chip ${presetIdx === i && !customSize ? "is-sel" : ""}`}
                          onClick={() => {
                            setPresetIdx(i);
                            setCustomSize("");
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="avc-field">
                    <label className="avc-field-label" htmlFor="avc-custom">
                      Custom square size (px)
                    </label>
                    <input
                      id="avc-custom"
                      type="number"
                      min={64}
                      max={2048}
                      placeholder="e.g. 800"
                      className="avc-num"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                    />
                  </div>
                  <div className="avc-field">
                    <span className="avc-field-label">Format</span>
                    <div className="avc-chip-row">
                      {FORMATS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className={`avc-chip ${format === f.id ? "is-sel" : ""}`}
                          onClick={() => {
                            setFormat(f.id);
                            if (f.id !== "png") setTransparent(false);
                          }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className={`avc-toggle ${format !== "png" ? "is-disabled" : ""}`}>
                    <input
                      type="checkbox"
                      checked={transparent}
                      disabled={format !== "png"}
                      onChange={(e) => setTransparent(e.target.checked)}
                    />
                    Transparent background (PNG)
                  </label>
                  <p className="avc-hint-sm">
                    Transparency removes a plain, single-color background. Works best with the Line
                    art, Illustrated and 3D styles.
                  </p>
                </details>

                <div className="avc-actions avc-actions-wrap">
                  <button
                    type="button"
                    className="rsp-btn-primary"
                    onClick={handleExport}
                    disabled={!result || generating || exporting}
                  >
                    {exporting ? "Preparing…" : "Download"}
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

  .avc-camera { display:flex; flex-direction:column; align-items:center; gap:14px; }
  .avc-video-wrap { position:relative; width:100%; max-width:420px; }
  .avc-video { width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:14px; background:#000; display:block; }
  .avc-video.is-mirror { transform:scaleX(-1); }
  .avc-cam-flip { position:absolute; top:10px; right:10px; width:40px; height:40px; border-radius:50%; border:none; background:rgba(0,0,0,.55); color:#fff; font-size:1.2rem; cursor:pointer; display:grid; place-items:center; }
  .avc-cam-flip:hover { background:rgba(0,0,0,.75); }
  .avc-cam-hint { font-size:.82rem; color:var(--rsp-text-muted); margin:0; text-align:center; }
  .avc-perm { width:100%; max-width:420px; }

  .avc-face-stage { position:relative; width:100%; max-width:520px; margin:0 auto; border-radius:14px; overflow:hidden; border:1px solid var(--avc-line); }
  .avc-face-img { width:100%; display:block; }
  .avc-face-box { position:absolute; border:2.5px solid var(--rsp-primary); background:oklch(60% .22 25 / .12); border-radius:8px; cursor:pointer; transition:background .15s; padding:0; }
  .avc-face-box:hover { background:oklch(60% .22 25 / .3); }
  .avc-face-num { position:absolute; top:-10px; left:-10px; width:24px; height:24px; border-radius:50%; background:var(--rsp-primary); color:#fff; font-size:.75rem; font-weight:700; display:grid; place-items:center; }

  .avc-actions { display:flex; gap:12px; align-items:center; margin-top:22px; flex-wrap:wrap; justify-content:center; }
  .avc-actions-wrap { margin-top:8px; justify-content:flex-start; }
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
  .avc-toggle.is-disabled { opacity:.5; cursor:not-allowed; }

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
  .avc-num { width:140px; font:inherit; font-size:.85rem; padding:8px 10px; border-radius:10px; border:1px solid var(--avc-line); background:var(--rsp-surface,#fff); color:var(--rsp-text); }
  .avc-export { border:1px solid var(--avc-line); border-radius:12px; padding:6px 14px 14px; }
  .avc-export summary { cursor:pointer; font-size:.85rem; font-weight:600; color:var(--rsp-text); padding:8px 0; }
  .avc-export .avc-field { margin-top:12px; }
  .avc-hint-sm { font-size:.74rem; color:var(--rsp-text-muted); margin:8px 0 0; line-height:1.5; }

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
