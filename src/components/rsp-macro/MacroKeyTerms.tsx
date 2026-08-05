import { Link } from "@tanstack/react-router";
import { MACRO_GLOSSARY, useGlossarySheet, type GlossaryId } from "@/components/rsp-macro/MacroGlossary";

const KEY_TERMS: GlossaryId[] = ["veo", "ves", "pooledIntent", "telemetry", "rotational", "calibration"];

/** Key-terms glossary callout shown across the Macro Equilibrium pages. */
export function MacroKeyTerms() {
  const sheet = useGlossarySheet();

  return (
    <aside className="mb-8 rounded-xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm">
      <div className="mb-2 text-[.7rem] font-semibold uppercase tracking-[.09em] text-slate-500">
        Key terms · @rsp/macro glossary
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-600">
        These pages use the shared Equilibrium Theory vocabulary. Tap a term to open the glossary drawer, or
        read the{" "}
        <Link to="/rsp/macro/overview" className="font-medium text-sky-700 underline underline-offset-2">
          full macro protocol
        </Link>
        .
      </p>
      <div className="flex flex-wrap gap-2">
        {KEY_TERMS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => sheet?.open(id)}
            className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:bg-white"
          >
            {MACRO_GLOSSARY[id].term.split(" — ")[0]}
          </button>
        ))}
      </div>
    </aside>
  );
}
