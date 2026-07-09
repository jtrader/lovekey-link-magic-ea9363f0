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
