import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { errorMessage } from "@/lib/api";
import type { SearchHit } from "@/types/view";
import { formatRelative, humanize } from "@/types/view";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Layers,
  ListChecks,
  MessageSquare,
  NotebookPen,
  SearchX,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The result groups the backend `kind` values map onto. These must match the
 * exact strings emitted by `lib/search.mo`: "notebook", "source", "note",
 * "flashcard", "conversation" and "quiz".
 */
export const SEARCH_GROUPS: {
  kind: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { kind: "notebook", label: "Notebooks", icon: NotebookPen },
  { kind: "source", label: "Sources", icon: FileText },
  { kind: "note", label: "Notes", icon: BookOpen },
  { kind: "flashcard", label: "Flashcards", icon: Layers },
  { kind: "conversation", label: "Conversations", icon: MessageSquare },
  { kind: "quiz", label: "Quizzes", icon: ListChecks },
];

interface SearchResultsProps {
  term: string;
  results: SearchHit[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  onClear: () => void;
  recent?: SearchHit[];
  "data-ocid"?: string;
}

/**
 * Grouped global-search results. Renders the empty-query recent list, the
 * no-results suggestion, loading skeletons and the retryable error state.
 */
export function SearchResults({
  term,
  results,
  isLoading,
  isError,
  error,
  onRetry,
  onClear,
  recent = [],
  "data-ocid": dataOcid,
}: SearchResultsProps) {
  const trimmed = term.trim();

  if (isError) {
    return (
      <ErrorState
        message={errorMessage(error)}
        onRetry={onRetry}
        data-ocid="search.error_state"
      />
    );
  }

  if (trimmed.length === 0) {
    return (
      <div data-ocid={dataOcid ?? "search.empty_query_state"}>
        {recent.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Search everything you have studied"
            description="Find a notebook, source, note, flashcard, conversation or quiz across every notebook you own. Start typing above."
          />
        ) : (
          <section
            aria-labelledby="search-recent-heading"
            className="space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id="search-recent-heading"
                className="font-display text-sm font-semibold text-foreground"
              >
                Recent items
              </h2>
              <span className="font-mono text-xs text-muted-foreground">
                {recent.length} items
              </span>
            </div>
            <ul className="space-y-3" data-ocid="search.recent_list">
              {recent.map((hit) => (
                <li key={`recent-${hit.kind}-${hit.id.toString()}`}>
                  <ResultCard hit={hit} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton variant="list" count={4} />;
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No results found"
        description={`Nothing matched "${trimmed}". Try a shorter or broader term, or search for a single keyword.`}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            className="rounded-full"
            data-ocid="search.clear_button"
          >
            Clear search
          </Button>
        }
        data-ocid="search.no_results_state"
      />
    );
  }

  return (
    <div className="space-y-8" data-ocid={dataOcid ?? "search.results"}>
      {SEARCH_GROUPS.map((group) => {
        const hits = results.filter((hit) => hit.kind === group.kind);
        if (hits.length === 0) return null;
        const Icon = group.icon;
        return (
          <section
            key={group.kind}
            aria-labelledby={`search-group-${group.kind}`}
            className="space-y-3"
            data-ocid={`search.group.${group.kind}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <h2
                id={`search-group-${group.kind}`}
                className="font-display text-sm font-semibold text-foreground"
              >
                {group.label}
              </h2>
              <Badge
                variant="secondary"
                className="font-mono text-[10px] text-muted-foreground"
              >
                {hits.length}
              </Badge>
            </div>
            <ul className="space-y-3">
              {hits.map((hit) => (
                <li key={`${hit.kind}-${hit.id.toString()}`}>
                  <ResultCard hit={hit} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ResultCard({ hit }: { hit: SearchHit }) {
  const group = SEARCH_GROUPS.find((item) => item.kind === hit.kind);
  const Icon = group?.icon ?? FileText;

  return (
    <Card className="rounded-lg shadow-subtle transition-smooth hover:shadow-elevated">
      <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-medium text-foreground">
                {hit.title}
              </p>
              <Badge
                variant="outline"
                className="shrink-0 font-mono text-[10px] uppercase tracking-wide"
              >
                {humanize(hit.kind)}
              </Badge>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {hit.snippet}
            </p>
            <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
              Notebook #{hit.notebookId.toString()}
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="shrink-0 self-start rounded-full sm:self-auto"
        >
          <Link
            to="/notebooks/$notebookId"
            params={{ notebookId: hit.notebookId.toString() }}
            data-ocid="search.result_link"
          >
            Open
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/** Format a hit's notebook id for the compact metadata line. */
export function resultMeta(hit: SearchHit): string {
  return `Notebook #${hit.notebookId.toString()}`;
}

/** Relative label for a hit when the caller has a timestamp. */
export function resultTimestamp(timestamp: bigint | undefined): string {
  return formatRelative(timestamp);
}
