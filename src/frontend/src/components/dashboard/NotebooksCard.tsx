import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NotebookSummary } from "@/types/view";
import { formatRelative } from "@/types/view";
import { Link } from "@tanstack/react-router";
import { ArrowRight, NotebookPen, Plus } from "lucide-react";

interface NotebooksCardProps {
  notebooks: NotebookSummary[];
  isLoading: boolean;
  onCreateNotebook: () => void;
}

/** Dashboard card listing the user's notebooks with counts and workspace links. */
export function NotebooksCard({
  notebooks,
  isLoading,
  onCreateNotebook,
}: NotebooksCardProps) {
  return (
    <Card data-ocid="dashboard.notebooks.card" className="shadow-subtle">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0">
          <CardTitle className="font-display text-base">My Notebooks</CardTitle>
          <CardDescription>
            Your study workspaces and what each one holds.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCreateNotebook}
          className="shrink-0 rounded-full"
          data-ocid="dashboard.notebooks.create_button"
        >
          <Plus className="size-4" aria-hidden="true" />
          New
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <LoadingSkeleton variant="list" count={3} />
        ) : notebooks.length === 0 ? (
          <EmptyState
            icon={NotebookPen}
            title="No notebooks yet"
            description="Create your first notebook to organise a course, then add its sources."
            action={
              <Button
                type="button"
                onClick={onCreateNotebook}
                className="rounded-full"
                data-ocid="dashboard.notebooks.empty_create_button"
              >
                <Plus className="size-4" aria-hidden="true" />
                Create notebook
              </Button>
            }
          />
        ) : (
          <ul data-ocid="dashboard.notebooks.list" className="space-y-3">
            {notebooks.map((item, index) => (
              <li key={item.notebook.id.toString()}>
                <Link
                  to="/notebooks/$notebookId"
                  params={{ notebookId: item.notebook.id.toString() }}
                  data-ocid={`dashboard.notebooks.item.${index + 1}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-background/60 px-4 py-3.5 transition-smooth hover:border-primary/40 hover:bg-secondary/60 focus-ring"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <NotebookPen className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-foreground">
                      {item.notebook.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.notebook.description || "No description yet."}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary">
                        {Number(item.sourceCount)} sources
                      </Badge>
                      <Badge variant="secondary">
                        {Number(item.noteCount)} notes
                      </Badge>
                      <Badge variant="secondary">
                        {Number(item.flashcardCount)} cards
                      </Badge>
                      <Badge variant="secondary">
                        {Number(item.quizCount)} quizzes
                      </Badge>
                    </div>
                  </div>

                  <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {formatRelative(item.notebook.updatedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      Open
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
