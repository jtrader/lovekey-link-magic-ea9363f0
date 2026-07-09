// Questions for the RSP "Law of Vibration" quiz.
// The correct-answer key lives server-side only (see api/public/quiz-submit.ts)
// so it is never shipped to the browser.

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export const QUIZ_TITLE = "RSP: The Law of Vibration";
export const QUIZ_SUBTITLE =
  "Reciprocal balance as a coordination principle — 12 questions, pass mark 6.";
export const PASS_MARK = 6;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      "What is the core premise of RSP regarding coordination between parties?",
    options: [
      "Coordination must run on rigid, binary logic",
      "Consent, trust and help-routing are dynamic exchanges that shift in real time",
      "Trust levels are fixed once they are established",
      "Only human-to-human coordination matters",
    ],
  },
  {
    id: 2,
    question: "How is the Law of Vibration used within RSP?",
    options: [
      "As literal physics governing the network",
      "As a structural metaphor for consent and coordination",
      "As a numeric scoring system",
      "As a branding concept only",
    ],
  },
  {
    id: 3,
    question: '"Like attracts like" is translated in RSP to mean that:',
    options: [
      "Parties are matched at random",
      "Transparent, reciprocal systems attract more stable, trusted coordination",
      "Extractive, one-sided systems attract the most trust",
      "Every system is treated identically regardless of behaviour",
    ],
  },
  {
    id: 11,
    question: "In RSP, a higher 'vibration' of coordination corresponds to:",
    options: [
      "More rigid enforcement of fixed, binary rules",
      "Greater transparency and reciprocity between parties",
      "Faster one-sided extraction of value",
      "Complete removal of consent checks",
    ],
  },
  {
    id: 4,
    question: "RSP treats consent and coordination as:",
    options: [
      "Strictly black-and-white, yes/no states",
      "A grey, elastic middle that supports graduated states",
      "A single one-time switch",
      "Permanent and unchangeable once set",
    ],
  },
  {
    id: 5,
    question: "According to the chapter, trust in RSP is primarily:",
    options: [
      "Declared upfront by each party",
      "Earned through reciprocal exchange",
      "Assigned by a central authority",
      "Fixed by policy and never revisited",
    ],
  },
  {
    id: 6,
    question: "The reciprocity model in RSP is best described as:",
    options: [
      "A punitive scoring or credit system",
      "A moving equilibrium that mirrors natural reciprocal systems",
      "A gatekeeping mechanism to restrict access",
      "A surveillance tool for monitoring parties",
    ],
  },
  {
    id: 7,
    question:
      "Which framework does the chapter use to find a fair compromise point?",
    options: [
      "Who, What, Where, How, Why",
      "Start, Stop, Continue",
      "Plan, Do, Check, Act",
      "Strengths, Weaknesses, Opportunities, Threats",
    ],
  },
  {
    id: 12,
    question: 'The "WHERE" dimension is a compromise between:',
    options: [
      "Local control and global consistency",
      "Marketing reach and engineering effort",
      "Speed and financial cost",
      "Total secrecy and full public exposure",
    ],
  },
  {
    id: 8,
    question: 'The "WHAT" dimension is a compromise between:',
    options: [
      "Local control and global consistency",
      "Data minimalism and data usefulness",
      "Individual autonomy and network accountability",
      "Rigid rules and adaptive judgment",
    ],
  },
  {
    id: 9,
    question: 'Under the "HOW" dimension, the compromise is that:',
    options: [
      "Rules define the floor and adaptive judgment operates within it",
      "Adaptive judgment overrides all rules",
      "Only rigid rules apply, with no discretion",
      "No safeguards are required at all",
    ],
  },
  {
    id: 10,
    question: 'For the "WHY" dimension, urgency can:',
    options: [
      "Lower the underlying safeguards themselves",
      "Lower friction without lowering the underlying safeguards",
      "Bypass consent entirely",
      "Permanently expand a party's access",
    ],
  },
];

// ---- Section (thirds) helpers ----
// Pure, dependency-free helpers so both the UI and tests share one source of truth.

export const SECTION_LABELS = [
  "First third",
  "Second third",
  "Final third",
] as const;

/** Number of questions per third (rounded up). */
export function sectionSize(total: number = QUIZ_QUESTIONS.length): number {
  return Math.ceil(total / SECTION_LABELS.length);
}

/** Which third (0-based) a 0-based question index belongs to. */
export function sectionOf(
  index: number,
  total: number = QUIZ_QUESTIONS.length,
): number {
  return Math.min(
    Math.floor(index / sectionSize(total)),
    SECTION_LABELS.length - 1,
  );
}

/** Count of answered questions (option index >= 0 means answered). */
export function countAnswered(answers: number[]): number {
  return answers.filter((a) => a >= 0).length;
}

// ---- Navigation helpers ----
// Clamp movement between questions so the active index never leaves the flow.

/** Clamp any index into the valid [0, total-1] range. */
export function clampIndex(
  index: number,
  total: number = QUIZ_QUESTIONS.length,
): number {
  return Math.max(0, Math.min(index, total - 1));
}

/** Move to the next question, clamped at the last one. */
export function nextIndex(
  index: number,
  total: number = QUIZ_QUESTIONS.length,
): number {
  return clampIndex(index + 1, total);
}

/** Move to the previous question, clamped at the first one. */
export function prevIndex(
  index: number,
  total: number = QUIZ_QUESTIONS.length,
): number {
  return clampIndex(index - 1, total);
}

/**
 * Full navigation state for a given active question index: the 0-based index,
 * its human question number, which third it belongs to, and the section label.
 */
export function navState(
  index: number,
  total: number = QUIZ_QUESTIONS.length,
): {
  index: number;
  questionNumber: number;
  section: number;
  label: string;
  isFirst: boolean;
  isLast: boolean;
} {
  const i = clampIndex(index, total);
  const section = sectionOf(i, total);
  return {
    index: i,
    questionNumber: i + 1,
    section,
    label: SECTION_LABELS[section],
    isFirst: i === 0,
    isLast: i === total - 1,
  };
}

// ---- Focus + announcement helpers ----
// Decides where keyboard focus should land and what a screen reader hears when
// the active question changes. Shared so the UI and tests stay in lockstep.

export type FocusTarget =
  | { kind: "option"; qIndex: number; optIndex: number }
  | { kind: "heading"; qIndex: number };

/**
 * Where focus should move for the active question: the selected option when the
 * question is answered, otherwise the question heading/container.
 */
export function focusTargetFor(
  activeIndex: number,
  answers: number[],
  total: number = QUIZ_QUESTIONS.length,
): FocusTarget {
  const i = clampIndex(activeIndex, total);
  const selected = answers[i];
  return selected >= 0
    ? { kind: "option", qIndex: i, optIndex: selected }
    : { kind: "heading", qIndex: i };
}

/** Screen-reader announcement text for the active question. */
export function announcementFor(
  activeIndex: number,
  total: number = QUIZ_QUESTIONS.length,
): string {
  const i = clampIndex(activeIndex, total);
  const q = QUIZ_QUESTIONS[i];
  return `Question ${i + 1} of ${total}, ${SECTION_LABELS[
    sectionOf(i, total)
  ].toLowerCase()}. ${q.question}`;
}


