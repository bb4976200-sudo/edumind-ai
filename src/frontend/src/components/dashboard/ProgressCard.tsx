import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { NotebookSummary } from "@/types/view";
import { formatRelative } from "@/types/view";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Layers,
  ListChecks,
  NotebookPen,
  TrendingUp,
} from "lucide-react";

interface ProgressCardProps {
  notebooks: NotebookSummary[];
  isLoading: boolean;
}

interface Signal {
  label: string;
  value: number;
  icon: typeof BookOpen;
}

/**
 * Dashboard card showing per-notebook completion signals: sources processed,
 * notes generated, quizzes taken and flashcards known.
 */
export function ProgressCard({ notebooks, isLoading }: ProgressCardProps) {
  const totals = notebooks.reduce(
    (acc, item) => ({
      sources: acc.sources + Number(item.sourceCount),
      notes: acc.notes + Number(item.noteCount),
      quizzes: acc.quizzes + Number(item.quizCount),
      flashcards: acc.flashcards + Number(item.flashcardCount),
    }),
    { sources: 0, notes: 0, quizzes: 0, flashcards: 0 },
  );

  const signals: Signal[] = [
    { label: "Sources processed", value: totals.sources, icon: BookOpen },
    { label: "Notes generated", value: totals.notes, icon: NotebookPen },
    { label: "Quizzes taken", value: totals.quizzes, icon: ListChecks },
    { label: "Flashcards known", value: totals.flashcards, icon: Layers },
  ];

  const maxValue = Math.max(...signals.map((signal) => signal.value), 1);
  const hasActivity = signals.some((signal) => signal.value > 0);

  return (
    <Card data-ocid="dashboard.progress.card" className="shadow-subtle">
      <CardHeader>
        <CardTitle className="font-display text-base">Study Progress</CardTitle>
        <CardDescription>
          Completion signals across every notebook you own.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <LoadingSkeleton variant="list" count={4} />
        ) : notebooks.length === 0 || !hasActivity ? (
          <EmptyState
            icon={TrendingUp}
            title="No progress yet"
            description="Add sources and generate study material — your progress signals will build up here."
            action={
              <Button asChild className="rounded-full">
                <Link to="/notebooks" data-ocid="dashboard.progress.empty_link">
                  Go to notebooks
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-5">
            <dl
              data-ocid="dashboard.progress.signals"
              className="grid grid-cols-2 gap-4"
            >
              {signals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div
                    key={signal.label}
                    className="rounded-lg border border-border bg-background/60 p-4"
                  >
                    <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      {signal.label}
                    </dt>
                    <dd className="mt-2 font-display text-2xl font-semibold text-foreground">
                      {signal.value}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="space-y-3 border-t border-border pt-5">
              <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Per notebook
              </p>
              <ul data-ocid="dashboard.progress.list" className="space-y-3">
                {notebooks.map((item, index) => {
                  const activity =
                    Number(item.sourceCount) +
                    Number(item.noteCount) +
                    Number(item.quizCount) +
                    Number(item.flashcardCount);
                  const percent = Math.round((activity / maxValue) * 100);
                  return (
                    <li
                      key={item.notebook.id.toString()}
                      data-ocid={`dashboard.progress.item.${index + 1}`}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          to="/notebooks/$notebookId"
                          params={{
                            notebookId: item.notebook.id.toString(),
                          }}
                          className="min-w-0 truncate text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline focus-ring"
                        >
                          {item.notebook.title}
                        </Link>
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                          {formatRelative(item.notebook.updatedAt)}
                        </span>
                      </div>
                      <Progress
                        value={percent}
                        aria-label={`${item.notebook.title} activity`}
                      />
                      <p className="text-xs text-muted-foreground">
                        {Number(item.sourceCount)} sources ·{" "}
                        {Number(item.noteCount)} notes ·{" "}
                        {Number(item.quizCount)} quizzes ·{" "}
                        {Number(item.flashcardCount)} cards
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
