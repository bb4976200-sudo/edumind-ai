import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { errorMessage } from "@/lib/api";
import {
  useConversations,
  useFlashcards,
  useNotebooks,
  useNotes,
  useQuizzes,
} from "@/lib/queries";
import { formatRelative, humanize } from "@/types/view";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  type FileText,
  Layers,
  ListChecks,
  MessageSquare,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

interface StudyHubProps {
  "data-ocid"?: string;
}

/**
 * AI Study hub: the user's notebooks with their generated material and quick
 * entry points into chat, notes, flashcards and quizzes.
 */
export function StudyHub({ "data-ocid": dataOcid }: StudyHubProps) {
  const {
    data: notebooks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useNotebooks();
  const [activeNotebookId, setActiveNotebookId] = useState<string | undefined>(
    undefined,
  );

  const selectedId =
    activeNotebookId ?? notebooks[0]?.notebook.id.toString() ?? undefined;

  const { data: notes = [] } = useNotes(selectedId);
  const { data: cards = [] } = useFlashcards(selectedId);
  const { data: quizzes = [] } = useQuizzes(selectedId);
  const { data: conversations = [] } = useConversations(selectedId);

  const activeNotebook = useMemo(
    () => notebooks.find((item) => item.notebook.id.toString() === selectedId),
    [notebooks, selectedId],
  );

  if (isError) {
    return (
      <ErrorState
        message={errorMessage(error)}
        onRetry={() => void refetch()}
        data-ocid="study_hub.error_state"
      />
    );
  }

  if (isLoading) {
    return <LoadingSkeleton variant="cards" count={3} />;
  }

  if (notebooks.length === 0) {
    return (
      <EmptyState
        icon={BrainCircuit}
        title="Your study hub is waiting"
        description="Create a notebook, add your sources, then generate notes, flashcards and quizzes — or ask questions grounded in your material."
        action={
          <Button asChild className="rounded-full">
            <Link to="/notebooks" data-ocid="study_hub.create_notebook_button">
              Create a notebook
            </Link>
          </Button>
        }
        data-ocid="study_hub.empty_state"
      />
    );
  }

  const quickActions = [
    {
      label: "Ask your notebook",
      description: "Chat with citations back to your sources.",
      icon: MessageSquare,
      to: "/study" as const,
      search: { notebookId: selectedId },
      ocid: "study_hub.chat_link",
    },
    {
      label: "Study notes",
      description: "Summaries and detailed notes you can edit.",
      icon: BookOpen,
      to: "/notes" as const,
      search: {},
      ocid: "study_hub.notes_link",
    },
    {
      label: "Flashcards",
      description: "Review cards and track what you know.",
      icon: Layers,
      to: "/flashcards" as const,
      search: {},
      ocid: "study_hub.flashcards_link",
    },
    {
      label: "Practice quizzes",
      description: "Test recall and surface weak topics.",
      icon: ListChecks,
      to: "/quizzes" as const,
      search: {},
      ocid: "study_hub.quizzes_link",
    },
  ];

  return (
    <div className="space-y-8" data-ocid={dataOcid ?? "study_hub"}>
      <section aria-labelledby="study-hub-notebooks" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="study-hub-notebooks"
            className="font-display text-sm font-semibold text-foreground"
          >
            Your notebooks
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {notebooks.length} total
          </span>
        </div>
        <ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="study_hub.notebook_list"
        >
          {notebooks.map((item) => {
            const id = item.notebook.id.toString();
            const active = id === selectedId;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setActiveNotebookId(id)}
                  aria-pressed={active}
                  data-ocid="study_hub.notebook_item"
                  className={`w-full rounded-lg border px-5 py-4 text-left transition-smooth focus-ring ${
                    active
                      ? "border-primary/40 bg-secondary shadow-subtle"
                      : "border-border bg-card hover:bg-secondary/50"
                  }`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm font-semibold text-foreground">
                        {item.notebook.title}
                      </span>
                      <span className="mt-0.5 block line-clamp-1 text-xs text-muted-foreground">
                        {item.notebook.description || "No description yet."}
                      </span>
                    </span>
                    <NotebookPen
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px]"
                    >
                      {Number(item.sourceCount)} sources
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px]"
                    >
                      {Number(item.noteCount)} notes
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px]"
                    >
                      {Number(item.flashcardCount)} cards
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px]"
                    >
                      {Number(item.quizCount)} quizzes
                    </Badge>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="study-hub-actions" className="space-y-4">
        <h2
          id="study-hub-actions"
          className="font-display text-sm font-semibold text-foreground"
        >
          Quick entry points
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <li key={action.label}>
                <Card className="h-full rounded-lg shadow-subtle transition-smooth hover:shadow-elevated">
                  <CardContent className="flex h-full flex-col gap-3 p-5">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold text-foreground">
                        {action.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="mt-auto -ml-2 self-start rounded-full"
                    >
                      <Link
                        to={action.to}
                        search={action.search}
                        data-ocid={action.ocid}
                      >
                        Open
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      {activeNotebook ? (
        <section aria-labelledby="study-hub-material" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="study-hub-material"
              className="font-display text-sm font-semibold text-foreground"
            >
              Generated material in {activeNotebook.notebook.title}
            </h2>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <Link
                to="/notebooks/$notebookId"
                params={{ notebookId: selectedId ?? "" }}
                data-ocid="study_hub.open_workspace_link"
              >
                Open workspace
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <MaterialCard
              title="Notes"
              icon={BookOpen}
              emptyLabel="No notes generated yet."
              items={notes.slice(0, 4).map((note) => ({
                key: note.id.toString(),
                title: note.title,
                meta: `${humanize(note.kind)} · ${formatRelative(note.updatedAt)}`,
              }))}
              data-ocid="study_hub.notes_card"
            />
            <MaterialCard
              title="Flashcards"
              icon={Layers}
              emptyLabel="No flashcards generated yet."
              items={cards.slice(0, 4).map((card) => ({
                key: card.id.toString(),
                title: card.front,
                meta: `${Number(card.knownCount)} known · ${Number(card.reviewCount)} reviews`,
              }))}
              data-ocid="study_hub.flashcards_card"
            />
            <MaterialCard
              title="Quizzes"
              icon={ListChecks}
              emptyLabel="No quizzes generated yet."
              items={quizzes.slice(0, 4).map((quiz) => ({
                key: quiz.id.toString(),
                title: quiz.title,
                meta: `${humanize(quiz.difficulty)} · ${formatRelative(quiz.createdAt)}`,
              }))}
              data-ocid="study_hub.quizzes_card"
            />
            <MaterialCard
              title="Study sessions"
              icon={MessageSquare}
              emptyLabel="No study sessions yet."
              items={conversations.slice(0, 4).map((item) => ({
                key: item.conversation.id.toString(),
                title: item.conversation.title,
                meta: `${Number(item.messageCount)} messages · ${formatRelative(item.conversation.updatedAt)}`,
              }))}
              data-ocid="study_hub.conversations_card"
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}

interface MaterialItem {
  key: string;
  title: string;
  meta: string;
}

interface MaterialCardProps {
  title: string;
  icon: typeof FileText;
  items: MaterialItem[];
  emptyLabel: string;
  "data-ocid"?: string;
}

function MaterialCard({
  title,
  icon: Icon,
  items,
  emptyLabel,
  "data-ocid": dataOcid,
}: MaterialCardProps) {
  return (
    <Card className="rounded-lg shadow-subtle" data-ocid={dataOcid}>
      <CardHeader className="flex-row items-center gap-2.5 space-y-0 pb-3">
        <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <CardTitle className="font-display text-sm font-semibold">
          {title}
        </CardTitle>
        <Badge
          variant="secondary"
          className="ml-auto font-mono text-[10px] text-muted-foreground"
        >
          {items.length}
        </Badge>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 shrink-0" aria-hidden="true" />
            {emptyLabel}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.key} className="py-2.5 first:pt-0 last:pb-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {item.meta}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
