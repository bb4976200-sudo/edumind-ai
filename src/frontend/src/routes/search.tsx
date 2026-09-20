import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchResults } from "@/components/search/SearchResults";
import { useRequireAuth } from "@/hooks/useAuth";
import { useNotebooks, useNotes, useSearch, useSources } from "@/lib/queries";
import { Route as rootRoute } from "@/routes/__root";
import type { SearchHit } from "@/types/view";
import { createRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
});

function SearchPage() {
  const authenticated = useRequireAuth();
  const [term, setTerm] = useState("");

  const {
    data: results = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useSearch(term);

  const { data: notebooks = [] } = useNotebooks();
  const { data: sources = [] } = useSources(undefined);
  const { data: notes = [] } = useNotes(undefined);

  const recent = useMemo<SearchHit[]>(() => {
    const notebookTitles = new Map<string, string>();
    for (const item of notebooks) {
      notebookTitles.set(item.notebook.id.toString(), item.notebook.title);
    }

    const sourceHits: SearchHit[] = sources.slice(0, 3).map((item) => ({
      id: item.source.id,
      title: item.source.title,
      kind: "source",
      snippet:
        item.source.status === "ready"
          ? `${Number(item.chunkCount)} indexed chunks ready to study.`
          : "Still processing.",
      notebookId: item.source.notebookId,
    }));

    const noteHits: SearchHit[] = notes.slice(0, 3).map((note) => ({
      id: note.id,
      title: note.title,
      kind: "note",
      snippet: note.content.slice(0, 160),
      notebookId: note.notebookId,
    }));

    const notebookHits: SearchHit[] = notebooks.slice(0, 2).map((item) => ({
      id: item.notebook.id,
      title: item.notebook.title,
      kind: "notebook",
      snippet: item.notebook.description || "Notebook",
      notebookId: item.notebook.id,
    }));

    return [...notebookHits, ...sourceHits, ...noteHits].slice(0, 6);
  }, [notebooks, sources, notes]);

  if (!authenticated) {
    return <SearchSkeleton />;
  }

  return (
    <div className="space-y-8" data-ocid="search.page">
      <PageHeader
        eyebrow="Search"
        title="Global search"
        description="Search your notebooks, sources and generated content. Results are grouped by type and link straight into their detail view."
      />

      <SearchInput
        value={term}
        onChange={setTerm}
        isSearching={isLoading}
        autoFocus
        className="max-w-2xl"
        data-ocid="search.page_input"
      />

      <SearchResults
        term={term}
        results={results}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        onClear={() => setTerm("")}
        recent={recent}
        data-ocid="search.results"
      />
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <div className="h-4 w-20 animate-pulse-soft rounded bg-muted" />
        <div className="h-8 w-56 animate-pulse-soft rounded bg-muted" />
        <div className="h-4 w-full max-w-xl animate-pulse-soft rounded bg-muted" />
      </div>
      <div className="h-12 w-full max-w-2xl animate-pulse-soft rounded-lg bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => `search-skeleton-${i}`).map(
          (id) => (
            <div
              key={id}
              className="h-24 animate-pulse-soft rounded-lg border border-border bg-card"
            />
          ),
        )}
      </div>
    </div>
  );
}
