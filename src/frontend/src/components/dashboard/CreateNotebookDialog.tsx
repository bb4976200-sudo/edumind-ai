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
import { useCreateNotebook } from "@/lib/queries";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

interface CreateNotebookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Name/subject form that creates a notebook and navigates straight into its
 * workspace. The draft lives in local state and is cleared synchronously on
 * submit so a failed save can restore it.
 */
export function CreateNotebookDialog({
  open,
  onOpenChange,
}: CreateNotebookDialogProps) {
  const createNotebook = useCreateNotebook();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const payload = { title: trimmedTitle, description: subject.trim() };
    setTitle("");
    setSubject("");

    createNotebook.mutate(payload, {
      onSuccess: (notebook) => {
        onOpenChange(false);
        toast.success("Notebook created");
        void navigate({
          to: "/notebooks/$notebookId",
          params: { notebookId: notebook.id.toString() },
        });
      },
      onError: (err) => {
        setTitle((current) => (current === "" ? trimmedTitle : current));
        setSubject((current) =>
          current === "" ? payload.description : current,
        );
        toast.error(errorMessage(err));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="dashboard.create_notebook.modal">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display">
              Create a notebook
            </DialogTitle>
            <DialogDescription>
              A notebook is a self-contained study workspace. Give it a clear
              name and the subject it covers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-5">
            <div className="space-y-2">
              <Label htmlFor="dashboard-notebook-title">Name</Label>
              <Input
                id="dashboard-notebook-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Indian Economy — Semester 4"
                autoComplete="off"
                required
                data-ocid="dashboard.create_notebook.name_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboard-notebook-subject">Subject</Label>
              <Textarea
                id="dashboard-notebook-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="e.g. Macroeconomics, fiscal policy and growth"
                rows={3}
                data-ocid="dashboard.create_notebook.subject_textarea"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="dashboard.create_notebook.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createNotebook.isPending || !title.trim()}
              data-ocid="dashboard.create_notebook.submit_button"
            >
              {createNotebook.isPending ? "Creating…" : "Create notebook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
