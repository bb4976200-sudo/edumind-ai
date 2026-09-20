import type { Flashcard } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { FlashcardActions, FlashcardCard } from "./FlashcardCard";

interface FlashcardDeckProps {
  cards: Flashcard[];
  isReviewing: boolean;
  onReview: (cardId: string, known: boolean) => void;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Swipeable flashcard deck. Tracks the active card, flip state and review
 * progress, and advances automatically after each review.
 */
export function FlashcardDeck({
  cards,
  isReviewing,
  onReview,
  className,
  "data-ocid": dataOcid,
}: FlashcardDeckProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [reviewed, setReviewed] = useState(0);

  const total = cards.length;
  const current = cards[Math.min(index, Math.max(total - 1, 0))];
  const progress = total > 0 ? (reviewed / total) * 100 : 0;

  const goTo = (next: number) => {
    if (total === 0) return;
    setFlipped(false);
    setIndex(((next % total) + total) % total);
  };

  const handleReview = (isKnown: boolean) => {
    if (!current) return;
    onReview(current.id.toString(), isKnown);
    setReviewed((prev) => Math.min(prev + 1, total));
    if (isKnown) setKnown((prev) => prev + 1);
    goTo(index + 1);
  };

  if (!current) return null;

  return (
    <div
      data-ocid={dataOcid ?? "flashcards.deck"}
      className={cn("mx-auto w-full max-w-2xl space-y-5", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          data-ocid="flashcards.progress_label"
          className="font-mono text-xs text-muted-foreground"
        >
          Card {index + 1} of {total}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{known} known</Badge>
          <Badge variant="outline">{reviewed} reviewed</Badge>
        </div>
      </div>

      <Progress
        value={progress}
        className="h-1.5"
        data-ocid="flashcards.progress"
      />

      <motion.div
        key={current.id.toString()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_event, info) => {
          if (info.offset.x < -90) handleReview(false);
          else if (info.offset.x > 90) handleReview(true);
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="cursor-grab active:cursor-grabbing"
      >
        <FlashcardCard
          card={current}
          flipped={flipped}
          onFlip={() => setFlipped((prev) => !prev)}
        />
      </motion.div>

      <FlashcardActions disabled={isReviewing} onReview={handleReview} />

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goTo(index - 1)}
          data-ocid="flashcards.prev_button"
          className="rounded-full"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </Button>
        <span className="font-mono text-[11px] text-muted-foreground">
          Swipe or use the buttons
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goTo(index + 1)}
          data-ocid="flashcards.next_button"
          className="rounded-full"
        >
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
