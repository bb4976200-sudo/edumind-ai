import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { NotebookFormDialog } from "@/components/notebooks/NotebookFormDialog";
import { NotebookGrid } from "@/components/notebooks/NotebookGrid";
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
import { useRequireAuth } from "@/hooks/useAuth";
import { errorMessage } from "@/lib/api";
import { useDeleteNotebook, useNotebooks } from "@/lib/queries";
import { Route as rootRoute } from "@/routes/__root";
import type { NotebookSummary } from "@/types/view";
import { createRoute } from "@tanstack/react-router";
import { NotebookPen, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notebooks",
  component: NotebooksPage,
});

function NotebooksPage() {
  const authenticated = useRequireAuth();
  const {
    data: notebooks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useNotebooks();
  const deleteNotebook = useDeleteNotebook();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<NotebookSummary | undefined>();
  const [pendingDelete, setPendingDelete] = useState<
    NotebookSummary | undefined
  >();

  if (!authenticated) {
    return <LoadingSkeleton variant="detail" />;
  }

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (item: NotebookSummary) => {
    setEditing(item);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(undefined);
    deleteNotebook.mutate(target.notebook.id.toString(), {
      onSuccess: () => toast.success("Notebook deleted"),
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="My Notebooks"
        title="Notebooks"
        description="Each notebook is a self-contained study workspace with its own sources, notes, flashcards and quizzes."
        actions={
          <Button
            type="button"
            onClick={openCreate}
            className="rounded-full"
            data-ocid="notebooks.open_modal_button"
          >
            <Plus className="size-4" aria-hidden="true" />
            New notebook
          </Button>
        }
      />

      {isError ? (
        <ErrorState
          message={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : null}

      {isLoading ? (
        <LoadingSkeleton variant="cards" count={6} />
      ) : notebooks.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No notebooks yet"
          description="Create a notebook for each course or subject. You can add sources, generate notes and build quizzes inside it."
          action={
            <Button
              type="button"
              onClick={openCreate}
              className="rounded-full"
              data-ocid="notebooks.empty_create_button"
            >
              <Plus className="size-4" aria-hidden="true" />
              Create your first notebook
            </Button>
          }
        />
      ) : (
        <NotebookGrid
          notebooks={notebooks}
          onEdit={openEdit}
          onDelete={setPendingDelete}
        />
      )}

      <NotebookFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        notebook={editing?.notebook}
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(undefined);
        }}
      >
        <AlertDialogContent data-ocid="notebooks.delete_modal">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this notebook?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `“${pendingDelete.notebook.title}” and all of its sources, notes, flashcards and quizzes will be permanently removed. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="notebooks.delete_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              data-ocid="notebooks.delete_confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete notebook
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
