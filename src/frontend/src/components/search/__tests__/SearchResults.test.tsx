import type { SearchHit } from "@/backend";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SearchResults } from "@/components/search/SearchResults";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    to?: string;
  }) => <a href={props.to}>{children}</a>,
}));

function hit(id: bigint, kind: string, title: string): SearchHit {
  return {
    id,
    kind,
    title,
    snippet: `${title} snippet`,
    notebookId: 1n,
  };
}

const RESULTS: SearchHit[] = [
  hit(1n, "source", "Inflation — Concepts and Measurement"),
  hit(2n, "note", "Inflation — Detailed Notes"),
  hit(3n, "flashcard", "What is demand-pull inflation?"),
  hit(4n, "conversation", "Inflation discussion"),
  hit(5n, "quiz", "Inflation practice quiz"),
];

describe("SearchResults", () => {
  it("groups results across sources, notes, flashcards, conversations and quizzes", () => {
    render(
      <SearchResults
        term="inflation"
        results={RESULTS}
        isLoading={false}
        isError={false}
        error={null}
        onRetry={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    for (const kind of [
      "source",
      "note",
      "flashcard",
      "conversation",
      "quiz",
    ]) {
      expect(
        document.querySelector(`[data-ocid="search.group.${kind}"]`),
      ).not.toBeNull();
    }
    expect(screen.getByText("Sources")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Flashcards")).toBeInTheDocument();
    expect(screen.getByText("Conversations")).toBeInTheDocument();
    expect(screen.getByText("Quizzes")).toBeInTheDocument();
  });

  it("shows a no-results state with a clear action", () => {
    render(
      <SearchResults
        term="inflation"
        results={[]}
        isLoading={false}
        isError={false}
        error={null}
        onRetry={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Clear search/i }),
    ).toBeInTheDocument();
  });
});
