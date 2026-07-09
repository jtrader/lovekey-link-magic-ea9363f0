import { describe, it, expect } from "vitest";
import {
  QUIZ_QUESTIONS,
  SECTION_LABELS,
  sectionSize,
  sectionOf,
  countAnswered,
} from "./quiz-data";

describe("quiz thirds / section mapping", () => {
  it("has 12 questions split into 3 sections of 4", () => {
    expect(QUIZ_QUESTIONS.length).toBe(12);
    expect(SECTION_LABELS).toHaveLength(3);
    expect(sectionSize()).toBe(4);
  });

  it("maps Q1–Q4 to the first third", () => {
    // 0-based indices 0..3 -> section 0
    for (let i = 0; i <= 3; i++) {
      expect(sectionOf(i)).toBe(0);
      expect(SECTION_LABELS[sectionOf(i)]).toBe("First third");
    }
  });

  it("maps Q5–Q8 to the second third", () => {
    // 0-based indices 4..7 -> section 1
    for (let i = 4; i <= 7; i++) {
      expect(sectionOf(i)).toBe(1);
      expect(SECTION_LABELS[sectionOf(i)]).toBe("Second third");
    }
  });

  it("maps Q9–Q12 to the final third", () => {
    // 0-based indices 8..11 -> section 2
    for (let i = 8; i <= 11; i++) {
      expect(sectionOf(i)).toBe(2);
      expect(SECTION_LABELS[sectionOf(i)]).toBe("Final third");
    }
  });
});

describe("answered count / progress indicator", () => {
  it("reports 0 when nothing is answered", () => {
    const answers = Array(QUIZ_QUESTIONS.length).fill(-1);
    expect(countAnswered(answers)).toBe(0);
  });

  it("counts only answered questions (option index >= 0)", () => {
    const answers = Array(QUIZ_QUESTIONS.length).fill(-1);
    answers[0] = 1; // answered
    answers[5] = 0; // answered (index 0 is a valid option)
    answers[11] = 3; // answered
    expect(countAnswered(answers)).toBe(3);
  });

  it("updates to 12/12 when every question is answered", () => {
    const answers = QUIZ_QUESTIONS.map(() => 0);
    expect(countAnswered(answers)).toBe(12);
    expect(countAnswered(answers)).toBe(QUIZ_QUESTIONS.length);
  });
});
