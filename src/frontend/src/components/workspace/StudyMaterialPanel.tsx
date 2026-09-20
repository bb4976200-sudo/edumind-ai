import {
  Difficulty,
  QuestionKind,
  QuizDifficulty,
  StudyMaterialKind,
} from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { errorMessage } from "@/lib/api";
import {
  useGenerateFlashcards,
  useGenerateNote,
  useGenerateQuiz,
} from "@/lib/queries";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  Layers,
  ListChecks,
  Lock,
  Network,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StudyMaterialPanelProps {
  notebookId: string;
  sourceId?: string;
  chapter?: string;
}

interface GeneratorAction {
  id: string;
  label: string;
  description: string;
  icon: typeof FileText;
  run?: () => void;
  pending?: boolean;
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: Difficulty.beginner, label: "Beginner" },
  { value: Difficulty.intermediate, label: "Intermediate" },
  { value: Difficulty.advanced, label: "Advanced" },
  { value: Difficulty.exam, label: "Exam level" },
];

const COMING_SOON = [
  { id: "revision-sheet", label: "Revision Sheet", icon: NotebookPen },
  { id: "mind-map", label: "Mind Map", icon: Network },
  { id: "important-questions", label: "Important Questions", icon: ListChecks },
];

/** Right column: one-click study material generation for the notebook. */
export function StudyMaterialPanel({
  notebookId,
  sourceId,
  chapter,
}: StudyMaterialPanelProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>(
    Difficulty.intermediate,
  );
  const generateNote = useGenerateNote();
  const generateFlashcards = useGenerateFlashcards();
  const generateQuiz = useGenerateQuiz();

  const busy =
    generateNote.isPending ||
    generateFlashcards.isPending ||
    generateQuiz.isPending;

  const handleNote = (kind: StudyMaterialKind, label: string) => {
    generateNote.mutate(
      { notebookId: BigInt(notebookId), kind, difficulty, chapter },
      {
        onSuccess: () => toast.success(`${label} generated`),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleFlashcards = () => {
    generateFlashcards.mutate(
      { notebookId: BigInt(notebookId), difficulty, count: 12n },
      {
        onSuccess: () => toast.success("Flashcards generated"),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleQuiz = () => {
    generateQuiz.mutate(
      {
        notebookId: BigInt(notebookId),
        difficulty: QuizDifficultyFrom(difficulty),
        count: 10n,
        kinds: [QuestionKindMcq()],
      },
      {
        onSuccess: () => toast.success("Quiz generated"),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const actions: GeneratorAction[] = [
    {
      id: "summary",
      label: "Summary",
      description: "A tight overview of the whole chapter",
      icon: FileText,
      run: () => handleNote(StudyMaterialKind.summary, "Summary"),
      pending: generateNote.isPending,
    },
    {
      id: "detailed-notes",
      label: "Detailed Notes",
      description: "Structured notes with headings and examples",
      icon: BookOpen,
      run: () => handleNote(StudyMaterialKind.detailedNotes, "Detailed notes"),
      pending: generateNote.isPending,
    },
    {
      id: "flashcards",
      label: "Flashcards",
      description: "Review cards for active recall",
      icon: Layers,
      run: handleFlashcards,
      pending: generateFlashcards.isPending,
    },
    {
      id: "mcq-quiz",
      label: "MCQ Quiz",
      description: "Practice questions with explanations",
      icon: ListChecks,
      run: handleQuiz,
      pending: generateQuiz.isPending,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-sm font-semibold text-foreground">
            Create Study Material
          </h2>
          <p className="text-xs text-muted-foreground">
            Generated from this notebook's sources
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="study-material-difficulty"
          className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          Difficulty
        </label>
        <Select
          value={difficulty}
          onValueChange={(value) => setDifficulty(value as Difficulty)}
        >
          <SelectTrigger
            id="study-material-difficulty"
            data-ocid="study_material.difficulty_select"
            className="w-full"
          >
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTIES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ul className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <li key={action.id}>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={action.run}
                data-ocid={`study_material.${action.id}_button`}
                className="h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">
                    {action.label}
                  </span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {action.description}
                  </span>
                </span>
              </Button>
            </li>
          );
        })}
      </ul>

      <div className="space-y-2 border-t border-border pt-4">
        <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Coming soon
        </p>
        <ul className="space-y-2">
          {COMING_SOON.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <div
                  data-ocid={`study_material.${item.id}_disabled`}
                  aria-disabled="true"
                  className={cn(
                    "flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2.5",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="block text-xs text-muted-foreground/80">
                      Coming soon
                    </span>
                  </span>
                  <Lock
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {sourceId ? (
        <p className="font-mono text-[10px] text-muted-foreground">
          Scoped to the selected source
        </p>
      ) : null}
    </div>
  );
}

/* Local helpers keep the backend enum values in one place. */
function QuizDifficultyFrom(difficulty: Difficulty) {
  switch (difficulty) {
    case Difficulty.beginner:
      return QuizDifficulty.easy;
    case Difficulty.advanced:
    case Difficulty.exam:
      return QuizDifficulty.hard;
    default:
      return QuizDifficulty.medium;
  }
}

function QuestionKindMcq() {
  return QuestionKind.mcq;
}
