import { QuestionKind } from "@/backend";
import type { Quiz, QuizQuestionView, QuizResult } from "@/backend";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { QuizResults } from "@/components/study/QuizResults";
import { QuizRunner } from "@/components/study/QuizRunner";

const QUIZ: Quiz = {
  id: 1n,
  title: "Indian Economy — Practice Quiz",
  owner: undefined as never,
  difficulty: undefined as never,
  createdAt: 0n,
  notebookId: 1n,
};

const QUESTIONS: QuizQuestionView[] = [
  {
    id: 10n,
    topic: "Monetary Policy",
    kind: QuestionKind.mcq,
    prompt: "What inflation target does the RBI aim for?",
    options: ["2 percent", "4 percent with a 2 percent band"],
  },
  {
    id: 11n,
    topic: "Inflation",
    kind: QuestionKind.mcq,
    prompt: "Demand-pull inflation occurs when:",
    options: ["Input costs rise", "Aggregate demand exceeds supply"],
  },
];

describe("QuizRunner", () => {
  it("collects answers and submits them for grading", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <QuizRunner
        quiz={QUIZ}
        questions={QUESTIONS}
        isSubmitting={false}
        onSubmit={onSubmit}
        onExit={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Question 1 of 2 · 0 answered"),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /4 percent with a 2 percent band/i }),
    );
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(
      screen.getByRole("button", { name: /Aggregate demand exceeds supply/i }),
    );
    await user.click(screen.getByRole("button", { name: /Submit answers/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith([
      { questionId: 10n, selectedIndex: 1n },
      { questionId: 11n, selectedIndex: 1n },
    ]);
  });
});

describe("QuizResults", () => {
  const RESULT: QuizResult = {
    quizId: 1n,
    score: 50n,
    correctCount: 1n,
    wrongCount: 1n,
    total: 2n,
    weakTopics: ["Inflation"],
    recommendedRevision: ["Revise Chapter 3"],
    items: [
      {
        questionId: 10n,
        prompt: "What inflation target does the RBI aim for?",
        topic: "Monetary Policy",
        correct: true,
        correctIndex: 1n,
        selectedIndex: 1n,
        explanation: "The RBI targets 4 percent with a band.",
      },
      {
        questionId: 11n,
        prompt: "Demand-pull inflation occurs when:",
        topic: "Inflation",
        correct: false,
        correctIndex: 1n,
        selectedIndex: 0n,
        explanation: "Aggregate demand exceeds supply.",
      },
    ],
  };

  it("shows score, weak topics, explanations and per-answer review", () => {
    render(<QuizResults result={RESULT} onRetake={vi.fn()} onExit={vi.fn()} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("1 correct")).toBeInTheDocument();
    expect(screen.getByText("1 incorrect")).toBeInTheDocument();
    expect(screen.getByText("Weak topics")).toBeInTheDocument();
    expect(screen.getAllByText("Inflation").length).toBeGreaterThan(0);
    expect(
      screen.getByText("The RBI targets 4 percent with a band."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Aggregate demand exceeds supply."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Correct: B/)).toBeInTheDocument();
  });
});
