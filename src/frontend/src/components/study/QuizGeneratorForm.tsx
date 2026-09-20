import { QuestionKind, QuizDifficulty } from "@/backend";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useState } from "react";

/** Question counts offered by the quiz generator. */
export const QUIZ_COUNTS = ["5", "10", "20", "50"] as const;

/** Difficulty levels offered by the quiz generator. */
export const QUIZ_DIFFICULTIES = [
  { value: QuizDifficulty.easy, label: "Easy" },
  { value: QuizDifficulty.medium, label: "Medium" },
  { value: QuizDifficulty.hard, label: "Hard" },
] as const;

/** Question formats offered by the quiz generator. */
export const QUIZ_KINDS = [
  { value: QuestionKind.mcq, label: "Multiple choice" },
  { value: QuestionKind.trueFalse, label: "True / False" },
  { value: QuestionKind.shortAnswer, label: "Short answer" },
] as const;

export interface QuizGeneratorValues {
  count: string;
  difficulty: QuizDifficulty;
  kinds: QuestionKind[];
}

interface QuizGeneratorFormProps {
  isPending: boolean;
  onSubmit: (values: QuizGeneratorValues) => void;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Generator form for practice quizzes: question count, difficulty and one or
 * more question formats. Owns its draft state and emits a complete request.
 */
export function QuizGeneratorForm({
  isPending,
  onSubmit,
  className,
  "data-ocid": dataOcid,
}: QuizGeneratorFormProps) {
  const [count, setCount] = useState<string>("10");
  const [difficulty, setDifficulty] = useState<string>(QuizDifficulty.medium);
  const [kinds, setKinds] = useState<QuestionKind[]>([QuestionKind.mcq]);

  const toggleKind = (kind: QuestionKind) => {
    setKinds((prev) => {
      if (prev.includes(kind)) {
        return prev.length === 1 ? prev : prev.filter((item) => item !== kind);
      }
      return [...prev, kind];
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      count,
      difficulty: difficulty as QuizDifficulty,
      kinds,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid={dataOcid ?? "quizzes.generator_form"}
      className={cn(
        "space-y-5 rounded-lg border border-border bg-card p-5 shadow-subtle sm:p-6",
        className,
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quiz-count">Number of questions</Label>
          <Select value={count} onValueChange={setCount}>
            <SelectTrigger id="quiz-count" data-ocid="quizzes.count_select">
              <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
              {QUIZ_COUNTS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option} questions
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quiz-difficulty">Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger
              id="quiz-difficulty"
              data-ocid="quizzes.difficulty_select"
            >
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {QUIZ_DIFFICULTIES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">
          Question types
        </legend>
        <div className="flex flex-wrap gap-2">
          {QUIZ_KINDS.map((option) => {
            const active = kinds.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => toggleKind(option.value)}
                data-ocid={`quizzes.kind_toggle.${option.value}`}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-smooth focus-ring",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary/60",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {kinds.length} {kinds.length === 1 ? "format" : "formats"} selected ·{" "}
          {count} questions
        </p>
        <Button
          type="submit"
          disabled={isPending}
          data-ocid="quizzes.generate_button"
          className="w-full rounded-full sm:w-auto"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {isPending ? "Generating…" : "Generate quiz"}
        </Button>
      </div>
    </form>
  );
}
