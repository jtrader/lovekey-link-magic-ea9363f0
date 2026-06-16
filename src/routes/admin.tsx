import { createFileRoute, Link } from "@tanstack/react-router";
import lovekeyMark from "@/assets/lovekey-mark.png";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  EyeOff,
  Globe2,
  HandHeart,
  HeartPulse,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: HelpNetworkAdminDashboard,
  head: () => ({
    meta: [
      { title: "HELP Network Admin — Love Key Link" },
      {
        name: "description",
        content:
          "A calm operational intelligence dashboard for consented Hub signals and anonymous public-site HELP Network journeys.",
      },
    ],
  }),
});

const networkStats = [
  { label: "Active hubs", value: "128", detail: "family · recovery · community", tone: "blue" },
  { label: "Open support", value: "34", detail: "9 need assignment", tone: "amber" },
  { label: "Resolved this week", value: "212", detail: "care reached safely", tone: "mint" },
  { label: "Consent health", value: "96%", detail: "clear or current", tone: "lavender" },
];

const requests = [
  {
    id: "#4821",
    hub: "Elder Care Circle",
    type: "Appointment transport",
    urgency: "Medium",
    consent: "Approved for helper",
    assigned: "Pending",
    time: "2h 14m",
    action: "Assign nearby verified helper",
  },
  {
    id: "#4822",
    hub: "Recovery Circle",
    type: "Safe check-in",
    urgency: "High",
    consent: "Trusted contacts only",
    assigned: "Mia Chen",
    time: "34m",
    action: "Confirm backup guardian",
  },
  {
    id: "#4823",
    hub: "Blended Family Hub",
    type: "Handoff support",
    urgency: "Low",
    consent: "Hub admins only",
    assigned: "Sarah Lee",
    time: "4h 08m",
    action: "Send calm schedule prompt",
  },
];

const permissionRows = [
  ["Michael", "Family Hub", "Dad", "Summary", "Hidden", "Shared", "Private", "No"],
  ["Sarah", "Recovery Circle", "Guardian", "Summary", "Hidden", "Hidden", "Trusted", "Yes"],
  ["Liam", "Sporting Group", "Coach", "Available", "Hidden", "Events", "Hidden", "No"],
];

const publicSites = [
  ["Main HELP", "2,410", "14%", "126", "Find help", "Contact form"],
  ["Recovery", "890", "31%", "42", "Urgent care", "Step 2 form"],
  ["Family Support", "1,320", "18%", "88", "Elder care", "Invite flow"],
  ["Community", "740", "9%", "51", "Volunteer", "Signup page"],
  ["Key / NFC", "530", "22%", "97", "Activation", "QR help"],
  ["RSP / Protocol", "410", "7%", "18", "API docs", "Docs page"],
];

const insights = [
  "Three elder care hubs have repeated appointment transport requests.",
  "Recovery pages show high help intent but lower form completion on mobile.",
  "Two support circles have no backup trusted contact.",
  "Family support content is driving the most hub invite requests.",
];

function HelpNetworkAdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f4f9ff] text-[#10214a]">
      <header className="sticky top-0 z-30 border-b border-blue-100/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={lovekeyMark} alt="Love Key Link" className="h-12 w-12 object-contain" />
            <div>
              <div className="font-semibold tracking-tight">Love Key HELP Network</div>
              <div className="text-xs text-slate-500">Visual Administration Dashboard</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-slate-600 lg:flex">
            <a href="#network" className="hover:text-blue-700">
              Network
            </a>
            <a href="#requests" className="hover:text-blue-700">
              Support
            </a>
            <a href="#permissions" className="hover:text-blue-700">
              Permissions
            </a>
            <a href="#public-sites" className="hover:text-blue-700">
              Public sites
            </a>
            <a href="#insights" className="hover:text-blue-700">
              Insights
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-[0_20px_70px_rgba(46,120,255,.10)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Decision support · not surveillance
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Calm operational intelligence for the Love Key HELP Network.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              See where support is needed, where trust is forming, and where public journeys are
              becoming safe next steps — with consent before insight and context separation by
              default.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#requests"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-200"
              >
                Review support requests <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#public-sites"
                className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-2.5 text-sm font-medium text-blue-700"
              >
                View six-site intelligence
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_20px_70px_rgba(46,120,255,.08)]">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <HeartPulse className="h-5 w-5 text-blue-600" />
              Core questions
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                "Who needs support now?",
                "Which hubs are healthy, quiet, overloaded or at risk?",
                "Are permissions and contextual roles working safely?",
                "Who is participating reliably?",
                "Where is the Help Network improving journeys?",
              ].map((item, index) => (
                <li key={item} className="flex gap-3 rounded-2xl bg-blue-50/60 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-blue-700">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="network" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {networkStats.map((stat) => (
            <MetricCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <div
            id="requests"
            className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-soft"
          >
            <SectionTitle
              icon={<HandHeart className="h-5 w-5" />}
              eyebrow="Command centre"
              title="Support requests"
            />
            <div className="mt-5 grid gap-3">
              {requests.map((request) => (
                <article
                  key={request.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Support Request {request.id}</div>
                      <div className="mt-1 text-sm text-slate-600">Hub: {request.hub}</div>
                    </div>
                    <span className={urgencyClass(request.urgency)}>{request.urgency}</span>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                    <Info label="Type" value={request.type} />
                    <Info label="Consent" value={request.consent} />
                    <Info label="Assigned" value={request.assigned} />
                    <Info label="Time open" value={request.time} />
                  </div>
                  <div className="mt-4 rounded-xl bg-white px-3 py-2 text-sm text-blue-700 ring-1 ring-blue-100">
                    Suggested action: {request.action}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-soft">
            <SectionTitle
              icon={<BarChart3 className="h-5 w-5" />}
              eyebrow="Network health"
              title="Participation signals"
            />
            <div className="mt-5 space-y-4">
              <Progress label="Check-ins completed" value="82%" width="82%" tone="bg-emerald-400" />
              <Progress
                label="Support requests resolved"
                value="76%"
                width="76%"
                tone="bg-blue-500"
              />
              <Progress
                label="Average response target"
                value="68%"
                width="68%"
                tone="bg-amber-400"
              />
              <Progress label="Consent clarity" value="96%" width="96%" tone="bg-violet-400" />
            </div>
            <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm text-slate-600">
              <Sparkles className="mb-2 h-4 w-4 text-blue-600" />
              Language is deliberately gentle: “may need follow-up” replaces “inactive user,” and
              sensitive status changes require human review.
            </div>
          </div>
        </section>

        <section
          id="permissions"
          className="mt-8 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-soft"
        >
          <SectionTitle
            icon={<EyeOff className="h-5 w-5" />}
            eyebrow="Consent administration"
            title="Permissions and contextual roles"
          />
          <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100">
            <table className="min-w-full divide-y divide-blue-100 text-sm">
              <thead className="bg-blue-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {[
                    "User",
                    "Hub",
                    "Role",
                    "Presence",
                    "Location",
                    "Calendar",
                    "Emotional status",
                    "Admin",
                  ].map((head) => (
                    <th key={head} className="px-4 py-3 font-medium">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 bg-white">
                {permissionRows.map((row) => (
                  <tr key={`${row[0]}-${row[1]}`}>
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-3 text-slate-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
              Preview what this person can see
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
              2 expired consent alerts
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              No context collapse detected
            </span>
          </div>
        </section>

        <section
          id="public-sites"
          className="mt-8 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-soft"
        >
          <SectionTitle
            icon={<Globe2 className="h-5 w-5" />}
            eyebrow="Anonymous website intelligence"
            title="Six public HELP Network sites"
          />
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Before consent, analyse patterns. After consent, support the person. Public-site signals
            remain separate from known Hub identity unless a visitor chooses a support pathway.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100">
            <table className="min-w-full divide-y divide-blue-100 text-sm">
              <thead className="bg-blue-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {["Site", "Visitors", "Help intent", "Conversions", "Top topic", "Drop-off"].map(
                    (head) => (
                      <th key={head} className="px-4 py-3 font-medium">
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 bg-white">
                {publicSites.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${cell}`}
                        className={
                          index === 0
                            ? "px-4 py-3 font-medium text-slate-800"
                            : "px-4 py-3 text-slate-600"
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="insights" className="mt-8 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-soft">
            <SectionTitle
              icon={<Network className="h-5 w-5" />}
              eyebrow="Signal pipeline"
              title="Consent before insight"
            />
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              {[
                "Raw signal received",
                "RSP consent + context check",
                "Signal normalised",
                "Insight generated",
                "Admin action audited",
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-soft">
            <SectionTitle
              icon={<Sparkles className="h-5 w-5" />}
              eyebrow="Recommendations"
              title="Insights that assist, not decide"
            />
            <div className="mt-5 grid gap-3">
              {insights.map((insight) => (
                <div
                  key={insight}
                  className="flex gap-3 rounded-2xl bg-blue-50/70 p-4 text-sm text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-soft">
          <SectionTitle
            icon={<ShieldCheck className="h-5 w-5" />}
            eyebrow="Safety rules"
            title="A calm care-coordination console"
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {[
              "Minimum necessary disclosure",
              "Context separation by default",
              "No hidden surveillance scoring",
              "Human review for sensitive status",
              "AI recommends; people decide",
            ].map((rule) => (
              <div
                key={rule}
                className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-100"
              >
                {rule}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  const color =
    tone === "mint"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700"
        : tone === "lavender"
          ? "bg-violet-50 text-violet-700"
          : "bg-blue-50 text-blue-700";

  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-soft">
      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${color}`}>
        {label}
      </div>
      <div className="mt-4 text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{detail}</div>
    </div>
  );
}

function SectionTitle({
  icon,
  eyebrow,
  title,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-blue-600">
        {icon}
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 font-medium text-slate-700">{value}</div>
    </div>
  );
}

function Progress({
  label,
  value,
  width,
  tone,
}: {
  label: string;
  value: string;
  width: string;
  tone: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-800">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${tone}`} style={{ width }} />
      </div>
    </div>
  );
}

function urgencyClass(urgency: string) {
  if (urgency === "High")
    return "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700";
  if (urgency === "Medium")
    return "rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700";
  return "rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700";
}
