import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** @rsp/pulse k-anonymity escrow threshold. Telemetry stays sealed below this. */
export const K_THRESHOLD = 50;

export type RegionalTelemetry = {
  region_id: string;
  region_label: string;
  country_code: string;
  v_current: number;
  v_baseline: number;
  surgency: number;
  capacity: number;
  n_count: number;
  updated_at: string;
};

export type EsiState = "healthy" | "stable" | "strain" | "escrow";

/** ESI = (V_current / V_baseline) × (1 + S / C) */
export function calcEsi(r: Pick<RegionalTelemetry, "v_current" | "v_baseline" | "surgency" | "capacity">) {
  const baseline = r.v_baseline || 1;
  const capacity = r.capacity || 1;
  return (r.v_current / baseline) * (1 + r.surgency / capacity);
}

export function isEscrowed(r: Pick<RegionalTelemetry, "n_count">) {
  return r.n_count < K_THRESHOLD;
}

export function esiState(r: RegionalTelemetry): EsiState {
  if (isEscrowed(r)) return "escrow";
  const esi = calcEsi(r);
  if (esi < 1) return "healthy";
  if (esi <= 1.5) return "stable";
  return "strain";
}

export const STATE_LABEL: Record<EsiState, string> = {
  healthy: "Healthy",
  stable: "Stable",
  strain: "Under strain",
  escrow: "Held in escrow",
};

export const STATE_NOTE: Record<EsiState, string> = {
  healthy: "Regional capacity comfortably exceeds observed intent.",
  stable: "Demand and capacity are moving together within tolerance.",
  strain: "Intent is outpacing verified capacity — coordination advised.",
  escrow: `Regional telemetry held in escrow to preserve privacy (N < ${K_THRESHOLD} threshold not met).`,
};

export function useRegionalTelemetry() {
  const [rows, setRows] = useState<RegionalTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data, error: err } = await supabase
        .from("regional_telemetry")
        .select("*")
        .order("region_label", { ascending: true });
      if (!active) return;
      if (err) setError(err.message);
      else setRows((data ?? []) as unknown as RegionalTelemetry[]);
      setLoading(false);
    };

    void load();

    const channel = supabase
      .channel("regional-telemetry-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "regional_telemetry" },
        () => {
          void load();
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return { rows, loading, error };
}
