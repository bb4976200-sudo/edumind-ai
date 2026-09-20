import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { errorMessage } from "@/lib/api";
import { useCreateNotebook, useUpdateNotebook } from "@/lib/queries";
import type { Notebook } from "@/types/view";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NotebookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When present the dialog edits this notebook instead of creating one. */
  notebook?: Notebook;
}

/**
 * Create/edit dialog for a notebook. Owns its own draft state and resets it
 * whenever the dialog opens, so a cancelled edit never leaks into the next one.
 */
export function NotebookFormDialog({
  open,
  onOpenChange,
  notebook,
}: NotebookFormDialogProps) {
  const isEditing = !!notebook;
  const createNotebook = useCreateNotebook();
  const updateNotebook = useUpdateNotebook();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(notebook?.title ?? "");
    setDescription(notebook?.description ?? "");
  }, [open, notebook]);

  const isPending = createNotebook.isPending || updateNotebook.isPending;
  const canSubmit = title.trim().length > 0 && !isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const trimmedDescription = description.trim();

    if (isEditing && notebook) {
      updateNotebook.mutate(
        {
          id: notebook.id.toString(),
          update: { title: trimmedTitle, description: trimmedDescription },
        },
        {
          onSuccess: () => {
            toast.success("Notebook updated");
            onOpenChange(false);
          },
          onError: (err) => toast.error(errorMessage(err)),
        },
      );
      return;
    }

    createNotebook.mutate(
      { title: trimmedTitle, description: trimmedDescription },
      {
        onSuccess: () => {
          toast.success("Notebook created");
          onOpenChange(false);
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="notebooks.modal">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display">
              {isEditing ? "Edit notebook" : "Create a notebook"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the title or description of this workspace."
                : "Give your workspace a clear title so you can find it later."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-5">
            <div className="space-y-2">
              <Label htmlFor="notebook-title">Title</Label>
              <Input
                id="notebook-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Indian Economy — Semester 4"
                data-ocid="notebooks.title_input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notebook-description">Description</Label>
              <Textarea
                id="notebook-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What does this notebook cover?"
                rows={3}
                data-ocid="notebooks.description_textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="notebooks.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              data-ocid="notebooks.submit_button"
            >
              {isPending
                ? isEditing
                  ? "Saving…"
                  : "Creating…"
                : isEditing
                  ? "Save changes"
                  : "Create notebook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
