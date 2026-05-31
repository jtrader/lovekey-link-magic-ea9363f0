import JSZip from "jszip";

export interface ManifestEntry {
  file: string;
  placeholder: string;
}

export interface KuboManifest {
  bundle: string;
  version: string;
  kubo_api_endpoint: string;
  metadata_file: string;
  final_metadata_filename: string;
  upload_order: ManifestEntry[];
}

export type FileStatus =
  | "missing"
  | "ready"
  | "uploading"
  | "uploaded"
  | "captured"
  | "error";

export interface RequiredFile {
  name: string;
  placeholder: string;
  status: FileStatus;
  cid?: string;
  error?: string;
}

export const DEFAULT_KUBO_BASE_URL = "http://127.0.0.1:5001";

export const MANIFEST_FILENAME = "rsp_kubo_upload_manifest_v1_6.json";

/**
 * Uploads a single file/blob to a local Kubo IPFS node and returns its CID.
 */
export async function uploadToKubo(
  file: File | Blob,
  filename: string,
  kuboBaseUrl: string,
): Promise<string> {
  const base = kuboBaseUrl.replace(/\/+$/, "");
  const formData = new FormData();
  formData.append("file", file, filename);

  let response: Response;
  try {
    response = await fetch(`${base}/api/v0/add?pin=true`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    throw new Error(
      `Could not reach Kubo at ${base}. This is usually a connection or CORS issue. ` +
        `Make sure your Kubo daemon is running and allows requests from this origin. (${
          err instanceof Error ? err.message : String(err)
        })`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Kubo upload failed for ${filename}: ${response.status} ${response.statusText}`,
    );
  }

  const text = await response.text();
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length === 0) {
    throw new Error(`No response body returned for ${filename}`);
  }
  let last: { Hash?: string };
  try {
    last = JSON.parse(lines[lines.length - 1]);
  } catch {
    throw new Error(`Could not parse Kubo response for ${filename}`);
  }
  if (!last.Hash) {
    throw new Error(`No CID returned for ${filename}`);
  }
  return last.Hash;
}

export interface ExtractedBundle {
  zip: JSZip;
  manifest: KuboManifest;
}

/**
 * Reads and validates a ZIP, returning the parsed manifest.
 */
export async function extractBundle(file: File): Promise<ExtractedBundle> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new Error("Could not read the ZIP archive. Is it a valid .zip file?");
  }

  const manifestFile = findEntry(zip, MANIFEST_FILENAME);
  if (!manifestFile) {
    throw new Error(`Manifest "${MANIFEST_FILENAME}" was not found inside the ZIP.`);
  }

  let manifest: KuboManifest;
  try {
    manifest = JSON.parse(await manifestFile.async("string"));
  } catch {
    throw new Error("The manifest JSON is invalid and could not be parsed.");
  }

  if (!Array.isArray(manifest.upload_order) || manifest.upload_order.length === 0) {
    throw new Error("The manifest does not contain a valid upload_order list.");
  }

  return { zip, manifest };
}

/** Finds a zip entry by basename, ignoring nested folder prefixes. */
export function findEntry(zip: JSZip, name: string) {
  const direct = zip.file(name);
  if (direct) return direct;
  const matches = zip.file(new RegExp(`(^|/)${escapeRegex(name)}$`));
  return matches.length > 0 ? matches[0] : null;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Replaces every placeholder from the manifest with ipfs://CID in the metadata.
 * Returns the new metadata object and any placeholders that were not found.
 */
export function buildFinalMetadata(
  metadata: unknown,
  files: RequiredFile[],
): { metadata: unknown; missing: string[] } {
  let raw = JSON.stringify(metadata, null, 2);
  const missing: string[] = [];

  for (const f of files) {
    if (!f.cid) {
      missing.push(f.placeholder);
      continue;
    }
    if (!raw.includes(f.placeholder)) {
      missing.push(f.placeholder);
      continue;
    }
    raw = raw.split(f.placeholder).join(`ipfs://${f.cid}`);
  }

  return { metadata: JSON.parse(raw), missing };
}
