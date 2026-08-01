// Case study data — feeds the /rsp/case-studies index and individual pages.
// Adding a new case study is a content addition here, not a structural change:
// add an entry with a matching route file at /rsp/case-studies/<slug>.

export type CaseStudyApplication = {
  /** Short application title, e.g. "Supporter Questionnaire & Profiling Data". */
  title: string;
  /** One-line summary shown on the application card header. */
  summary: string;
  /** When / Where / How / Who / Why framework fields. */
  who: string;
  what: string;
  when: string;
  where: string;
  how: string;
  why: string;
};

export type CaseStudy = {
  slug: string;
  /** Product / organisation name. */
  product: string;
  /** URL to the product, if public. */
  productUrl?: string;
  /** One-line summary of which RSP dimension(s) this demonstrates. */
  summary: string;
  /** Tags for the RSP dimensions demonstrated. */
  dimensions: string[];
  /** Longer overview paragraph shown at the top of the full page. */
  overview: string;
  /** The RSP applications showcased, each in the When/Where/How/Who/Why frame. */
  applications: CaseStudyApplication[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "twinly",
    product: "Twinly.life",
    productUrl: "https://twinly.life",
    summary:
      "Consent-gated supporter profiling data and a revocable creator identity-exposure dial for AI-generated persona content.",
    dimensions: ["Consent grants", "Revocability", "Identity exposure", "Data retention"],
    overview:
      "Twinly.life is an AI-powered creator platform where creators build disclosed AI personas that interact with supporters. Two RSP-governed systems are highlighted here: how supporter profiling data is protected as it shapes persona interactions, and how creators can protect their real-world identity while using AI-generated personas built from their own likeness.",
    applications: [
      {
        title: "Supporter Questionnaire & Profiling Data",
        summary:
          "Consent-gated, tiered profiling data that only reaches a persona when both an RSP grant and a prompt-safety classification pass.",
        who: "Twinly supporters — people interacting with creator personas — who provide preference and interest data (explicitly, through profile questionnaires, and implicitly, through inferred signals from conversation) so personas can tailor interactions to them.",
        what: "Supporter profile data is classified into three tiers before it can reach any AI system: prompt-safe (general, non-identifying preference signals), server-only (used to shape behavior without being exposed to the AI directly), and never-stored-in-prompt (anything identifying). RSP governs which tier applies and who — which creator, which persona — can see any given piece of data, defaulting to private unless the supporter explicitly opts to share.",
        when: "Enforced continuously: at the point of data collection (classification applied on entry), at every AI conversation turn (only RSP-permitted data reaches the persona's context), and on an ongoing basis via a 90-day automatic purge for supporters who haven't logged in — RSP-tracked consent state is deleted, not archived.",
        where: "Within Twinly's persona chat system, specifically at the point where a supporter's profile data would otherwise be assembled into an AI system prompt. RSP sits as the access-control substrate between the stored profile data and the generation pipeline.",
        how: "Each supporter profile field carries an RSP consent grant recording its visibility scope (all creators, specific creators, specific personas, or private). When a persona's conversational context is constructed, the system checks both the RSP grant and the data's prompt-safety classification — both must pass before any supporter data is included. Revocation is immediate: if a supporter changes a visibility setting or their account is purged after 90 days of inactivity, the change is enforced on the very next context construction, with no stale-grant window.",
        why: "Because personalization and privacy don't have to trade off against each other if consent is a live, revocable state rather than a one-time checkbox. A supporter can benefit from a persona that understands their interests without that data becoming a static, unmanaged liability sitting in a database indefinitely — and without a determined actor being able to extract it from the AI system itself, since the underlying hardening layer prevents prompt-level data exposure by design.",
      },
      {
        title: "Creator Anonymity & Identity-Exposure Protocols",
        summary:
          "A per-persona, fully revocable identity-exposure dial that constrains how closely AI-generated content resembles a creator's real likeness and voice.",
        who: "Twinly creators who build AI personas based on their own photos and voice, and who may want to control how closely those personas resemble their real, identifiable selves — for reasons ranging from personal safety to simple creative separation between their public persona and private life.",
        what: "An identity-exposure consent dimension within RSP, letting a creator set, per persona, how closely a generated persona's appearance and voice should resemble their real photos and voice. This is expressed as a dial rather than a binary — a creator can choose a point between \"closely resembles me\" and \"meaningfully diverged,\" understanding the tradeoff each setting carries.",
        when: "Set at persona creation and adjustable at any time afterward. Changes apply to future generated content by default, with an opt-in option to regenerate existing assets to match a newly chosen setting.",
        where: "In persona settings, tied to the same generation pipeline used for a persona's voice, image, and video content. The setting is scoped per persona, not creator-account-wide — a creator might keep their \"Real Me\" identity at full resemblance while a separate AI persona sits further along the divergence spectrum.",
        how: "The dial is backed by an RSP identity_exposure consent grant, tracked the same way as any other RSP-governed permission: subject (the creator), object (the specific persona), scope (the chosen divergence range, covering visual and voice separately), and full revocability. Generation requests read this grant as a constraint before producing new content. A similarity-scoring step compares generated output against the creator's real source material to confirm it falls within the chosen range.",
        why: "Because using AI to build a public persona shouldn't force a choice between \"use my real face and voice with no protection\" and \"don't use my likeness at all.\" The dial gives creators a middle path, paired with a pseudonym/stage-name system, so they can be genuinely recognizable to an audience or personal contacts who already know them while remaining meaningfully harder to positively identify by a stranger doing a reverse-image search. It's presented honestly: this reduces one real risk vector (visual identification), it doesn't eliminate every path to identification (voice cloning fidelity and behavioral patterns are separate, clearly disclosed limitations on the platform), and it's never used to justify or enable a lower content-safety bar — the identity-exposure setting and Twinly's platform-enforced explicitness ceiling are fully independent of each other.",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
