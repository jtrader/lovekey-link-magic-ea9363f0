import type { ReactNode } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconEye = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const IconScale = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3v18M6 7h12M6 7l-3 7h6l-3-7Zm12 0-3 7h6l-3-7Z" />
  </svg>
);
export const IconSync = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 4v4h-4M3 20v-4h4" />
  </svg>
);
export const IconClock = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconFlame = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.5 1.5 2 2 2-1-2 1-5 1-7Z" />
  </svg>
);
export const IconShield = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
export const IconLayers = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M3 13l9 5 9-5M3 16.5 12 21l9-4.5" />
  </svg>
);
export const IconHeart = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3 1 4 2.5 1-1.5 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21Z" />
  </svg>
);

// ─── Sub-components ────────────────────────────────────────────────────────

export function FlowCard({
  iconClass,
  icon,
  label,
  desc,
  showConnector = true,
}: {
  iconClass: string;
  icon: ReactNode;
  label: string;
  desc: string;
  showConnector?: boolean;
}) {
  return (
    <>
      <div className="rsp-flow-card">
        <div className={`rsp-flow-icon ${iconClass}`}>{icon}</div>
        <div>
          <div className="rsp-flow-label">{label}</div>
          <div className="rsp-flow-desc">{desc}</div>
        </div>
      </div>
      {showConnector && <div className="rsp-flow-connector" />}
    </>
  );
}

export function PrincipleCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rsp-principle-card">
      <div className="rsp-pc-icon">{icon}</div>
      <div className="rsp-pc-title">{title}</div>
      <div className="rsp-pc-body">{body}</div>
    </div>
  );
}
