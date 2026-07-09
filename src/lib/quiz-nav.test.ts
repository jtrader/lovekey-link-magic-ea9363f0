import { describe, it, expect } from "vitest";
import {
  QUIZ_QUESTIONS,
  SECTION_LABELS,
  clampIndex,
  nextIndex,
  prevIndex,
  navState,
} from "./quiz-data";

const TOTAL = QUIZ_QUESTIONS.length; // 12

// Expected third label for each 0-based question index in the 12-question flow.
const EXPECTED_LABELS = [
  "First third", // Q1
  "First third", // Q2
  "First third", // Q3
  "First third", // Q4
  "Second third", // Q5
  "Second third", // Q6
  "Second third", // Q7
  "Second third", // Q8
  "Final third", // Q9
  "Final third", // Q10
  "Final third", // Q11
  "Final third", // Q12
];

describe("quiz navigation clamping", () => {
  it("clamps out-of-range indices into [0, 11]", () => {
    expect(clampIndex(-5)).toBe(0);
    expect(clampIndex(0)).toBe(0);
    expect(clampIndex(11)).toBe(11);
    expect(clampIndex(99)).toBe(11);
  });

  it("does not move past the last question when going forward", () => {
    expect(nextIndex(11)).toBe(11);
  });

  it("does not move before the first question when going backward", () => {
    expect(prevIndex(0)).toBe(0);
  });
});

describe("navigating forward keeps index, section, and label aligned", () => {
  it("walks Q1 -> Q12 with correct third pills and labels", () => {
    let i = 0;
    for (let step = 0; step < TOTAL; step++) {
      const state = navState(i);
      expect(state.index).toBe(i);
      expect(state.questionNumber).toBe(i + 1);
      expect(state.label).toBe(EXPECTED_LABELS[i]);
      expect(state.section).toBe((SECTION_LABELS as readonly string[]).indexOf(EXPECTED_LABELS[i]));
      expect(state.isFirst).toBe(i === 0);
      expect(state.isLast).toBe(i === TOTAL - 1);
      i = nextIndex(i);
    }
    // After stepping through all, we are clamped on the last question.
    expect(i).toBe(TOTAL - 1);
  });
});

describe("navigating backward keeps index, section, and label aligned", () => {
  it("walks Q12 -> Q1 with correct third pills and labels", () => {
    let i = TOTAL - 1;
    for (let step = 0; step < TOTAL; step++) {
      const state = navState(i);
      expect(state.index).toBe(i);
      expect(state.questionNumber).toBe(i + 1);
      expect(state.label).toBe(EXPECTED_LABELS[i]);
      expect(state.section).toBe((SECTION_LABELS as readonly string[]).indexOf(EXPECTED_LABELS[i]));
      i = prevIndex(i);
    }
    expect(i).toBe(0);
  });
});

describe("section boundary transitions are exact", () => {
  it("crosses first -> second third between Q4 and Q5", () => {
    expect(navState(3).label).toBe("First third");
    expect(navState(nextIndex(3)).label).toBe("Second third");
  });

  it("crosses second -> final third between Q8 and Q9", () => {
    expect(navState(7).label).toBe("Second third");
    expect(navState(nextIndex(7)).label).toBe("Final third");
  });

  it("crosses final -> second third when moving back from Q9", () => {
    expect(navState(8).label).toBe("Final third");
    expect(navState(prevIndex(8)).label).toBe("Second third");
  });
});
