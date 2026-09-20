import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { StudyMaterialPanel } from "@/components/workspace/StudyMaterialPanel";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { useRequireAuth } from "@/hooks/useAuth";
import { errorMessage } from "@/lib/api";
import {
  useConversations,
  useCreateConversation,
  useNotebook,
} from "@/lib/queries";
import { Route as rootRoute } from "@/routes/__root";
import { Link, createRoute } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notebooks/$notebookId",
  component: NotebookWorkspacePage,
});

function NotebookWorkspacePage() {
  const authenticated = useRequireAuth();
  const { notebookId } = Route.useParams();
  const {
    data: notebook,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotebook(notebookId);
  const { data: conversations = [] } = useConversations(notebookId);
  const createConversation = useCreateConversation();
  const [activeConversationId, setActiveConversationId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].conversation.id.toString());
    }
  }, [activeConversationId, conversations]);

  if (!authenticated || isLoading) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (isError) {
    return (
      <ErrorState
        message={errorMessage(error)}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!notebook) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Notebook not found"
        description="This notebook may have been deleted, or it belongs to another account."
        action={
          <Button asChild className="rounded-full">
            <Link to="/notebooks" data-ocid="workspace.back_button">
              Back to notebooks
            </Link>
          </Button>
        }
      />
    );
  }

  const handleNewConversation = () => {
    createConversation.mutate(
      { notebookId, title: "New study session" },
      {
        onSuccess: (conversation) => {
          setActiveConversationId(conversation.id.toString());
          toast.success("Study session started");
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 rounded-full text-muted-foreground"
        >
          <Link to="/notebooks" data-ocid="workspace.back_link">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All notebooks
          </Link>
        </Button>
        <p className="font-mono text-xs text-muted-foreground">
          {notebook.description || "Notebook workspace"}
        </p>
      </div>

      <WorkspaceLayout
        sidebar={
          <WorkspaceSidebar
            notebookId={notebookId}
            notebookTitle={notebook.title}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewConversation={handleNewConversation}
            isStartingConversation={createConversation.isPending}
          />
        }
        chat={
          <ChatPanel
            conversationId={activeConversationId}
            notebookId={notebookId}
            onStartConversation={handleNewConversation}
            isStarting={createConversation.isPending}
          />
        }
        studyMaterial={<StudyMaterialPanel notebookId={notebookId} />}
      />
    </div>
  );
}
