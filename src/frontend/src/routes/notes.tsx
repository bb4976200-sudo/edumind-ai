import type { Note } from "@/backend";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { NoteEditor } from "@/components/study/NoteEditor";
import {
  NoteGeneratorForm,
  type NoteGeneratorValues,
} from "@/components/study/NoteGeneratorForm";
import { NoteList } from "@/components/study/NoteList";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequireAuth } from "@/hooks/useAuth";
import { errorMessage } from "@/lib/api";
import {
  useChapters,
  useDeleteNote,
  useGenerateNote,
  useNotebooks,
  useNotes,
  useSources,
  useUpdateNote,
} from "@/lib/queries";
import { Route as rootRoute } from "@/routes/__root";
import { Link, createRoute } from "@tanstack/react-router";
import { BookOpen, FileText } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes",
  component: NotesPage,
});

function NotesPage() {
  const authenticated = useRequireAuth();
  const { data: notebooks = [] } = useNotebooks();
  const [selectedNotebook, setSelectedNotebook] = useState<string | undefined>(
    undefined,
  );
  const activeNotebookId =
    selectedNotebook ?? notebooks[0]?.notebook.id.toString();

  const {
    data: notes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useNotes(activeNotebookId);
  const { data: sources = [] } = useSources(activeNotebookId);
  const { data: chapters = [] } = useChapters(activeNotebookId);

  const generateNote = useGenerateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [activeNoteId, setActiveNoteId] = useState<string | undefined>(
    undefined,
  );

  const activeNote: Note | undefined =
    notes.find((note) => note.id.toString() === activeNoteId) ?? notes[0];

  const handleGenerate = (values: NoteGeneratorValues) => {
    if (!activeNotebookId) return;
    generateNote.mutate(
      {
        notebookId: BigInt(activeNotebookId),
        kind: values.kind,
        difficulty: values.difficulty,
        chapter: values.chapter || undefined,
        sourceId:
          values.sourceId === "all" ? undefined : BigInt(values.sourceId),
      },
      {
        onSuccess: (note) => {
          setActiveNoteId(note.id.toString());
          toast.success("Notes generated");
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleSave = useCallback(
    (values: { title: string; content: string }) => {
      if (!activeNote || !activeNotebookId) return;
      updateNote.mutate(
        {
          id: activeNote.id.toString(),
          notebookId: activeNotebookId,
          title: values.title,
          content: values.content,
        },
        {
          onError: (err) => toast.error(errorMessage(err)),
        },
      );
    },
    [activeNote, activeNotebookId, updateNote],
  );

  const handleRegenerateSection = (sectionTitle: string) => {
    if (!activeNotebookId) return;
    generateNote.mutate(
      {
        notebookId: BigInt(activeNotebookId),
        kind: activeNote?.kind ?? "summary",
        difficulty: activeNote?.difficulty ?? "intermediate",
        chapter: sectionTitle,
      },
      {
        onSuccess: (note) => {
          setActiveNoteId(note.id.toString());
          toast.success(`Regenerated “${sectionTitle}”`);
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!activeNotebookId) return;
    deleteNote.mutate(
      { id, notebookId: activeNotebookId },
      {
        onSuccess: () => {
          setActiveNoteId(undefined);
          toast.success("Note deleted");
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  if (!authenticated) {
    return <LoadingSkeleton variant="detail" />;
  }

  return (
    <div className="space-y-8" data-ocid="notes.page">
      <PageHeader
        eyebrow="Notes"
        title="Study notes"
        description="Generate structured notes from your sources, then edit, search and refine them in place."
      />

      {notebooks.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <Label
            htmlFor="notes-notebook"
            className="text-sm text-muted-foreground"
          >
            Notebook
          </Label>
          <Select
            value={activeNotebookId}
            onValueChange={(value) => {
              setSelectedNotebook(value);
              setActiveNoteId(undefined);
            }}
          >
            <SelectTrigger
              id="notes-notebook"
              className="w-full sm:w-72"
              data-ocid="notes.notebook_select"
            >
              <SelectValue placeholder="Select a notebook" />
            </SelectTrigger>
            <SelectContent>
              {notebooks.map((item) => (
                <SelectItem
                  key={item.notebook.id.toString()}
                  value={item.notebook.id.toString()}
                >
                  {item.notebook.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {isError ? (
        <ErrorState
          message={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : null}

      {notebooks.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Create a notebook first"
          description="Notes are generated from a notebook's sources. Create one to get started."
          action={
            <Button asChild className="rounded-full">
              <Link to="/notebooks" data-ocid="notes.create_notebook_button">
                Create a notebook
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <NoteGeneratorForm
            sources={sources.map((item) => ({
              id: item.source.id.toString(),
              title: item.source.title,
            }))}
            chapters={chapters.map((chapter) => chapter.title)}
            isPending={generateNote.isPending}
            onSubmit={handleGenerate}
          />

          {isLoading ? (
            <LoadingSkeleton variant="cards" count={3} />
          ) : notes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No notes yet"
              description="Choose a chapter and output type above, then generate your first set of notes."
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
              <aside className="lg:sticky lg:top-6 lg:self-start">
                <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Notebook notes
                </h2>
                <NoteList
                  notes={notes}
                  activeId={activeNote?.id.toString()}
                  onSelect={setActiveNoteId}
                  onDelete={handleDelete}
                  isDeleting={deleteNote.isPending}
                />
              </aside>

              {activeNote ? (
                <NoteEditor
                  note={activeNote}
                  isSaving={updateNote.isPending}
                  isRegenerating={generateNote.isPending}
                  onSave={handleSave}
                  onRegenerateSection={handleRegenerateSection}
                />
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  );
}
