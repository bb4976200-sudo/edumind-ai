import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useChapters,
  useConversations,
  useFlashcards,
  useNotes,
  useQuizzes,
  useSources,
} from "@/lib/queries";
import { cn } from "@/lib/utils";
import { formatRelative, humanize } from "@/types/view";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  FileText,
  Layers,
  ListChecks,
  MessageSquare,
  NotebookPen,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface WorkspaceSidebarProps {
  notebookId: string;
  notebookTitle: string;
  activeConversationId: string | undefined;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  isStartingConversation: boolean;
}

interface SectionProps {
  id: string;
  label: string;
  icon: LucideIcon;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

function Section({
  id,
  label,
  icon: Icon,
  count,
  defaultOpen = true,
  children,
}: SectionProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      data-ocid={`workspace.section.${id}`}
      className="border-b border-border last:border-b-0"
    >
      <CollapsibleTrigger
        data-ocid={`workspace.section.${id}.toggle`}
        className="group flex w-full items-center gap-2.5 px-4 py-3 text-left transition-smooth hover:bg-secondary/60 focus-ring"
      >
        <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-foreground">
          {label}
        </span>
        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {count}
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden">
        <div className="px-3 pb-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border px-3 py-3 text-center text-xs text-muted-foreground">
      {children}
    </p>
  );
}

/** Left column: collapsible notebook navigation across every study surface. */
export function WorkspaceSidebar({
  notebookId,
  notebookTitle,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  isStartingConversation,
}: WorkspaceSidebarProps) {
  const { data: chapters = [] } = useChapters(notebookId);
  const { data: sources = [] } = useSources(notebookId);
  const { data: notes = [] } = useNotes(notebookId);
  const { data: flashcards = [] } = useFlashcards(notebookId);
  const { data: quizzes = [] } = useQuizzes(notebookId);
  const { data: conversations = [] } = useConversations(notebookId);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-4">
        <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
          Notebook
        </p>
        <h2 className="mt-1 truncate font-display text-base font-semibold text-foreground">
          {notebookTitle}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section
          id="chapters"
          label="Chapters"
          icon={BookOpen}
          count={chapters.length}
        >
          {chapters.length === 0 ? (
            <EmptyRow>No chapters defined yet.</EmptyRow>
          ) : (
            <ul className="space-y-1">
              {chapters.map((chapter) => (
                <li
                  key={chapter.id.toString()}
                  data-ocid="workspace.chapter_item"
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground transition-smooth hover:bg-secondary/60"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-secondary font-mono text-[10px] font-semibold text-primary">
                    {Number(chapter.order)}
                  </span>
                  <span className="min-w-0 truncate">{chapter.title}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          id="sources"
          label="Sources"
          icon={FileText}
          count={sources.length}
        >
          {sources.length === 0 ? (
            <EmptyRow>No sources added yet.</EmptyRow>
          ) : (
            <ul className="space-y-1">
              {sources.map((item) => (
                <li
                  key={item.source.id.toString()}
                  data-ocid="workspace.source_item"
                  className="rounded-md px-2.5 py-2 transition-smooth hover:bg-secondary/60"
                >
                  <span className="block truncate text-sm text-foreground">
                    {item.source.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <Badge
                      variant={
                        item.source.status === "ready" ? "default" : "secondary"
                      }
                      className="px-1.5 py-0 text-[10px]"
                    >
                      {humanize(item.source.status)}
                    </Badge>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {Number(item.chunkCount)} chunks
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          id="notes"
          label="Generated Notes"
          icon={NotebookPen}
          count={notes.length}
        >
          {notes.length === 0 ? (
            <EmptyRow>No notes generated yet.</EmptyRow>
          ) : (
            <ul className="space-y-1">
              {notes.map((note) => (
                <li
                  key={note.id.toString()}
                  data-ocid="workspace.note_item"
                  className="rounded-md px-2.5 py-2 transition-smooth hover:bg-secondary/60"
                >
                  <span className="block truncate text-sm text-foreground">
                    {note.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                    {humanize(note.kind)} · {formatRelative(note.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          id="flashcards"
          label="Flashcards"
          icon={Layers}
          count={flashcards.length}
        >
          {flashcards.length === 0 ? (
            <EmptyRow>No flashcards yet.</EmptyRow>
          ) : (
            <ul className="space-y-1">
              {flashcards.map((card) => (
                <li
                  key={card.id.toString()}
                  data-ocid="workspace.flashcard_item"
                  className="rounded-md px-2.5 py-2 transition-smooth hover:bg-secondary/60"
                >
                  <span className="line-clamp-1 text-sm text-foreground">
                    {card.front}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                    {Number(card.knownCount)} known · {Number(card.reviewCount)}{" "}
                    reviews
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          id="quizzes"
          label="Quizzes"
          icon={ListChecks}
          count={quizzes.length}
        >
          {quizzes.length === 0 ? (
            <EmptyRow>No quizzes yet.</EmptyRow>
          ) : (
            <ul className="space-y-1">
              {quizzes.map((quiz) => (
                <li key={quiz.id.toString()}>
                  <Link
                    to="/quizzes"
                    search={{ quizId: quiz.id.toString() }}
                    data-ocid="workspace.quiz_item"
                    className="block rounded-md px-2.5 py-2 transition-smooth hover:bg-secondary/60 focus-ring"
                  >
                    <span className="block truncate text-sm text-foreground">
                      {quiz.title}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                      {humanize(quiz.difficulty)} ·{" "}
                      {formatRelative(quiz.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          id="chat-history"
          label="Chat History"
          icon={MessageSquare}
          count={conversations.length}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onNewConversation}
            disabled={isStartingConversation}
            data-ocid="workspace.new_conversation_button"
            className="mb-2 w-full justify-start rounded-md"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            New session
          </Button>
          {conversations.length === 0 ? (
            <EmptyRow>No conversations yet.</EmptyRow>
          ) : (
            <ul className="space-y-1">
              {conversations.map((item) => {
                const id = item.conversation.id.toString();
                const active = id === activeConversationId;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelectConversation(id)}
                      data-ocid="workspace.conversation_item"
                      className={cn(
                        "w-full rounded-md px-2.5 py-2 text-left transition-smooth focus-ring",
                        active
                          ? "bg-secondary text-foreground"
                          : "text-foreground hover:bg-secondary/60",
                      )}
                    >
                      <span className="block truncate text-sm">
                        {item.conversation.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                        {Number(item.messageCount)} messages ·{" "}
                        {formatRelative(item.conversation.updatedAt)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
