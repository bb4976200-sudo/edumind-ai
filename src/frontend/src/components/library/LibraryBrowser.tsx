import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import {
  ALL_NOTEBOOKS,
  LibraryFilters,
  type LibraryType,
  type LibraryTypeOption,
} from "@/components/library/LibraryFilters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { errorMessage } from "@/lib/api";
import {
  useFlashcards,
  useNotebooks,
  useNotes,
  useQuizzes,
  useSources,
} from "@/lib/queries";
import { formatRelative, humanize } from "@/types/view";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Layers,
  Library,
  ListChecks,
  NotebookPen,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

const TYPE_OPTIONS: LibraryTypeOption[] = [
  { value: "all", label: "All", icon: Library },
  { value: "notebook", label: "Notebooks", icon: NotebookPen },
  { value: "source", label: "Sources", icon: FileText },
  { value: "note", label: "Notes", icon: BookOpen },
  { value: "flashcard", label: "Flashcards", icon: Layers },
  { value: "quiz", label: "Quizzes", icon: ListChecks },
];

interface LibraryEntry {
  key: string;
  type: Exclude<LibraryType, "all">;
  title: string;
  description: string;
  meta: string;
  notebookId: string;
  notebookTitle: string;
  updatedAt: bigint | undefined;
  to: "/notebooks/$notebookId" | "/notes" | "/flashcards" | "/quizzes";
  search?: { notebookId?: string; quizId?: string };
}

interface LibraryBrowserProps {
  query: string;
  onQueryChange: (query: string) => void;
  "data-ocid"?: string;
}

/**
 * Unified, filterable view over every notebook and the material inside it.
 * Each entry links into its own detail surface.
 */
export function LibraryBrowser({
  query,
  onQueryChange,
  "data-ocid": dataOcid,
}: LibraryBrowserProps) {
  const [activeType, setActiveType] = useState<LibraryType>("all");
  const [activeNotebookId, setActiveNotebookId] =
    useState<string>(ALL_NOTEBOOKS);

  const {
    data: notebooks = [],
    isLoading: loadingNotebooks,
    isError: notebooksError,
    error: notebooksErrorValue,
    refetch: refetchNotebooks,
  } = useNotebooks();

  const scopedNotebookId =
    activeNotebookId === ALL_NOTEBOOKS ? undefined : activeNotebookId;

  const {
    data: sources = [],
    isLoading: loadingSources,
    isError: sourcesError,
    error: sourcesErrorValue,
    refetch: refetchSources,
  } = useSources(scopedNotebookId);
  const {
    data: notes = [],
    isLoading: loadingNotes,
    isError: notesError,
    error: notesErrorValue,
    refetch: refetchNotes,
  } = useNotes(scopedNotebookId);
  const {
    data: cards = [],
    isLoading: loadingCards,
    isError: cardsError,
    error: cardsErrorValue,
    refetch: refetchCards,
  } = useFlashcards(scopedNotebookId);
  const {
    data: quizzes = [],
    isLoading: loadingQuizzes,
    isError: quizzesError,
    error: quizzesErrorValue,
    refetch: refetchQuizzes,
  } = useQuizzes(scopedNotebookId);

  const notebookTitles = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of notebooks) {
      map.set(item.notebook.id.toString(), item.notebook.title);
    }
    return map;
  }, [notebooks]);

  const entries = useMemo<LibraryEntry[]>(() => {
    const notebookEntries: LibraryEntry[] = notebooks.map((item) => ({
      key: `notebook-${item.notebook.id.toString()}`,
      type: "notebook",
      title: item.notebook.title,
      description: item.notebook.description || "No description yet.",
      meta: `${Number(item.sourceCount)} sources · ${Number(item.noteCount)} notes · ${Number(item.flashcardCount)} cards · ${Number(item.quizCount)} quizzes`,
      notebookId: item.notebook.id.toString(),
      notebookTitle: item.notebook.title,
      updatedAt: item.notebook.updatedAt,
      to: "/notebooks/$notebookId",
    }));

    const sourceEntries: LibraryEntry[] = sources.map((item) => ({
      key: `source-${item.source.id.toString()}`,
      type: "source",
      title: item.source.title,
      description:
        item.source.status === "ready"
          ? `${Number(item.chunkCount)} indexed chunks ready to study.`
          : `Processing — ${humanize(item.source.status)}.`,
      meta: `${humanize(item.source.kind)} · ${humanize(item.source.status)}`,
      notebookId: item.source.notebookId.toString(),
      notebookTitle:
        notebookTitles.get(item.source.notebookId.toString()) ?? "Notebook",
      updatedAt: item.source.updatedAt,
      to: "/notebooks/$notebookId",
    }));

    const noteEntries: LibraryEntry[] = notes.map((note) => ({
      key: `note-${note.id.toString()}`,
      type: "note",
      title: note.title,
      description: note.content,
      meta: `${humanize(note.kind)} · ${humanize(note.difficulty)}`,
      notebookId: note.notebookId.toString(),
      notebookTitle:
        notebookTitles.get(note.notebookId.toString()) ?? "Notebook",
      updatedAt: note.updatedAt,
      to: "/notes",
      search: { notebookId: note.notebookId.toString() },
    }));

    const cardEntries: LibraryEntry[] = cards.map((card) => ({
      key: `flashcard-${card.id.toString()}`,
      type: "flashcard",
      title: card.front,
      description: card.back,
      meta: `${Number(card.knownCount)} known · ${Number(card.reviewCount)} reviews`,
      notebookId: card.notebookId.toString(),
      notebookTitle:
        notebookTitles.get(card.notebookId.toString()) ?? "Notebook",
      updatedAt: card.lastReviewedAt ?? card.createdAt,
      to: "/flashcards",
      search: { notebookId: card.notebookId.toString() },
    }));

    const quizEntries: LibraryEntry[] = quizzes.map((quiz) => ({
      key: `quiz-${quiz.id.toString()}`,
      type: "quiz",
      title: quiz.title,
      description: `Practice quiz at ${humanize(quiz.difficulty).toLowerCase()} difficulty.`,
      meta: `${humanize(quiz.difficulty)} · created ${formatRelative(quiz.createdAt)}`,
      notebookId: quiz.notebookId.toString(),
      notebookTitle:
        notebookTitles.get(quiz.notebookId.toString()) ?? "Notebook",
      updatedAt: quiz.createdAt,
      to: "/quizzes",
      search: { quizId: quiz.id.toString() },
    }));

    return [
      ...notebookEntries,
      ...sourceEntries,
      ...noteEntries,
      ...cardEntries,
      ...quizEntries,
    ];
  }, [notebooks, sources, notes, cards, quizzes, notebookTitles]);

  const counts = useMemo<Record<LibraryType, number>>(() => {
    const base: Record<LibraryType, number> = {
      all: entries.length,
      notebook: 0,
      source: 0,
      note: 0,
      flashcard: 0,
      quiz: 0,
    };
    for (const entry of entries) base[entry.type] += 1;
    return base;
  }, [entries]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (activeType !== "all" && entry.type !== activeType) return false;
      if (!term) return true;
      return (
        entry.title.toLowerCase().includes(term) ||
        entry.description.toLowerCase().includes(term) ||
        entry.notebookTitle.toLowerCase().includes(term)
      );
    });
  }, [entries, activeType, query]);

  const isLoading =
    loadingNotebooks ||
    loadingSources ||
    loadingNotes ||
    loadingCards ||
    loadingQuizzes;
  const isError =
    notebooksError || sourcesError || notesError || cardsError || quizzesError;
  const firstError =
    notebooksErrorValue ??
    sourcesErrorValue ??
    notesErrorValue ??
    cardsErrorValue ??
    quizzesErrorValue;

  const handleRetry = () => {
    void refetchNotebooks();
    void refetchSources();
    void refetchNotes();
    void refetchCards();
    void refetchQuizzes();
  };

  const handleReset = () => {
    setActiveType("all");
    setActiveNotebookId(ALL_NOTEBOOKS);
    onQueryChange("");
  };

  return (
    <div className="space-y-6" data-ocid={dataOcid ?? "library.browser"}>
      <LibraryFilters
        types={TYPE_OPTIONS}
        activeType={activeType}
        onTypeChange={setActiveType}
        notebooks={notebooks.map((item) => ({
          id: item.notebook.id.toString(),
          title: item.notebook.title,
        }))}
        activeNotebookId={activeNotebookId}
        onNotebookChange={setActiveNotebookId}
        counts={counts}
        onReset={handleReset}
      />

      {isError ? (
        <ErrorState
          message={errorMessage(firstError)}
          onRetry={handleRetry}
          data-ocid="library.error_state"
        />
      ) : null}

      {isLoading ? (
        <LoadingSkeleton variant="cards" count={6} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={Library}
          title="Your library is empty"
          description="Create a notebook and add sources to start building a library of notes, flashcards and quizzes."
          action={
            <Button asChild className="rounded-full">
              <Link to="/notebooks" data-ocid="library.create_button">
                Create a notebook
              </Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nothing matches these filters"
          description={
            query.trim()
              ? `No ${activeType === "all" ? "items" : `${activeType}s`} matched "${query.trim()}". Try a different term or reset the filters.`
              : "No items of this type in the selected notebook. Try another filter."
          }
          action={
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="rounded-full"
              data-ocid="library.reset_filters_empty_button"
            >
              Reset filters
            </Button>
          }
          data-ocid="library.no_results_state"
        />
      ) : (
        <ul
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="library.list"
        >
          {filtered.map((entry) => (
            <li key={entry.key} className="flex">
              <Card className="flex w-full flex-col rounded-lg shadow-subtle transition-smooth hover:shadow-elevated">
                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-display text-base font-semibold text-foreground">
                        {entry.title}
                      </p>
                      <p className="mt-0.5 line-clamp-1 font-mono text-[11px] text-muted-foreground">
                        {entry.notebookTitle}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="shrink-0 font-mono text-[10px] uppercase tracking-wide"
                    >
                      {entry.type}
                    </Badge>
                  </div>

                  <p className="line-clamp-3 min-h-[3.75rem] text-sm text-muted-foreground">
                    {entry.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                    <span className="min-w-0 truncate font-mono text-[11px] text-muted-foreground">
                      {entry.meta}
                    </span>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="shrink-0 rounded-full"
                    >
                      <Link
                        to={entry.to}
                        params={
                          entry.to === "/notebooks/$notebookId"
                            ? { notebookId: entry.notebookId }
                            : undefined
                        }
                        search={entry.search ?? {}}
                        data-ocid="library.open_link"
                      >
                        Open
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
