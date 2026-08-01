import { Link } from "@tanstack/react-router";
import { MACRO_GLOSSARY, useGlossarySheet, type GlossaryId } from "@/components/rsp-macro/MacroGlossary";

const KEY_TERMS: GlossaryId[] = ["veo", "ves", "pooledIntent", "telemetry", "rotational", "calibration"];

/** Compact glossary callout shown at the top of the VEO branch. */
export function EaGlossaryCallout() {
  const sheet = useGlossarySheet();

  return (
    <aside
      style={{
        maxWidth: 1000,
        margin: "24px auto 0",
        background: "var(--rsp-bg-warm)",
        border: "1px solid var(--rsp-border)",
        borderRadius: "var(--rsp-radius)",
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          fontSize: ".7rem",
          fontWeight: 600,
          letterSpacing: ".09em",
          textTransform: "uppercase",
          color: "var(--rsp-text-soft)",
          marginBottom: 8,
        }}
      >
        Key terms · @rsp/macro glossary
      </div>
      <p style={{ margin: "0 0 10px", fontSize: ".88rem", lineHeight: 1.6, color: "var(--rsp-text-muted)" }}>
        This branch uses the shared Equilibrium Theory vocabulary. Tap a term to open the glossary drawer, or read the{" "}
        <Link to="/rsp/macro" style={{ color: "var(--rsp-primary)" }}>
          full macro protocol
        </Link>
        .
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {KEY_TERMS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => sheet?.open(id)}
            style={{
              cursor: "pointer",
              background: "var(--rsp-surface)",
              border: "1px solid var(--rsp-border-strong, var(--rsp-border))",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: ".78rem",
              color: "var(--rsp-text)",
            }}
          >
            {MACRO_GLOSSARY[id].term.split(" — ")[0]}
          </button>
        ))}
      </div>
    </aside>
  );
}
