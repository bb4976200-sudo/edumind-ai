import type { Flashcard } from "@/backend";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FlashcardDeck } from "@/components/study/FlashcardDeck";

function card(id: bigint, front: string, back: string): Flashcard {
  return {
    id,
    front,
    back,
    owner: undefined as never,
    createdAt: 0n,
    reviewCount: 0n,
    knownCount: 0n,
    notebookId: 1n,
  };
}

const CARDS: Flashcard[] = [
  card(1n, "What is monetary policy?", "Central bank management."),
  card(2n, "What is the repo rate?", "The RBI lending rate."),
];

describe("FlashcardDeck", () => {
  it("reports Know and Review Again outcomes to the caller", async () => {
    const user = userEvent.setup();
    const onReview = vi.fn();
    render(
      <FlashcardDeck cards={CARDS} isReviewing={false} onReview={onReview} />,
    );

    expect(screen.getByText("Card 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("What is monetary policy?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /I know this/i }));
    expect(onReview).toHaveBeenCalledWith("1", true);
    expect(screen.getByText("Card 2 of 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Review again/i }));
    expect(onReview).toHaveBeenCalledWith("2", false);
  });

  it("reveals the answer when the card is flipped", async () => {
    const user = userEvent.setup();
    render(
      <FlashcardDeck cards={CARDS} isReviewing={false} onReview={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: /Reveal answer/i }));
    expect(screen.getByText("Central bank management.")).toBeInTheDocument();
  });
});
