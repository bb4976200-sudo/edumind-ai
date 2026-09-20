import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StudyMaterialPanel } from "@/components/workspace/StudyMaterialPanel";

vi.mock("@/lib/queries", () => ({
  useGenerateNote: () => ({ mutate: vi.fn(), isPending: false }),
  useGenerateFlashcards: () => ({ mutate: vi.fn(), isPending: false }),
  useGenerateQuiz: () => ({ mutate: vi.fn(), isPending: false }),
}));

describe("StudyMaterialPanel", () => {
  it("renders the four working generators", () => {
    render(<StudyMaterialPanel notebookId="1" />);
    expect(
      screen.getByRole("button", { name: /Summary/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Detailed Notes/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Flashcards/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /MCQ Quiz/i }),
    ).toBeInTheDocument();
  });

  it("shows every deferred generator as disabled with a Coming soon label", () => {
    render(<StudyMaterialPanel notebookId="1" />);
    for (const id of ["revision-sheet", "mind-map", "important-questions"]) {
      const node = document.querySelector(
        `[data-ocid="study_material.${id}_disabled"]`,
      );
      expect(node).not.toBeNull();
      expect(node).toHaveAttribute("aria-disabled", "true");
      expect(node?.textContent).toContain("Coming soon");
    }
  });
});
