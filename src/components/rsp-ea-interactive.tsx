import { useMemo, useState, type ReactNode } from "react";
import { EaRef } from "@/components/rsp-ea-notes";

/* ── Interactive + explanatory pieces for the VEO branch ─────────────────── */

/** Short "SEO + SEM together" callout shown at the top of every branch page. */
export function EaSeoSemCallout() {
  return (
    <aside className="ea-dual" aria-label="SEO and SEM together">
      <div className="ea-dual-tag">SEO + SEM together</div>
      <p>
        Vertical Equilibrium Optimization is not an organic tactic or a bidding tactic — it governs
        <strong> both distribution channels with one score</strong>. Organic ranking (SEO) decides who is
        found for free; paid auctions (SEM) decide who can buy their way in front of the same demand.
        Today those layers pull in opposite directions: incumbents hold the free results for traffic they
        cannot service, while capable operators pay per click for demand they could clear.
        <EaRef id="asymmetry" /> VEO applies the same Respectful Intent Score
        <EaRef id="ris" /> to both, so a saturation signal cannot be routed around by switching channel.
      </p>
    </aside>
  );
}

/** Inline tooltip for a formula term. */
function T({ label, tip }: { label: ReactNode; tip: string }) {
  return (
    <span className="ea-tt" tabIndex={0} role="note" aria-label={tip}>
      {label}
      <span className="ea-tt-pop">{tip}</span>
    </span>
  );
}

/** The paired organic/paid formula, with per-term explanations. */
export function EaPairedFormula() {
  return (
    <div className="ea-formula">
      <div className="ea-formula-label">Proposed ranking terms — paid and organic</div>

      <div className="ea-formula-eq">
        <T label="Ad Rank" tip="SEM. Where your ad sits in the paid auction for a single query." /> ={" "}
        <T label="Bid Amount" tip="SEM only. What you are willing to pay per click. Has no organic equivalent — this is the term that lets budget substitute for merit." /> ×{" "}
        <T label="Quality Score" tip="SEM. Expected click-through rate, ad relevance and landing-page experience, scored 1–10." /> ×{" "}
        <em>
          <T label="Respectful Intent Score" tip="New in VEO. Identical term on both surfaces: can this destination behave respectfully and actually serve the person right now?" />
        </em>
        <EaRef id="adrank" />
      </div>

      <div className="ea-formula-eq" style={{ marginTop: 10 }}>
        <T label="Organic Position" tip="SEO. Where you sit in the free results for the same query." /> ={" "}
        <T label="Relevance" tip="SEO. Topical and semantic match between the page and the query — the closest analogue to Quality Score." /> ×{" "}
        <T label="Authority" tip="SEO only. Accumulated links, domain age and brand signals. A stock, not a flow — which is why incumbents keep free prominence after their capacity has gone." /> ×{" "}
        <em>
          <T label="Respectful Intent Score" tip="Same multiplier as the paid line. One saturation signal, applied to both channels at once." />
        </em>
        <EaRef id="organic" />
      </div>

      <div className="ea-formula-swap">
        <div>
          <span>What changes between the two lines</span>
          <p>
            Only two terms differ: <strong>Bid Amount ↔ Authority</strong>. Paid ranking substitutes money
            for merit; organic ranking substitutes history for merit. Both are stocks that an incumbent can
            hold while serving nobody.
          </p>
        </div>
        <div>
          <span>What stays identical</span>
          <p>
            <strong>Respectful Intent Score</strong> is the same value on both lines
            <EaRef id="ris" />, computed from live capacity telemetry
            <EaRef id="telemetry" />. Lose capacity and you lose free organic prominence first, auction
            eligibility second.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Side-by-side SEO vs SEM metric definitions for the same outcome. */
const CHANNEL_ROWS: { outcome: string; seo: string; sem: string }[] = [
  {
    outcome: "How prominence is acquired today",
    seo: "Inherited. Accumulated authority keeps the position at zero marginal cost per click.",
    sem: "Purchased. Every impression costs a bid, whether or not the click can be serviced.",
  },
  {
    outcome: "Who it currently favours",
    seo: "The dominant vertical player, ranked free for demand it cannot clear.",
    sem: "Whoever has the deepest budget — usually the same incumbent, defending.",
  },
  {
    outcome: "Cost of being visible",
    seo: "£0 per click once ranked; the cost was paid years ago in domain history.",
    sem: "Full CPC per click, paid by the capable operator with real availability.",
  },
  {
    outcome: "VEO's corrective lever",
    seo: "Withdraw free prominence first — the unserviceable overflow is removed from the organic slate.",
    sem: "Ease bids second — auction eligibility tapers once organic exposure has already been reduced.",
  },
  {
    outcome: "How prominence is re-earned",
    seo: "Rotationally, each cycle, by verified capacity to serve.",
    sem: "Rotationally, each cycle, by the same score — budget only buys optional reach on top.",
  },
  {
    outcome: "Signal used",
    seo: "Relevance × Authority × Respectful Intent Score.",
    sem: "Bid Amount × Quality Score × Respectful Intent Score.",
  },
];

export function EaChannelMetrics() {
  return (
    <div className="ea-channels">
      <div className="ea-channels-head" aria-hidden="true">
        <div>Outcome</div>
        <div>Organic ranking (SEO)</div>
        <div>Paid auction (SEM)</div>
      </div>
      {CHANNEL_ROWS.map((r) => (
        <div className="ea-channels-row" key={r.outcome}>
          <div className="ea-channels-outcome">{r.outcome}</div>
          <div className="ea-channels-cell">
            <span className="ea-chan-tag is-seo">SEO</span>
            {r.seo}
          </div>
          <div className="ea-channels-cell">
            <span className="ea-chan-tag is-sem">SEM</span>
            {r.sem}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Interactive worked example ──────────────────────────────────────────── */

const DEMAND = 1000; // qualified clicks per week in the vertical
const CPC = 9; // £ per paid click

function pct(n: number) {
  return `${Math.round(n)}%`;
}

const SIM_DEFAULTS = { inc: 35, comp: 80 };

function clampCapacity(value: unknown, fallback: number) {
  const n = Math.round(Number(value) / 5) * 5;
  return Number.isFinite(n) && n >= 5 && n <= 100 ? n : fallback;
}

/** Shared validator so the route and the component agree on the URL contract. */
export function validateSimSearch(search: Record<string, unknown>) {
  return {
    inc: clampCapacity(search.inc, SIM_DEFAULTS.inc),
    comp: clampCapacity(search.comp, SIM_DEFAULTS.comp),
  };
}

export function EaCapacitySim() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const incumbent = clampCapacity(search.inc, SIM_DEFAULTS.inc); // % of demand it can service
  const competitor = clampCapacity(search.comp, SIM_DEFAULTS.comp);
  const [copied, setCopied] = useState(false);

  const setIncumbent = (v: number) =>
    navigate({ to: ".", search: (prev: Record<string, unknown>) => ({ ...prev, inc: v }), replace: true });
  const setCompetitor = (v: number) =>
    navigate({ to: ".", search: (prev: Record<string, unknown>) => ({ ...prev, comp: v }), replace: true });


  const m = useMemo(() => {
    const incCap = (incumbent / 100) * DEMAND;
    const compCap = (competitor / 100) * DEMAND;

    // Today: authority decides. Incumbent holds ~70% of clicks organically, free.
    const todayIncClicks = DEMAND * 0.7;
    const todayCompClicks = DEMAND * 0.3; // all paid
    const todayUnserved = Math.max(0, todayIncClicks - incCap);
    const todayCompSpend = todayCompClicks * CPC;

    // Under VEO: the Respectful Intent Score scales prominence by live headroom.
    const risInc = Math.min(1, incCap / todayIncClicks);
    const risComp = Math.min(1, compCap / (DEMAND * 0.3) );
    const wInc = 0.7 * risInc;
    const wComp = 0.3 * (0.5 + risComp);
    const total = wInc + wComp || 1;
    let veoInc = Math.min(incCap, (wInc / total) * DEMAND);
    let veoComp = Math.min(compCap, DEMAND - veoInc);
    const veoUnserved = Math.max(0, DEMAND - veoInc - veoComp);
    // Under VEO the capable operator earns organic exposure; paid becomes optional reach.
    const veoCompPaid = Math.max(0, veoComp - compCap * 0.85);
    const veoCompSpend = veoCompPaid * CPC;

    return {
      incCap,
      compCap,
      todayIncClicks,
      todayCompClicks,
      todayUnserved,
      todayCompSpend,
      veoInc,
      veoComp,
      veoUnserved,
      veoCompSpend,
      risInc,
    };
  }, [incumbent, competitor]);

  const bar = (value: number, tone: string) => (
    <div className="ea-sim-bar">
      <div
        className="ea-sim-bar-fill"
        style={{ width: `${Math.max(2, (value / DEMAND) * 100)}%`, background: tone }}
      />
    </div>
  );

  return (
    <div className="ea-sim">
      <div className="ea-sim-controls">
        <label>
          <span>
            Dominant incumbent — click-serving capacity
            <strong>{pct(incumbent)}</strong>
          </span>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={incumbent}
            onChange={(e) => setIncumbent(Number(e.target.value))}
            aria-label="Incumbent click-serving capacity"
          />
          <small>Share of the region's weekly demand it can actually service without breaking its people.</small>
        </label>
        <label>
          <span>
            Capable competitor — click-serving capacity
            <strong>{pct(competitor)}</strong>
          </span>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={competitor}
            onChange={(e) => setCompetitor(Number(e.target.value))}
            aria-label="Capable competitor click-serving capacity"
          />
          <small>Real availability today — crews free, callbacks answered, jobs cleared this week.</small>
        </label>
        <p className="ea-sim-basis">
          Model basis: {DEMAND.toLocaleString()} qualified clicks per week in one metropolitan vertical,
          £{CPC} average CPC. Today's split is fixed by accumulated authority
          <EaRef id="organic" />; the VEO split is weighted by the Respectful Intent Score
          <EaRef id="ris" />.
        </p>
      </div>

      <div className="ea-sim-grid">
        <div className="ea-sim-panel">
          <div className="ea-sim-panel-tag">Today · ranking by authority and budget</div>
          <div className="ea-sim-metric">
            <span>Incumbent — free organic clicks</span>
            <strong>{Math.round(m.todayIncClicks)}</strong>
          </div>
          {bar(m.todayIncClicks, "oklch(62% .16 28)")}
          <div className="ea-sim-metric">
            <span>…of which it cannot service</span>
            <strong className="is-bad">{Math.round(m.todayUnserved)}</strong>
          </div>
          <div className="ea-sim-metric">
            <span>Competitor — clicks, all purchased</span>
            <strong>{Math.round(m.todayCompClicks)}</strong>
          </div>
          {bar(m.todayCompClicks, "oklch(70% .1 250)")}
          <div className="ea-sim-metric">
            <span>Competitor weekly ad spend</span>
            <strong className="is-bad">£{Math.round(m.todayCompSpend).toLocaleString()}</strong>
          </div>
          <p className="ea-sim-verdict">
            The operator that can serve the work pays to reach it. The operator that cannot is handed it free.
          </p>
        </div>

        <div className="ea-sim-panel is-good">
          <div className="ea-sim-panel-tag">Under VEO · ranking by capacity to serve</div>
          <div className="ea-sim-metric">
            <span>Incumbent — organic clicks retained</span>
            <strong>{Math.round(m.veoInc)}</strong>
          </div>
          {bar(m.veoInc, "oklch(62% .16 28)")}
          <div className="ea-sim-metric">
            <span>Respectful Intent Score applied</span>
            <strong>{m.risInc.toFixed(2)}×</strong>
          </div>
          <div className="ea-sim-metric">
            <span>Competitor — clicks earned organically</span>
            <strong className="is-good">{Math.round(m.veoComp)}</strong>
          </div>
          {bar(m.veoComp, "oklch(60% .13 160)")}
          <div className="ea-sim-metric">
            <span>Competitor weekly ad spend</span>
            <strong className="is-good">£{Math.round(m.veoCompSpend).toLocaleString()}</strong>
          </div>
          <div className="ea-sim-metric">
            <span>Demand left unserved region-wide</span>
            <strong className={m.veoUnserved > m.todayUnserved ? "is-bad" : "is-good"}>
              {Math.round(m.veoUnserved)}
            </strong>
          </div>
          <p className="ea-sim-verdict">
            Free prominence is withdrawn from the saturated incumbent first
            <EaRef id="rotational" />, then bids ease. The capable operator stops buying access to work it
            could already do.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── FAQ explaining the asymmetry in plain language ──────────────────────── */

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "In one sentence, what is the asymmetry?",
    a: (
      <>
        The businesses that get traffic for free are often the ones least able to serve it, and the
        businesses that could serve it are the ones paying for every click.
        <EaRef id="asymmetry" />
      </>
    ),
  },
  {
    q: "Why do incumbents rank organically for traffic they can't serve?",
    a: (
      <>
        Because organic ranking is built on <strong>authority</strong> — links, domain age, brand history.
        That is a stock you accumulated in the past, not a measure of whether you can answer the phone this
        week. A firm with a five-day callback backlog still ranks first, at zero marginal cost per lead.
        <EaRef id="organic" />
      </>
    ),
  },
  {
    q: "Why do capable operators end up paying for clicks?",
    a: (
      <>
        The free slots are already occupied by history they cannot out-age. The only remaining route to the
        same customer is the paid auction, so the operator with genuine availability pays a per-click tax to
        reach demand the incumbent is sitting on. Money substitutes for the merit the organic index refused
        to recognise.<EaRef id="adrank" />
      </>
    ),
  },
  {
    q: "Isn't that just competition working normally?",
    a: (
      <>
        Competition would be fine if the free channel measured present ability. It doesn't. The result is
        a market where cost is highest for the party creating the most value and lowest for the party
        destroying it — the customer waits five days, the capable crew sits idle, and both paid for the
        privilege.
      </>
    ),
  },
  {
    q: "What does VEO actually change?",
    a: (
      <>
        One shared multiplier — the Respectful Intent Score<EaRef id="ris" /> — is applied to both the
        organic and the paid formula. When live capacity telemetry<EaRef id="telemetry" /> says a business is
        saturated, it loses <em>free organic prominence first</em> and has its bids eased back second. The
        released demand rotates to whoever can clear it.<EaRef id="rotational" />
      </>
    ),
  },
  {
    q: "Doesn't this just punish successful businesses?",
    a: (
      <>
        No. Nothing is taken while a business is serving well; prominence only tapers when its own stress
        signal says the capacity is spent, and it returns the moment headroom does. What ends is the
        <em> annuity</em> — the guarantee of free traffic regardless of whether the work gets done.
      </>
    ),
  },
  {
    q: "Can a big spender simply buy back what organic took away?",
    a: (
      <>
        No — that is why the same score sits on both lines. If a saturation signal only touched organic,
        budget would route straight around it. Applying it to Ad Rank as well closes the loop.
        <EaRef id="ves" />
      </>
    ),
  },
  {
    q: "How is capacity measured without surveilling anyone?",
    a: (
      <>
        Three anonymised business-side streams — workforce stress, financial velocity and consumer
        serviceability — as low-resolution state signals, burned on write, dormant signals deleted after 90
        days.<EaRef id="telemetry" /> Nothing about the individual searcher is retained.
      </>
    ),
  },
  {
    q: "How long before it takes effect?",
    a: (
      <>
        A mandatory 90-day calibration sandbox runs first — equal-exposure diagnostics, then UI/UX
        remediation, then telemetry sync — with the rotational engine going live on Day 91.
        <EaRef id="calibration" />
      </>
    ),
  },
];

export function EaAsymmetryFaq() {
  return (
    <div className="ea-faq">
      {FAQ.map((f) => (
        <details key={f.q} className="ea-faq-item">
          <summary>{f.q}</summary>
          <div className="ea-faq-body">{f.a}</div>
        </details>
      ))}
    </div>
  );
}
