import { PageHeader } from "@/components/common/PageHeader";
import { LibraryBrowser } from "@/components/library/LibraryBrowser";
import { SearchInput } from "@/components/search/SearchInput";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/useAuth";
import { errorMessage } from "@/lib/api";
import { useSeedDemoData } from "@/lib/queries";
import { Route as rootRoute } from "@/routes/__root";
import { Link, createRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  component: LibraryPage,
});

function LibraryPage() {
  const authenticated = useRequireAuth();
  const seedDemo = useSeedDemoData();
  const [query, setQuery] = useState("");

  if (!authenticated) {
    return <LibrarySkeleton />;
  }

  const handleSeed = () => {
    seedDemo.mutate(undefined, {
      onSuccess: () => toast.success("Demo notebook is ready"),
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  return (
    <div className="space-y-8" data-ocid="library.page">
      <PageHeader
        eyebrow="Library"
        title="Your knowledge library"
        description="Every notebook you own, with the sources, notes, flashcards and quizzes inside it. Filter by type or notebook, then open any item."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleSeed}
              disabled={seedDemo.isPending}
              className="rounded-full"
              data-ocid="library.seed_button"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              {seedDemo.isPending ? "Preparing…" : "Load demo notebook"}
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/notebooks" data-ocid="library.new_notebook_button">
                New notebook
              </Link>
            </Button>
          </>
        }
      />

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Filter your library by title, notebook or content…"
        className="max-w-2xl"
        data-ocid="library.search_input"
      />

      <LibraryBrowser
        query={query}
        onQueryChange={setQuery}
        data-ocid="library.browser"
      />
    </div>
  );
}

function LibrarySkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse-soft rounded bg-muted" />
        <div className="h-8 w-72 animate-pulse-soft rounded bg-muted" />
        <div className="h-4 w-full max-w-xl animate-pulse-soft rounded bg-muted" />
      </div>
      <div className="h-12 w-full max-w-2xl animate-pulse-soft rounded-lg bg-muted" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => `library-skeleton-${i}`).map(
          (id) => (
            <div
              key={id}
              className="h-52 animate-pulse-soft rounded-lg border border-border bg-card"
            />
          ),
        )}
      </div>
    </div>
  );
}
