import { Difficulty, StudyMaterialKind } from "@/backend";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { ChatComposer } from "@/components/workspace/ChatComposer";
import { ChatMessage } from "@/components/workspace/ChatMessage";
import { QuickPrompts } from "@/components/workspace/QuickPrompts";
import { errorMessage } from "@/lib/api";
import {
  useAskQuestion,
  useGenerateNote,
  useMessages,
  useUpdateNote,
} from "@/lib/queries";
import type { Message } from "@/types/view";
import { MessageSquarePlus, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ChatPanelProps {
  conversationId: string | undefined;
  notebookId: string;
  onStartConversation: () => void;
  isStarting: boolean;
}

/** Center column: the grounded AI conversation with citations and actions. */
export function ChatPanel({
  conversationId,
  notebookId,
  onStartConversation,
  isStarting,
}: ChatPanelProps) {
  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useMessages(conversationId);
  const askQuestion = useAskQuestion();
  const generateNote = useGenerateNote();
  const updateNote = useUpdateNote();
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to the newest turn whenever the thread grows
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length, askQuestion.isPending]);

  const handleSend = (question: string) => {
    if (!conversationId) return;
    askQuestion.mutate(
      { conversationId, question },
      { onError: (err) => toast.error(errorMessage(err)) },
    );
  };

  const handleRegenerate = (message: Message) => {
    if (!conversationId) return;
    const previous = messages[messages.indexOf(message) - 1];
    const question =
      previous && previous.role === "user"
        ? previous.content
        : "Regenerate your previous answer with more detail.";
    askQuestion.mutate(
      { conversationId, question },
      {
        onSuccess: () => toast.success("Answer regenerated"),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleSave = (message: Message) => {
    // Message ids and note ids come from independent counters, so a message id
    // must never be reused as a note id. Create a fresh note through the
    // generateNote surface, then fill it with the assistant's answer.
    generateNote.mutate(
      {
        notebookId: BigInt(notebookId),
        kind: StudyMaterialKind.summary,
        difficulty: Difficulty.intermediate,
      },
      {
        onSuccess: (note) => {
          updateNote.mutate(
            {
              id: note.id.toString(),
              notebookId,
              title: "Saved answer",
              content: message.content,
            },
            {
              onSuccess: () => toast.success("Saved to your notes"),
              onError: () => toast.error("Could not save this answer"),
            },
          );
        },
        onError: () => toast.error("Could not save this answer"),
      },
    );
  };

  if (!conversationId) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon={Sparkles}
          title="Ask your first question"
          description="Every answer is grounded in this notebook's sources, with citations back to the exact passage. Start a session to begin."
          action={
            <Button
              type="button"
              onClick={onStartConversation}
              disabled={isStarting}
              className="rounded-full"
              data-ocid="chat.start_button"
            >
              <MessageSquarePlus className="size-4" aria-hidden="true" />
              Start a session
            </Button>
          }
          className="border-0 bg-transparent"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        data-ocid="chat.message_list"
        className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5"
      >
        {isLoading ? (
          <LoadingSkeleton variant="list" count={3} />
        ) : isError ? (
          <ErrorState
            message={errorMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : messages.length === 0 ? (
          <div className="space-y-6 py-6">
            <div className="text-center">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Ready when you are
              </h3>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
                Ask a question below, or start with one of these study prompts.
              </p>
            </div>
            <QuickPrompts
              onSelect={handleSend}
              disabled={askQuestion.isPending}
            />
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message.id.toString()}
              message={message}
              index={index}
              onRegenerate={handleRegenerate}
              onSave={handleSave}
              isRegenerating={askQuestion.isPending}
              isSaving={generateNote.isPending || updateNote.isPending}
            />
          ))
        )}

        {askQuestion.isPending ? (
          <div className="flex gap-3" data-ocid="chat.thinking_state">
            <span
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
              aria-hidden="true"
            >
              <Sparkles className="size-4 animate-pulse-soft" />
            </span>
            <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-subtle">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-1.5 animate-pulse-soft rounded-full bg-primary" />
                  <span className="size-1.5 animate-pulse-soft rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="size-1.5 animate-pulse-soft rounded-full bg-primary [animation-delay:300ms]" />
                </span>
                Reading your sources…
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <ChatComposer
        onSend={handleSend}
        isSending={askQuestion.isPending}
        placeholder="Ask anything about this notebook's sources…"
      />
    </div>
  );
}
