import type { QuizResult } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, RotateCcw, X } from "lucide-react";
import { motion } from "motion/react";

interface QuizResultsProps {
  result: QuizResult;
  onRetake: () => void;
  onExit: () => void;
  className?: string;
  "data-ocid"?: string;
}

/** Score summary, weak topics, recommended revision and per-question review. */
export function QuizResults({
  result,
  onRetake,
  onExit,
  className,
  "data-ocid": dataOcid,
}: QuizResultsProps) {
  const score = Number(result.score);
  const correct = Number(result.correctCount);
  const wrong = Number(result.wrongCount);
  const total = Number(result.total);

  return (
    <div
      data-ocid={dataOcid ?? "quizzes.results"}
      className={cn("mx-auto w-full max-w-3xl space-y-6", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="shadow-elevated">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  Quiz result
                </p>
                <p
                  data-ocid="quizzes.score_value"
                  className="mt-1 font-display text-4xl font-semibold text-foreground"
                >
                  {score}%
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Check className="size-3" aria-hidden="true" />
                  {correct} correct
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <X className="size-3" aria-hidden="true" />
                  {wrong} incorrect
                </Badge>
                <Badge variant="outline">{total} questions</Badge>
              </div>
            </div>
            <Progress
              value={score}
              className="h-2"
              data-ocid="quizzes.score_progress"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                onClick={onRetake}
                data-ocid="quizzes.retake_button"
                className="rounded-full"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Retake quiz
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onExit}
                data-ocid="quizzes.exit_button"
                className="rounded-full"
              >
                Back to quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {result.weakTopics.length > 0 ? (
        <Card className="shadow-subtle" data-ocid="quizzes.weak_topics">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">
              Weak topics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.weakTopics.map((topic) => (
              <Badge key={topic} variant="secondary">
                {topic}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {result.recommendedRevision.length > 0 ? (
        <Card
          className="shadow-subtle"
          data-ocid="quizzes.recommended_revision"
        >
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">
              Recommended revision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendedRevision.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <section aria-labelledby="answer-review-heading" className="space-y-4">
        <h2
          id="answer-review-heading"
          className="font-display text-lg font-semibold text-foreground"
        >
          Answer review
        </h2>
        <ul className="space-y-3" data-ocid="quizzes.answer_review">
          {result.items.map((item, index) => (
            <li
              key={item.questionId.toString()}
              data-ocid={`quizzes.result_item.${index + 1}`}
              className="rounded-lg border border-border bg-card p-5 shadow-subtle"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                    item.correct
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive",
                  )}
                >
                  {item.correct ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : (
                    <X className="size-3.5" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.prompt}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {item.topic}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      variant={item.correct ? "secondary" : "outline"}
                      className="text-[11px]"
                    >
                      Your answer:{" "}
                      {String.fromCharCode(65 + Number(item.selectedIndex))}
                    </Badge>
                    {item.correct ? null : (
                      <Badge variant="secondary" className="text-[11px]">
                        Correct:{" "}
                        {String.fromCharCode(65 + Number(item.correctIndex))}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.explanation}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
