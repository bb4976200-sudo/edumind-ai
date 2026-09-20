import { Button } from "@/components/ui/button";
import { CitationList } from "@/components/workspace/CitationList";
import { MarkdownView } from "@/components/workspace/MarkdownView";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/view";
import { formatRelative } from "@/types/view";
import {
  BookmarkPlus,
  Check,
  Copy,
  Download,
  GraduationCap,
  RotateCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ChatMessageProps {
  message: Message;
  index: number;
  onRegenerate?: (message: Message) => void;
  onSave?: (message: Message) => void;
  onExport?: (message: Message) => void;
  isRegenerating?: boolean;
  isSaving?: boolean;
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** A single conversation turn with markdown, citations and message actions. */
export function ChatMessage({
  message,
  index,
  onRegenerate,
  onSave,
  onExport,
  isRegenerating = false,
  isSaving = false,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const position = index + 1;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Answer copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to the clipboard");
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(message);
      return;
    }
    downloadText(`edumind-answer-${position}.txt`, message.content);
    toast.success("Answer exported as TXT");
  };

  if (isUser) {
    return (
      <article
        data-ocid={`chat.message.${position}`}
        className="flex justify-end"
      >
        <div className="max-w-[85%] rounded-lg gradient-primary px-4 py-3 text-primary-foreground shadow-subtle">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
          <p className="mt-2 text-right font-mono text-[10px] text-primary-foreground/70">
            {formatRelative(message.createdAt)}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article data-ocid={`chat.message.${position}`} className="flex gap-3">
      <span
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
        aria-hidden="true"
      >
        <GraduationCap className="size-4" />
      </span>
      <div className="min-w-0 flex-1 rounded-lg border border-border bg-card px-4 py-3 shadow-subtle">
        <MarkdownView
          content={message.content}
          data-ocid={`chat.message.${position}.content`}
        />
        <CitationList
          citations={message.citations}
          data-ocid={`chat.message.${position}.citations`}
        />
        <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-border/60 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void handleCopy()}
            data-ocid={`chat.copy_button.${position}`}
            className="h-8 rounded-full px-2.5 text-xs text-muted-foreground"
          >
            {copied ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          {onRegenerate ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isRegenerating}
              onClick={() => onRegenerate(message)}
              data-ocid={`chat.regenerate_button.${position}`}
              className="h-8 rounded-full px-2.5 text-xs text-muted-foreground"
            >
              <RotateCw
                className={cn("size-3.5", isRegenerating && "animate-spin")}
                aria-hidden="true"
              />
              Regenerate
            </Button>
          ) : null}
          {onSave ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSaving}
              onClick={() => onSave(message)}
              data-ocid={`chat.save_button.${position}`}
              className="h-8 rounded-full px-2.5 text-xs text-muted-foreground"
            >
              <BookmarkPlus className="size-3.5" aria-hidden="true" />
              Save
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleExport}
            data-ocid={`chat.export_button.${position}`}
            className="h-8 rounded-full px-2.5 text-xs text-muted-foreground"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Export
          </Button>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            {formatRelative(message.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
