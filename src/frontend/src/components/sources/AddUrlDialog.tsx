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
import { cn } from "@/lib/utils";
import { Globe, Youtube } from "lucide-react";
import { useEffect, useState } from "react";

export type LinkKind = "url" | "youtube";

interface AddUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: { title: string; url: string; kind: LinkKind }) => void;
  isPending: boolean;
}

const LINK_KINDS: {
  value: LinkKind;
  label: string;
  hint: string;
  icon: typeof Globe;
}[] = [
  {
    value: "url",
    label: "Website",
    hint: "https://example.com/article",
    icon: Globe,
  },
  {
    value: "youtube",
    label: "YouTube",
    hint: "https://youtube.com/watch?v=…",
    icon: Youtube,
  },
];

/** Dialog for adding a website or YouTube link as a source. */
export function AddUrlDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: AddUrlDialogProps) {
  const [kind, setKind] = useState<LinkKind>("url");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    setKind("url");
    setTitle("");
    setUrl("");
  }, [open]);

  const activeKind = LINK_KINDS.find((option) => option.value === kind);
  const canSubmit = title.trim().length > 0 && url.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({ title: title.trim(), url: url.trim(), kind });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="sources.link_modal">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display">Add a link</DialogTitle>
            <DialogDescription>
              Point EduMind at a website article or a YouTube lecture. It will
              be indexed into this notebook's knowledge base.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-5">
            <div className="space-y-2">
              <Label>Link type</Label>
              <div className="grid grid-cols-2 gap-2">
                {LINK_KINDS.map((option) => {
                  const Icon = option.icon;
                  const isActive = option.value === kind;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setKind(option.value)}
                      aria-pressed={isActive}
                      data-ocid={`sources.link_kind.${option.value}`}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-smooth",
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source-link-title">Title</Label>
              <Input
                id="source-link-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Lecture 3 — Monetary Policy"
                data-ocid="sources.link_title_input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source-link-url">URL</Label>
              <Input
                id="source-link-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder={activeKind?.hint}
                data-ocid="sources.link_url_input"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="sources.link_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || isPending}
              data-ocid="sources.link_submit_button"
            >
              {isPending ? "Adding…" : "Add link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
