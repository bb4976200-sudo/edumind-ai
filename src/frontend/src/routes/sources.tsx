import { SourceKind } from "@/backend";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { AddUrlDialog } from "@/components/sources/AddUrlDialog";
import type { LinkKind } from "@/components/sources/AddUrlDialog";
import {
  SourceDropzone,
  isAcceptedFile,
} from "@/components/sources/SourceDropzone";
import { SourceList } from "@/components/sources/SourceList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  useAddSource,
  useDeleteSource,
  useNotebooks,
  useProcessSource,
  useSources,
} from "@/lib/queries";
import { Route as rootRoute } from "@/routes/__root";
import type { SourceSummary } from "@/types/view";
import { Link, createRoute } from "@tanstack/react-router";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sources",
  validateSearch: (
    search: Record<string, unknown>,
  ): { notebookId?: string } => ({
    notebookId:
      typeof search.notebookId === "string" ? search.notebookId : undefined,
  }),
  component: SourcesPage,
});

const MAX_SOURCE_BYTES = 20_000_000;

const KIND_BY_EXTENSION: { extension: string; kind: SourceKind }[] = [
  { extension: ".pdf", kind: SourceKind.pdf },
  { extension: ".docx", kind: SourceKind.docx },
  { extension: ".pptx", kind: SourceKind.pptx },
  { extension: ".txt", kind: SourceKind.text },
];

function kindForFile(file: File): SourceKind {
  const name = file.name.toLowerCase();
  return (
    KIND_BY_EXTENSION.find((entry) => name.endsWith(entry.extension))?.kind ??
    SourceKind.text
  );
}

function SourcesPage() {
  const authenticated = useRequireAuth();
  const { notebookId: searchNotebookId } = Route.useSearch();
  const { data: notebooks = [] } = useNotebooks();
  const [selected, setSelected] = useState<string | undefined>(
    searchNotebookId,
  );
  const activeNotebookId =
    selected ?? searchNotebookId ?? notebooks[0]?.notebook.id.toString();

  const {
    data: sources = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useSources(activeNotebookId);
  const addSource = useAddSource();
  const processSource = useProcessSource();
  const deleteSource = useDeleteSource();

  const [linkOpen, setLinkOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<
    SourceSummary | undefined
  >();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  if (!authenticated) {
    return <LoadingSkeleton variant="detail" />;
  }

  const handleFiles = (files: File[]) => {
    if (!activeNotebookId) return;
    const accepted = files.filter(isAcceptedFile);
    const rejected = files.length - accepted.length;
    if (rejected > 0) {
      toast.error(
        `${rejected} file${rejected > 1 ? "s" : ""} skipped — only PDF, DOCX, PPTX and TXT are supported.`,
      );
    }
    if (accepted.length === 0) return;

    const oversized = accepted.filter((file) => file.size > MAX_SOURCE_BYTES);
    if (oversized.length > 0) {
      toast.error(
        `${oversized.length} file${oversized.length > 1 ? "s" : ""} exceed the 20 MB limit.`,
      );
    }
    const usable = accepted.filter((file) => file.size <= MAX_SOURCE_BYTES);
    if (usable.length === 0) return;

    setUploadProgress(0);
    let completed = 0;
    for (const file of usable) {
      addSource.mutate(
        {
          notebookId: BigInt(activeNotebookId),
          title: file.name,
          kind: kindForFile(file),
          url: "",
          content: "",
          storageKey: file.name,
          sizeBytes: BigInt(file.size),
        },
        {
          onSuccess: () => {
            toast.success(`${file.name} added`);
          },
          onError: (err) => toast.error(errorMessage(err)),
          onSettled: () => {
            completed += 1;
            setUploadProgress(Math.round((completed / usable.length) * 100));
            if (completed === usable.length) {
              window.setTimeout(() => setUploadProgress(null), 600);
            }
          },
        },
      );
    }
  };

  const handleAddLink = (input: {
    title: string;
    url: string;
    kind: LinkKind;
  }) => {
    if (!activeNotebookId) return;
    addSource.mutate(
      {
        notebookId: BigInt(activeNotebookId),
        title: input.title,
        kind: input.kind === "youtube" ? SourceKind.youtube : SourceKind.url,
        url: input.url,
        content: "",
        storageKey: "",
        sizeBytes: BigInt(new TextEncoder().encode(input.url).length),
      },
      {
        onSuccess: () => {
          toast.success("Link added");
          setLinkOpen(false);
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleRetry = (item: SourceSummary) => {
    if (!activeNotebookId) return;
    const id = item.source.id.toString();
    setRetryingId(id);
    processSource.mutate(
      { id, notebookId: activeNotebookId },
      {
        onSuccess: () => toast.success("Source reprocessed"),
        onError: (err) => toast.error(errorMessage(err)),
        onSettled: () => setRetryingId(null),
      },
    );
  };

  const handleOpen = (item: SourceSummary) => {
    const { url } = item.source;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    toast.info("This source has no external link to open.");
  };

  const confirmDelete = () => {
    if (!pendingDelete || !activeNotebookId) return;
    const target = pendingDelete;
    setPendingDelete(undefined);
    deleteSource.mutate(
      { id: target.source.id.toString(), notebookId: activeNotebookId },
      {
        onSuccess: () => toast.success("Source deleted"),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sources"
        title="Knowledge base"
        description="Everything EduMind reads from. Add material, then process it so it can ground your study sessions."
        actions={
          <Button
            type="button"
            onClick={() => setLinkOpen(true)}
            disabled={!activeNotebookId}
            className="rounded-full"
            data-ocid="sources.open_modal_button"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add link
          </Button>
        }
      />

      {notebooks.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <Label
            htmlFor="notebook-filter"
            className="text-sm text-muted-foreground"
          >
            Notebook
          </Label>
          <Select
            value={activeNotebookId}
            onValueChange={(value) => setSelected(value)}
          >
            <SelectTrigger
              id="notebook-filter"
              className="w-full sm:w-72"
              data-ocid="sources.notebook_select"
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
          icon={FileText}
          title="Create a notebook first"
          description="Sources live inside notebooks. Create one to start building your knowledge base."
          action={
            <Button asChild className="rounded-full">
              <Link to="/notebooks" data-ocid="sources.create_notebook_button">
                Create a notebook
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <SourceDropzone
            onFiles={handleFiles}
            onAddLink={() => setLinkOpen(true)}
            progress={uploadProgress}
            disabled={!activeNotebookId}
          />

          {isLoading ? (
            <LoadingSkeleton variant="list" count={4} />
          ) : sources.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No sources yet"
              description="Add lecture notes, articles or transcripts so EduMind can answer questions grounded in your material."
              action={
                <Button
                  type="button"
                  onClick={() => setLinkOpen(true)}
                  className="rounded-full"
                  data-ocid="sources.empty_add_button"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add your first source
                </Button>
              }
            />
          ) : (
            <SourceList
              sources={sources}
              onOpen={handleOpen}
              onDelete={setPendingDelete}
              onRetry={handleRetry}
              retryingId={retryingId}
            />
          )}
        </>
      )}

      <AddUrlDialog
        open={linkOpen}
        onOpenChange={setLinkOpen}
        onSubmit={handleAddLink}
        isPending={addSource.isPending}
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(undefined);
        }}
      >
        <AlertDialogContent data-ocid="sources.delete_modal">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this source?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `“${pendingDelete.source.title}” will be removed from this notebook's knowledge base. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="sources.delete_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              data-ocid="sources.delete_confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete source
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
