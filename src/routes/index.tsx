import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Upload, FileCheck2, FileX2, Loader2, Copy, Check, Download, Server,
  ShieldCheck, CircleDot, AlertTriangle, Boxes, Rocket, RefreshCw, Hash,
} from "lucide-react";
import {
  DEFAULT_KUBO_BASE_URL, buildFinalMetadata, extractBundle,
  findEntry, uploadToKubo, type KuboManifest, type RequiredFile,
} from "@/lib/kubo";
import type JSZip from "jszip";

export const Route = createFileRoute("/")({
  component: Deployer,
  head: () => ({
    meta: [
      { title: "RSP Kubo Deployer — IPFS Bundle Uploader" },
      { name: "description", content: "Upload the RSP Kubo Upload Bundle to a local Kubo IPFS node, replace CID placeholders, and generate the final mint-ready metadata." },
    ],
  }),
});

type Phase = "idle" | "extracted" | "uploading" | "done";

const statusMeta: Record<RequiredFile["status"], { label: string; cls: string; Icon: typeof CircleDot }> = {
  missing: { label: "Missing", cls: "text-red-400 bg-red-500/10 border-red-500/30", Icon: FileX2 },
  ready: { label: "Ready", cls: "text-zinc-300 bg-white/5 border-white/10", Icon: FileCheck2 },
  uploading: { label: "Uploading", cls: "text-amber-300 bg-amber-500/10 border-amber-500/30", Icon: Loader2 },
  uploaded: { label: "Uploaded", cls: "text-sky-300 bg-sky-500/10 border-sky-500/30", Icon: CircleDot },
  captured: { label: "CID captured", cls: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30", Icon: Hash },
  error: { label: "Error", cls: "text-red-400 bg-red-500/10 border-red-500/30", Icon: AlertTriangle },
};

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success(`${label ?? "Copied"} to clipboard`);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300 transition hover:bg-white/10"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Deployer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [zip, setZip] = useState<JSZip | null>(null);
  const [manifest, setManifest] = useState<KuboManifest | null>(null);
  const [files, setFiles] = useState<RequiredFile[]>([]);
  const [kuboUrl, setKuboUrl] = useState(DEFAULT_KUBO_BASE_URL);
  const [zipName, setZipName] = useState<string>("");
  const [finalCid, setFinalCid] = useState<string | null>(null);
  const [finalJson, setFinalJson] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);

  const allPresent = files.length > 0 && files.every((f) => f.status !== "missing");
  const allCaptured = files.length > 0 && files.every((f) => f.status === "captured");
  const finalUri = finalCid ? `ipfs://${finalCid}` : null;

  const reset = () => {
    setPhase("idle"); setZip(null); setManifest(null); setFiles([]);
    setZipName(""); setFinalCid(null); setFinalJson(null); setTopError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = useCallback(async (file: File) => {
    setTopError(null); setFinalCid(null); setFinalJson(null);
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setTopError("Please upload a .zip file (RSP_Kubo_Upload_Bundle_v1_6.zip).");
      return;
    }
    setZipName(file.name);
    try {
      const { zip: z, manifest: m } = await extractBundle(file);
      const reqs: RequiredFile[] = m.upload_order.map((e) => {
        const present = !!findEntry(z, e.file);
        return { name: e.file, placeholder: e.placeholder, status: present ? "ready" : "missing" };
      });
      setZip(z); setManifest(m); setFiles(reqs); setKuboUrl((u) => u || DEFAULT_KUBO_BASE_URL);
      setPhase("extracted");
      const missing = reqs.filter((r) => r.status === "missing");
      if (missing.length) toast.warning(`${missing.length} required file(s) missing from the ZIP.`);
      else toast.success("Bundle extracted — all required files found.");
    } catch (err) {
      setTopError(err instanceof Error ? err.message : "Failed to read the bundle.");
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const update = (name: string, patch: Partial<RequiredFile>) =>
    setFiles((prev) => prev.map((f) => (f.name === name ? { ...f, ...patch } : f)));

  const deploy = async () => {
    if (!zip || !manifest) return;
    if (!allPresent) { setTopError("Cannot deploy: some required files are missing from the ZIP."); return; }
    setBusy(true); setPhase("uploading"); setTopError(null); setFinalCid(null); setFinalJson(null);

    try {
      const captured: RequiredFile[] = [];
      for (const entry of manifest.upload_order) {
        update(entry.file, { status: "uploading", error: undefined });
        const zf = findEntry(zip, entry.file);
        if (!zf) throw new Error(`Required file missing during upload: ${entry.file}`);
        const blob = await zf.async("blob");
        try {
          const cid = await uploadToKubo(blob, entry.file, kuboUrl);
          update(entry.file, { status: "captured", cid });
          captured.push({ name: entry.file, placeholder: entry.placeholder, status: "captured", cid });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Upload failed";
          update(entry.file, { status: "error", error: msg });
          throw new Error(msg);
        }
      }

      // Build final metadata
      const metaEntry = findEntry(zip, manifest.metadata_file);
      if (!metaEntry) throw new Error(`Metadata file "${manifest.metadata_file}" not found in ZIP.`);
      let metaObj: unknown;
      try { metaObj = JSON.parse(await metaEntry.async("string")); }
      catch { throw new Error("The metadata JSON in the bundle is invalid."); }

      const { metadata: finalMeta, missing } = buildFinalMetadata(metaObj, captured);
      if (missing.length) {
        throw new Error(`Metadata is missing ${missing.length} placeholder(s): ${missing.join(", ")}`);
      }
      const finalStr = JSON.stringify(finalMeta, null, 2);
      setFinalJson(finalStr);
      toast.success("Final metadata generated.");

      // Upload final metadata
      const finalBlob = new Blob([finalStr], { type: "application/json" });
      const cid = await uploadToKubo(finalBlob, manifest.final_metadata_filename, kuboUrl);
      setFinalCid(cid);
      setPhase("done");
      toast.success("Final metadata uploaded to IPFS!");
    } catch (err) {
      setTopError(err instanceof Error ? err.message : "Deployment failed.");
      setPhase("extracted");
    } finally {
      setBusy(false);
    }
  };

  const downloadFinal = () => {
    if (!finalJson || !manifest) return;
    const url = URL.createObjectURL(new Blob([finalJson], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url; a.download = manifest.final_metadata_filename; a.click();
    URL.revokeObjectURL(url);
  };

  const progress = useMemo(() => {
    if (files.length === 0) return 0;
    const done = files.filter((f) => f.status === "captured").length;
    return Math.round((done / files.length) * 100);
  }, [files]);

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100">
      {/* ambient red glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.red.950/40),transparent_60%)]" />

      <header className="border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_30px_-6px] shadow-red-600/60">
              <Boxes className="h-5 w-5 text-white" />
            </span>
            <div>
              <h1 className="text-base font-semibold tracking-tight">RSP Kubo Deployer</h1>
              <p className="text-xs text-zinc-500">IPFS bundle uploader · Genesis metadata builder</p>
            </div>
          </div>
          {phase !== "idle" && (
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:bg-white/5">
              <RefreshCw className="h-4 w-4" /> Reset
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        {topError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <p>{topError}</p>
          </div>
        )}

        {/* Step 1: Upload ZIP */}
        <section>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="group rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-10 text-center transition hover:border-red-500/40 hover:bg-red-500/[0.03]"
          >
            <input ref={inputRef} type="file" accept=".zip" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <Upload className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">
              {zipName ? zipName : "Upload RSP_Kubo_Upload_Bundle_v1_6.zip"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Drag & drop the bundle ZIP here, or choose a file.</p>
            <button onClick={() => inputRef.current?.click()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-red-500 to-red-700 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_30px_-8px] shadow-red-600/70 transition hover:opacity-90">
              <Upload className="h-4 w-4" /> {zipName ? "Choose a different ZIP" : "Choose ZIP file"}
            </button>
          </div>
        </section>

        {manifest && (
          <>
            {/* Step 2: Kubo endpoint */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Server className="h-4 w-4 text-red-400" /> Kubo API endpoint
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Your local Kubo daemon's API base URL. Files are sent to <code className="text-zinc-400">/api/v0/add?pin=true</code>.
              </p>
              <input
                value={kuboUrl}
                onChange={(e) => setKuboUrl(e.target.value)}
                placeholder={DEFAULT_KUBO_BASE_URL}
                className="mt-3 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
              />
              <p className="mt-2 text-xs text-zinc-600">
                Tip: if you hit a CORS error, configure Kubo to allow this origin via
                <code className="mx-1 text-zinc-500">API.HTTPHeaders.Access-Control-Allow-Origin</code>.
              </p>
            </section>

            {/* Step 3: Required files */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileCheck2 className="h-4 w-4 text-red-400" /> Required files
                  <span className="ml-1 text-xs font-normal text-zinc-500">({files.length} from manifest)</span>
                </div>
                <span className="text-xs text-zinc-500">{progress}% CIDs captured</span>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all" style={{ width: `${progress}%` }} />
              </div>

              <ul className="mt-4 divide-y divide-white/5">
                {files.map((f) => {
                  const meta = statusMeta[f.status];
                  return (
                    <li key={f.name} className="flex flex-wrap items-center gap-3 py-3">
                      <span className="font-mono text-sm text-zinc-200">{f.name}</span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${meta.cls}`}>
                        <meta.Icon className={`h-3.5 w-3.5 ${f.status === "uploading" ? "animate-spin" : ""}`} />
                        {meta.label}
                      </span>
                      {f.cid && (
                        <span className="ml-auto flex items-center gap-2">
                          <code className="max-w-[220px] truncate rounded bg-black/40 px-2 py-1 text-xs text-emerald-300">{f.cid}</code>
                          <CopyButton value={f.cid} label="CID" />
                        </span>
                      )}
                      {f.error && <span className="ml-auto text-xs text-red-400">{f.error}</span>}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Deploy button */}
            <section className="flex flex-col items-center gap-3">
              <button
                onClick={deploy}
                disabled={!allPresent || busy}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-red-500 to-red-700 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_40px_-10px] shadow-red-600/80 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                {busy ? "Deploying to IPFS…" : "Upload bundle & generate metadata"}
              </button>
              {!allPresent && (
                <p className="text-xs text-red-400">Resolve missing files before deploying.</p>
              )}
            </section>
          </>
        )}

        {/* Minting Summary */}
        {finalUri && manifest && (
          <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> Minting Summary
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              All {files.length} files pinned, placeholders replaced, and final metadata uploaded.
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Final metadata CID</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <code className="break-all text-sm text-zinc-100">{finalCid}</code>
                  <CopyButton value={finalCid!} label="CID" />
                </div>
              </div>
              <div className="rounded-xl border border-red-500/30 bg-red-500/[0.06] p-4">
                <p className="text-xs uppercase tracking-wide text-red-300">Mint URI</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <code className="break-all text-base font-semibold text-white">{finalUri}</code>
                  <CopyButton value={finalUri} label="Mint URI" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={downloadFinal}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10">
                <Download className="h-4 w-4" /> Download {manifest.final_metadata_filename}
              </button>
              <CopyButton value={finalUri} label="Mint URI" />
            </div>

            {finalJson && (
              <details className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
                <summary className="cursor-pointer text-sm text-zinc-300">Preview final metadata JSON</summary>
                <pre className="mt-3 max-h-80 overflow-auto text-xs text-zinc-400">{finalJson}</pre>
              </details>
            )}
          </section>
        )}

        <footer className="pt-6 text-center text-xs text-zinc-600">
          RSP Kubo Deployer · uploads run entirely in your browser against your local Kubo node.
        </footer>
      </main>
    </div>
  );
}
