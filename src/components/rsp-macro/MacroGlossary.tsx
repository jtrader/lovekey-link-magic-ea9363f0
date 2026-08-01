import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type GlossaryId = keyof typeof MACRO_GLOSSARY;

export type GlossaryEntry = { term: string; definition: string };

export const MACRO_GLOSSARY: Record<string, GlossaryEntry> = {
  veo: {
    term: "VEO — Vertical Equilibrium Optimisation",
    definition:
      "The branch of Equilibrium Theory that ranks advertisers by whether they can actually serve demand, instead of by who bids the most.",
  },
  ves: {
    term: "VES — Vertical Equilibrium Score",
    definition:
      "A live score combining relevance, consumer experience, workforce stress and financial velocity. A higher VES means a business has healthy spare capacity.",
  },
  telemetry: {
    term: "Tripartite telemetry",
    definition:
      "Three anonymised capacity signals — workforce stress, financial velocity and consumer serviceability — that feed the equilibrium engine. No personal tracking is involved.",
  },
  pooledIntent: {
    term: "Pooled intent",
    definition:
      "Search demand is grouped at the vertical level rather than tied to individuals, so matching happens without persistent per-person profiles.",
  },
  calibration: {
    term: "Calibration timeline",
    definition:
      "The mandatory 90-day onboarding sandbox: Month 1 equal exposure diagnostics, Month 2 UI/UX remediation, Month 3 telemetry sync — the engine only goes live on Day 91.",
  },
  equalExposure: {
    term: "Equal Exposure Sandbox",
    definition:
      "Month 1 of calibration. Every participant gets identical impressions so conversion friction can be measured on a level playing field.",
  },
  remediation: {
    term: "UI/UX Remediation",
    definition:
      "Month 2 of calibration. Businesses fix page speed, core web vitals and design flaws until they meet the vertical's mean conversion benchmark.",
  },
  telemetrySync: {
    term: "Telemetry Sync & Launch",
    definition:
      "Month 3 of calibration. Accounting and workforce baselines are established, then the Rotational Equilibrium Engine activates.",
  },
  rotational: {
    term: "Rotational Equilibrium Engine",
    definition:
      "The live ranking system that rotates exposure across a vertical pool so demand flows to whoever currently has capacity to serve it well.",
  },
  signalDecay: {
    term: "Signal decay",
    definition:
      "Raw telemetry is reduced to low-resolution state signals, burned on write, and dormant signals auto-delete after 90 days.",
  },
};

/**
 * Inline glossary term. Shows its definition on hover, focus and tap.
 */
export function Term({ id, children }: { id: GlossaryId; children?: ReactNode }) {
  const entry = MACRO_GLOSSARY[id];
  const tipId = useId();
  const sheet = useContext(GlossarySheetContext);
  if (!entry) return <>{children}</>;

  return (
    <span className="group relative inline-block">
      <button
        type="button"
        aria-describedby={tipId}
        onClick={() => sheet?.open(id)}
        className="cursor-help border-b border-dotted border-amber-500/70 bg-transparent p-0 text-left font-[inherit] text-[inherit] leading-[inherit] text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
      >
        {children ?? entry.term}
      </button>
      <span
        role="tooltip"
        id={tipId}
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-64 max-w-[75vw] -translate-x-1/2 rounded-xl border border-slate-200 bg-[#FFFFFF] p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-slate-600 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 md:block"
      >
        <span className="mb-1 block font-semibold text-slate-900">{entry.term}</span>
        {entry.definition}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Mobile bottom sheet
// ---------------------------------------------------------------------------

type SheetApi = { open: (id?: GlossaryId) => void };
const GlossarySheetContext = createContext<SheetApi | null>(null);

export function useGlossarySheet() {
  return useContext(GlossarySheetContext);
}

/**
 * Provides a mobile-friendly glossary bottom sheet. Tapping any <Term/> opens
 * it scrolled to that definition; a floating button opens the full list.
 */
export function GlossarySheetProvider({
  children,
  showOnDesktop = false,
}: {
  children: ReactNode;
  /** Also render the floating button + sheet above the md breakpoint. */
  showOnDesktop?: boolean;
}) {
  const hide = showOnDesktop ? "" : "md:hidden";
  const [openId, setOpenId] = useState<GlossaryId | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const api = useMemo<SheetApi>(
    () => ({
      open: (id) => {
        setOpenId(id ?? null);
        setIsOpen(true);
      },
    }),
    [],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !openId) return;
    const el = listRef.current?.querySelector(`[data-term="${openId}"]`);
    el?.scrollIntoView({ block: "start" });
  }, [isOpen, openId]);

  const ids = Object.keys(MACRO_GLOSSARY) as GlossaryId[];

  return (
    <GlossarySheetContext.Provider value={api}>
      {children}

      {/* Floating opener — mobile only, tooltips cover desktop */}
      <button
        type="button"
        onClick={() => api.open()}
        className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-amber-500/40 bg-[#FFFFFF] px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-amber-700 shadow-lg ${hide}"
      >
        <span aria-hidden="true">?</span> Glossary
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-200 ${hide} ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="RSP Macro glossary"
        aria-hidden={!isOpen}
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[80vh] rounded-t-3xl border-t border-slate-200 bg-[#FFFFFF] shadow-2xl transition-transform duration-300 ${hide} ${
          isOpen ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 pb-3 pt-3">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-300"
          />
          <h2 className="font-mono text-xs uppercase tracking-widest text-amber-700">
            @rsp/macro glossary
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
          >
            Close
          </button>
        </div>
        <div ref={listRef} className="max-h-[calc(80vh-3.5rem)] overflow-y-auto px-5 py-4">
          <dl className="space-y-4">
            {ids.map((id) => (
              <div
                key={id}
                data-term={id}
                className={`scroll-mt-2 rounded-xl border p-3 ${
                  openId === id ? "border-amber-500/50 bg-amber-50" : "border-slate-200 bg-slate-50"
                }`}
              >
                <dt className="text-sm font-semibold text-slate-900">{MACRO_GLOSSARY[id].term}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-slate-600">
                  {MACRO_GLOSSARY[id].definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </GlossarySheetContext.Provider>
  );
}


/** Full glossary card, for the bottom of a macro page. */
export function GlossaryPanel({ ids }: { ids: GlossaryId[] }) {
  return (
    <section className="my-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-amber-700">Glossary</h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        {ids.map((id) => (
          <div key={String(id)}>
            <dt className="text-sm font-semibold text-slate-900">{MACRO_GLOSSARY[id].term}</dt>
            <dd className="mt-1 text-xs leading-relaxed text-slate-600">
              {MACRO_GLOSSARY[id].definition}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
