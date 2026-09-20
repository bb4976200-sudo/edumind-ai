import { Badge } from "@/components/ui/badge";
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
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** The library entity types a visitor can filter the unified view by. */
export type LibraryType =
  | "all"
  | "notebook"
  | "source"
  | "note"
  | "flashcard"
  | "quiz";

export interface LibraryTypeOption {
  value: LibraryType;
  label: string;
  icon: LucideIcon;
}

interface LibraryFiltersProps {
  types: LibraryTypeOption[];
  activeType: LibraryType;
  onTypeChange: (type: LibraryType) => void;
  notebooks: { id: string; title: string }[];
  activeNotebookId: string;
  onNotebookChange: (notebookId: string) => void;
  counts: Record<LibraryType, number>;
  onReset: () => void;
  "data-ocid"?: string;
}

const ALL_NOTEBOOKS = "all";

/**
 * Type tabs plus a notebook scope select for the unified library browser.
 * Purely presentational — the browser owns the filter state.
 */
export function LibraryFilters({
  types,
  activeType,
  onTypeChange,
  notebooks,
  activeNotebookId,
  onNotebookChange,
  counts,
  onReset,
  "data-ocid": dataOcid,
}: LibraryFiltersProps) {
  const filtered = activeType !== "all" || activeNotebookId !== ALL_NOTEBOOKS;

  return (
    <div
      data-ocid={dataOcid ?? "library.filters"}
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-subtle lg:flex-row lg:items-center lg:justify-between"
    >
      <div
        role="tablist"
        aria-label="Filter library by type"
        className="flex flex-wrap items-center gap-1.5"
      >
        {types.map((option) => {
          const Icon = option.icon;
          const active = option.value === activeType;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTypeChange(option.value)}
              data-ocid={`library.filter.tab.${option.value}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-smooth focus-ring",
                active
                  ? "border-primary/40 bg-secondary text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {option.label}
              <Badge
                variant="secondary"
                className="font-mono text-[10px] text-muted-foreground"
              >
                {counts[option.value] ?? 0}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Label
          htmlFor="library-notebook-filter"
          className="text-sm text-muted-foreground"
        >
          Notebook
        </Label>
        <Select value={activeNotebookId} onValueChange={onNotebookChange}>
          <SelectTrigger
            id="library-notebook-filter"
            className="w-full sm:w-64"
            data-ocid="library.notebook_select"
          >
            <SelectValue placeholder="All notebooks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_NOTEBOOKS}>All notebooks</SelectItem>
            {notebooks.map((notebook) => (
              <SelectItem key={notebook.id} value={notebook.id}>
                {notebook.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filtered ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="rounded-full text-muted-foreground"
            data-ocid="library.reset_filters_button"
          >
            <X className="size-4" aria-hidden="true" />
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export { ALL_NOTEBOOKS };
