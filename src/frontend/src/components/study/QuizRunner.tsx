import { QuestionKind } from "@/backend";
import type { Quiz, QuizAnswer, QuizQuestionView } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface QuizRunnerProps {
  quiz: Quiz;
  questions: QuizQuestionView[];
  isSubmitting: boolean;
  onSubmit: (answers: QuizAnswer[]) => void;
  onExit: () => void;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Touch-friendly quiz runner. Presents one question at a time with a progress
 * bar, supports MCQ, true/false and short-answer formats, and submits the
 * collected answers for grading.
 */
export function QuizRunner({
  quiz,
  questions,
  isSubmitting,
  onSubmit,
  onExit,
  className,
  "data-ocid": dataOcid,
}: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});

  const total = questions.length;
  const question = questions[Math.min(index, Math.max(total - 1, 0))];
  const answeredCount = Object.keys(answers).length;
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;

  if (!question) return null;

  const questionId = question.id.toString();
  const selected = answers[questionId];
  const isLast = index === total - 1;

  const selectOption = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    const payload: QuizAnswer[] = questions
      .filter((item) => answers[item.id.toString()] !== undefined)
      .map((item) => ({
        questionId: item.id,
        selectedIndex: BigInt(answers[item.id.toString()]),
      }));
    onSubmit(payload);
  };

  return (
    <div
      data-ocid={dataOcid ?? "quizzes.runner"}
      className={cn("mx-auto w-full max-w-3xl space-y-6", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
            Quiz in progress
          </p>
          <h1 className="truncate font-display text-xl font-semibold text-foreground">
            {quiz.title}
          </h1>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onExit}
          data-ocid="quizzes.exit_button"
          className="rounded-full"
        >
          Exit quiz
        </Button>
      </div>

      <div className="space-y-2">
        <Progress
          value={progress}
          className="h-1.5"
          data-ocid="quizzes.progress"
        />
        <p
          data-ocid="quizzes.progress_label"
          className="font-mono text-xs text-muted-foreground"
        >
          Question {index + 1} of {total} · {answeredCount} answered
        </p>
      </div>

      <motion.div
        key={questionId}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="shadow-subtle">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-base font-medium leading-relaxed text-foreground">
                  {question.prompt}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {question.topic}
                </p>
              </div>
            </div>

            {question.kind === QuestionKind.shortAnswer ? (
              <div className="space-y-2 pl-10">
                <label
                  htmlFor="quiz-short-answer"
                  className="text-sm text-muted-foreground"
                >
                  Your answer
                </label>
                <Input
                  id="quiz-short-answer"
                  value={textAnswers[questionId] ?? ""}
                  onChange={(event) =>
                    setTextAnswers((prev) => ({
                      ...prev,
                      [questionId]: event.target.value,
                    }))
                  }
                  placeholder="Type a short answer"
                  data-ocid="quizzes.short_answer_input"
                />
              </div>
            ) : (
              <div className="space-y-2 pl-10">
                {question.options.map((option, optionIndex) => {
                  const active = selected === optionIndex;
                  return (
                    <button
                      key={`${questionId}-${option}`}
                      type="button"
                      onClick={() => selectOption(optionIndex)}
                      aria-pressed={active}
                      data-ocid={`quizzes.option_button.${optionIndex + 1}`}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-smooth focus-ring",
                        active
                          ? "border-primary bg-secondary text-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-secondary/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border",
                        )}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="min-w-0">{option}</span>
                      {active ? (
                        <Check
                          className="ml-auto size-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
          disabled={index === 0}
          data-ocid="quizzes.prev_button"
          className="rounded-full"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </Button>

        {isLast ? (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount === 0}
            data-ocid="quizzes.submit_answers_button"
            className="rounded-full"
          >
            <Send className="size-4" aria-hidden="true" />
            {isSubmitting ? "Grading…" : "Submit answers"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setIndex((prev) => Math.min(prev + 1, total - 1))}
            data-ocid="quizzes.next_button"
            className="rounded-full"
          >
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
