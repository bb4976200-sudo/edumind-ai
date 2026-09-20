import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NotebookSummary } from "@/types/view";
import { formatRelative } from "@/types/view";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";

interface NotebookGridProps {
  notebooks: NotebookSummary[];
  onEdit: (notebook: NotebookSummary) => void;
  onDelete: (notebook: NotebookSummary) => void;
}

/** Responsive grid of notebook cards with counts and row actions. */
export function NotebookGrid({
  notebooks,
  onEdit,
  onDelete,
}: NotebookGridProps) {
  return (
    <div
      data-ocid="notebooks.list"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {notebooks.map((item, index) => {
        const id = item.notebook.id.toString();
        return (
          <Card
            key={id}
            data-ocid={`notebooks.item.${index + 1}`}
            className="flex flex-col shadow-subtle transition-smooth hover:shadow-elevated"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="line-clamp-1 min-w-0 font-display text-base">
                  {item.notebook.title}
                </CardTitle>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${item.notebook.title}`}
                    onClick={() => onEdit(item)}
                    data-ocid={`notebooks.edit_button.${index + 1}`}
                    className="size-8 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${item.notebook.title}`}
                    onClick={() => onDelete(item)}
                    data-ocid={`notebooks.delete_button.${index + 1}`}
                    className="size-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
                {item.notebook.description || "No description yet."}
              </p>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="flex flex-wrap gap-2">
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
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="font-mono text-xs text-muted-foreground">
                  {formatRelative(item.notebook.updatedAt)}
                </span>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <Link
                    to="/notebooks/$notebookId"
                    params={{ notebookId: id }}
                    data-ocid={`notebooks.open_link.${index + 1}`}
                  >
                    Open
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
