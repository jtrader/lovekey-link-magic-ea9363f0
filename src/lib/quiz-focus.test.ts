import { describe, it, expect } from "vitest";
import {
  QUIZ_QUESTIONS,
  SECTION_LABELS,
  nextIndex,
  prevIndex,
  focusTargetFor,
  announcementFor,
  sectionOf,
} from "./quiz-data";

const TOTAL = QUIZ_QUESTIONS.length; // 12
const unanswered = () => Array(TOTAL).fill(-1);

describe("focus target on Previous/Next navigation", () => {
  it("focuses the question heading when the target question is unanswered", () => {
    const answers = unanswered();
    // Next from Q1 -> Q2 (index 1), unanswered
    const target = focusTargetFor(nextIndex(0), answers);
    expect(target).toEqual({ kind: "heading", qIndex: 1 });
  });

  it("focuses the selected option when the target question is answered", () => {
    const answers = unanswered();
    answers[1] = 2; // Q2 answered with option C
    const target = focusTargetFor(nextIndex(0), answers);
    expect(target).toEqual({ kind: "option", qIndex: 1, optIndex: 2 });
  });

  it("focuses the selected option when navigating backward to an answered question", () => {
    const answers = unanswered();
    answers[0] = 0; // Q1 answered with option A
    const target = focusTargetFor(prevIndex(1), answers);
    expect(target).toEqual({ kind: "option", qIndex: 0, optIndex: 0 });
  });

  it("treats option index 0 as answered (not a missing answer)", () => {
    const answers = unanswered();
    answers[4] = 0;
    expect(focusTargetFor(4, answers)).toEqual({
      kind: "option",
      qIndex: 4,
      optIndex: 0,
    });
  });

  it("clamps the active index before choosing a focus target", () => {
    const answers = unanswered();
    expect(focusTargetFor(99, answers)).toEqual({
      kind: "heading",
      qIndex: TOTAL - 1,
    });
    expect(focusTargetFor(-3, answers)).toEqual({ kind: "heading", qIndex: 0 });
  });
});

describe("live region announcement text", () => {
  it("announces the exact question text, number, and third", () => {
    for (let i = 0; i < TOTAL; i++) {
      const label = SECTION_LABELS[sectionOf(i)].toLowerCase();
      const expected = `Question ${i + 1} of ${TOTAL}, ${label}. ${QUIZ_QUESTIONS[i].question}`;
      expect(announcementFor(i)).toBe(expected);
    }
  });

  it("announces the right third at each section boundary", () => {
    expect(announcementFor(3)).toContain("first third.");
    expect(announcementFor(4)).toContain("second third.");
    expect(announcementFor(7)).toContain("second third.");
    expect(announcementFor(8)).toContain("final third.");
  });

  it("announces Q11 and Q12 (the added questions) correctly", () => {
    expect(announcementFor(10)).toBe(
      `Question 11 of ${TOTAL}, final third. ${QUIZ_QUESTIONS[10].question}`,
    );
    expect(announcementFor(11)).toBe(
      `Question 12 of ${TOTAL}, final third. ${QUIZ_QUESTIONS[11].question}`,
    );
  });

  it("clamps out-of-range indices when announcing", () => {
    expect(announcementFor(99)).toBe(announcementFor(TOTAL - 1));
    expect(announcementFor(-1)).toBe(announcementFor(0));
  });
});
