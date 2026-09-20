import { Difficulty } from "@/backend";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { FlashcardDeck } from "@/components/study/FlashcardDeck";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequireAuth } from "@/hooks/useAuth";
import { errorMessage } from "@/lib/api";
import {
  useFlashcards,
  useGenerateFlashcards,
  useNotebooks,
  useReviewFlashcard,
} from "@/lib/queries";
import { Route as rootRoute } from "@/routes/__root";
import { Link, createRoute } from "@tanstack/react-router";
import { Layers, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flashcards",
  component: FlashcardsPage,
});

const DIFFICULTIES = [
  { value: Difficulty.beginner, label: "Beginner" },
  { value: Difficulty.intermediate, label: "Intermediate" },
  { value: Difficulty.advanced, label: "Advanced" },
  { value: Difficulty.exam, label: "Exam level" },
] as const;

const COUNTS = ["5", "10", "15", "20"] as const;

function FlashcardsPage() {
  const authenticated = useRequireAuth();
  const { data: notebooks = [] } = useNotebooks();
  const [selectedNotebook, setSelectedNotebook] = useState<string | undefined>(
    undefined,
  );
  const activeNotebookId =
    selectedNotebook ?? notebooks[0]?.notebook.id.toString();

  const {
    data: cards = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFlashcards(activeNotebookId);
  const generate = useGenerateFlashcards();
  const review = useReviewFlashcard();

  const [difficulty, setDifficulty] = useState<string>(Difficulty.intermediate);
  const [count, setCount] = useState<string>("10");

  const handleGenerate = () => {
    if (!activeNotebookId) return;
    generate.mutate(
      {
        notebookId: BigInt(activeNotebookId),
        difficulty: difficulty as Difficulty,
        count: BigInt(count),
      },
      {
        onSuccess: () => toast.success("Flashcards generated"),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleReview = (cardId: string, known: boolean) => {
    if (!activeNotebookId) return;
    review.mutate(
      { id: cardId, notebookId: activeNotebookId, known },
      {
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  if (!authenticated) {
    return <LoadingSkeleton variant="detail" />;
  }

  return (
    <div className="space-y-8" data-ocid="flashcards.page">
      <PageHeader
        eyebrow="Flashcards"
        title="Spaced review"
        description="Drill the facts and definitions you need to recall, and track what you already know."
      />

      {notebooks.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <Label
            htmlFor="flashcards-notebook"
            className="text-sm text-muted-foreground"
          >
            Notebook
          </Label>
          <Select
            value={activeNotebookId}
            onValueChange={(value) => setSelectedNotebook(value)}
          >
            <SelectTrigger
              id="flashcards-notebook"
              className="w-full sm:w-72"
              data-ocid="flashcards.notebook_select"
            >
              <SelectValue placeholder="Select a notebook" />
            </SelectTrigger>
            <SelectContent>
              {notebooks.map((item) => (
                <SelectItem
                  key={item.notebook.id.toString()}
                  value={item.notebook.id.toString()}
                >
                  {item.notebook.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {isError ? (
        <ErrorState
          message={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : null}

      {notebooks.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Create a notebook first"
          description="Flashcards are generated from a notebook's sources. Create one to get started."
          action={
            <Button asChild className="rounded-full">
              <Link
                to="/notebooks"
                data-ocid="flashcards.create_notebook_button"
              >
                Create a notebook
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-subtle sm:flex-row sm:items-end sm:justify-between">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="flashcard-difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger
                    id="flashcard-difficulty"
                    data-ocid="flashcards.difficulty_select"
                  >
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="flashcard-count">Number of cards</Label>
                <Select value={count} onValueChange={setCount}>
                  <SelectTrigger
                    id="flashcard-count"
                    data-ocid="flashcards.count_select"
                  >
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option} cards
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generate.isPending}
              data-ocid="flashcards.generate_button"
              className="w-full rounded-full sm:w-auto"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              {generate.isPending ? "Generating…" : "Generate cards"}
            </Button>
          </div>

          {isLoading ? (
            <LoadingSkeleton variant="cards" count={3} />
          ) : cards.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No flashcards yet"
              description="Generate review cards from your sources and start drilling the material."
            />
          ) : (
            <FlashcardDeck
              cards={cards}
              isReviewing={review.isPending}
              onReview={handleReview}
            />
          )}
        </>
      )}
    </div>
  );
}
