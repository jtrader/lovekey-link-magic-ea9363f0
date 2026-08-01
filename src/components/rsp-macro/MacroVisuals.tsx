import type { ReactNode } from "react";

// Shared stroke style — matches the Love Key / RSP line-icon aesthetic.
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type IconProps = { className?: string };

const svgProps = (className?: string) => ({
  viewBox: "0 0 24 24",
  className: className ?? "h-5 w-5",
  "aria-hidden": true as const,
  ...stroke,
});

export const IconUsers = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.2 2.7-5 6-5s6 1.8 6 5" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8M17.5 20c0-2.4-.9-4-2.3-4.9" />
  </svg>
);

export const IconPulse = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M2 12h4l2.5-6 4 12 2.5-6H22" />
  </svg>
);

export const IconGauge = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M4 18a8 8 0 1 1 16 0" />
    <path d="M12 18l4.5-5" />
    <circle cx="12" cy="18" r="1.2" />
  </svg>
);

export const IconRotate = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 4v4h-4M3 20v-4h4" />
  </svg>
);

export const IconScales = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M12 3v18M6 7h12M6 7l-3 7h6l-3-7Zm12 0-3 7h6l-3-7Z" />
  </svg>
);

export const IconShieldCheck = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const IconLayersFlow = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M3 13l9 5 9-5M3 16.5 12 21l9-4.5" />
  </svg>
);

export const IconSigma = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M17 5H7l5 7-5 7h10" />
  </svg>
);

export const IconCalendar = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconFlask = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M10 3h4M10.5 3v6L5 18a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5.5-9V3" />
    <path d="M7.5 14h9" />
  </svg>
);

export const IconChart = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 17v-5M12.5 17V8M17 17v-7" />
  </svg>
);

export const IconLock = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
    <path d="M8 10V7.5a4 4 0 1 1 8 0V10" />
  </svg>
);

export const IconClose = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </svg>
);

export const IconCheck = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.3l2.6 2.6L16 9.5" />
  </svg>
);

// ─── Building blocks ───────────────────────────────────────────────────────

const toneMap = {
  emerald: "border-emerald-500/30 bg-emerald-50 text-emerald-700",
  amber: "border-amber-500/30 bg-amber-50 text-amber-700",
  cyan: "border-cyan-500/30 bg-cyan-50 text-cyan-700",
  purple: "border-purple-500/30 bg-purple-50 text-purple-700",
  red: "border-red-500/30 bg-red-50 text-red-700",
  slate: "border-slate-200 bg-slate-100 text-slate-600",
} as const;

export type MacroTone = keyof typeof toneMap;

export function MacroIconBadge({
  tone = "emerald",
  children,
  size = "md",
}: {
  tone?: MacroTone;
  children: ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl border ${toneMap[tone]} ${
        size === "sm" ? "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4" : "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5"
      }`}
    >
      {children}
    </span>
  );
}

export function MacroBullet({
  tone = "emerald",
  icon,
  children,
}: {
  tone?: MacroTone;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const color = toneMap[tone].split(" ").find((c) => c.startsWith("text-"));
  return (
    <li className="flex items-start gap-2.5">
      <span className={`mt-0.5 shrink-0 ${color} [&_svg]:h-4 [&_svg]:w-4`}>
        {icon ?? <IconCheck />}
      </span>
      <span>{children}</span>
    </li>
  );
}

/** Horizontal (stacked on mobile) flow diagram in the Love Key light theme. */
export function MacroFlow({
  steps,
}: {
  steps: readonly { tone: MacroTone; icon: ReactNode; label: string; desc: string }[];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
      {steps.map((s, i) => (
        <div key={s.label} className="relative flex md:block">
          <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-[#FFFFFF] p-5">
            <MacroIconBadge tone={s.tone}>{s.icon}</MacroIconBadge>
            <div>
              <div className="mb-1 text-sm font-semibold text-slate-900">{s.label}</div>
              <p className="font-mono text-xs leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          </div>
          {i < steps.length - 1 && (
            <>
              <span
                aria-hidden="true"
                className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 font-mono text-xs text-slate-400 md:block md:-right-2.5 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0"
              >
                →
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 font-mono text-xs text-slate-400 md:hidden"
              >
                ↓
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
