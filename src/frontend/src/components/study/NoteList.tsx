import type { Note } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatRelative, humanize } from "@/types/view";
import { FileText, Trash2 } from "lucide-react";

interface NoteListProps {
  notes: Note[];
  activeId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  className?: string;
  "data-ocid"?: string;
}

/** Compact, selectable list of generated notes for the notebook sidebar. */
export function NoteList({
  notes,
  activeId,
  onSelect,
  onDelete,
  isDeleting = false,
  className,
  "data-ocid": dataOcid,
}: NoteListProps) {
  return (
    <ul
      data-ocid={dataOcid ?? "notes.list"}
      className={cn("space-y-2", className)}
    >
      {notes.map((note, index) => {
        const id = note.id.toString();
        const active = id === activeId;
        return (
          <li key={id} data-ocid={`notes.item.${index + 1}`}>
            <Card
              className={cn(
                "shadow-none transition-smooth",
                active
                  ? "border-primary bg-secondary/60"
                  : "hover:bg-secondary/40",
              )}
            >
              <CardHeader className="flex-row items-start gap-3 space-y-0 p-4 pb-2">
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-primary",
                  )}
                >
                  <FileText className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <CardTitle className="line-clamp-2 font-display text-sm font-semibold">
                    {note.title}
                  </CardTitle>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {formatRelative(note.updatedAt)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[11px]">
                    {humanize(note.kind)}
                  </Badge>
                  <Badge variant="outline" className="text-[11px]">
                    {humanize(note.difficulty)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() => onSelect(id)}
                    data-ocid={`notes.open_button.${index + 1}`}
                    className="flex-1 rounded-full"
                  >
                    Open
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${note.title}`}
                    disabled={isDeleting}
                    onClick={() => onDelete(id)}
                    data-ocid={`notes.delete_button.${index + 1}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
