import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CornerDownLeft, Loader2, Send } from "lucide-react";
import { type FormEvent, type KeyboardEvent, useState } from "react";

interface ChatComposerProps {
  onSend: (question: string) => void;
  isSending: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  "data-ocid"?: string;
}

/** Question composer with Enter-to-send and Shift+Enter for a new line. */
export function ChatComposer({
  onSend,
  isSending,
  disabled = false,
  placeholder = "Ask anything about your sources…",
  className,
  "data-ocid": dataOcid,
}: ChatComposerProps) {
  const [draft, setDraft] = useState("");
  const trimmed = draft.trim();
  const blocked = disabled || isSending;

  const submit = () => {
    if (!trimmed || blocked) return;
    const question = trimmed;
    setDraft("");
    onSend(question);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid={dataOcid ?? "chat.composer"}
      className={cn("border-t border-border bg-card p-3 sm:p-4", className)}
    >
      <div className="flex items-end gap-2">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Your question"
          data-ocid="chat.input"
          className="min-h-[3rem] resize-none bg-background"
        />
        <Button
          type="submit"
          disabled={blocked || trimmed.length === 0}
          data-ocid="chat.send_button"
          className="shrink-0 rounded-full"
        >
          {isSending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          <span className="sr-only sm:not-sr-only">Send</span>
        </Button>
      </div>
      <p className="mt-2 hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
        <CornerDownLeft className="size-3" aria-hidden="true" />
        Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
}
