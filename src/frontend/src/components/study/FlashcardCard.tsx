import type { Flashcard } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { motion } from "motion/react";

interface FlashcardCardProps {
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
  className?: string;
  "data-ocid"?: string;
}

/**
 * A single flip card. The front shows the question or concept, the back shows
 * the answer or explanation. Clicking or pressing Enter flips it.
 */
export function FlashcardCard({
  card,
  flipped,
  onFlip,
  className,
  "data-ocid": dataOcid,
}: FlashcardCardProps) {
  return (
    <div
      data-ocid={dataOcid ?? "flashcards.card"}
      className={cn("[perspective:1400px]", className)}
    >
      <motion.button
        type="button"
        onClick={onFlip}
        aria-label={flipped ? "Show question" : "Reveal answer"}
        data-ocid="flashcards.flip_button"
        className="relative block w-full rounded-lg text-left focus-ring"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <span
          className="flex min-h-[16rem] flex-col items-center justify-center gap-5 rounded-lg border border-border bg-card p-8 text-center shadow-elevated sm:min-h-[18rem]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
            Question
          </span>
          <span className="font-display text-lg font-medium leading-relaxed text-foreground sm:text-xl">
            {card.front}
          </span>
          <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Tap to reveal
          </span>
        </span>

        <span
          className="absolute inset-0 flex min-h-[16rem] flex-col items-center justify-center gap-5 rounded-lg border border-primary/40 bg-secondary p-8 text-center shadow-elevated sm:min-h-[18rem]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
            Answer
          </span>
          <span className="font-display text-lg font-medium leading-relaxed text-foreground sm:text-xl">
            {card.back}
          </span>
          <span className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="text-[11px]">
              {Number(card.knownCount)} known
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              {Number(card.reviewCount)} reviews
            </Badge>
          </span>
        </span>
      </motion.button>
    </div>
  );
}

interface FlashcardActionsProps {
  disabled: boolean;
  onReview: (known: boolean) => void;
  className?: string;
}

/** Know / Review-again controls shown beneath the active card. */
export function FlashcardActions({
  disabled,
  onReview,
  className,
}: FlashcardActionsProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3", className)}
      data-ocid="flashcards.actions"
    >
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => onReview(false)}
        data-ocid="flashcards.again_button"
        className="flex-1 rounded-full sm:flex-none"
      >
        Review again
      </Button>
      <Button
        type="button"
        disabled={disabled}
        onClick={() => onReview(true)}
        data-ocid="flashcards.known_button"
        className="flex-1 rounded-full sm:flex-none"
      >
        I know this
      </Button>
    </div>
  );
}
