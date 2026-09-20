import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { CreateNotebookDialog } from "@/components/dashboard/CreateNotebookDialog";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { NotebooksCard } from "@/components/dashboard/NotebooksCard";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { RecentChatsCard } from "@/components/dashboard/RecentChatsCard";
import { RecentSourcesCard } from "@/components/dashboard/RecentSourcesCard";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { errorMessage } from "@/lib/api";
import { queryKeys, useNotebooks, useSeedDemoData } from "@/lib/queries";
import { Route as rootRoute } from "@/routes/__root";
import type { ConversationSummary, SourceSummary } from "@/types/view";
import { useQueries } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

function DashboardPage() {
  const authenticated = useRequireAuth();
  const {
    data: notebooks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useNotebooks();
  const seedDemo = useSeedDemoData();
  const { actor, ready } = useBackend();
  const [createOpen, setCreateOpen] = useState(false);

  // The dashboard aggregates across notebooks, so it fans out one query per
  // notebook and flattens the results into recent-activity rows.
  const notebookIds = useMemo(
    () => notebooks.map((item) => item.notebook.id.toString()),
    [notebooks],
  );

  const sourceQueries = useQueries({
    queries: notebookIds.map((id) => ({
      queryKey: queryKeys.sources(id),
      queryFn: async () => {
        if (!actor) return [];
        return actor.listSources(BigInt(id));
      },
      enabled: ready,
    })),
  });

  const conversationQueries = useQueries({
    queries: notebookIds.map((id) => ({
      queryKey: queryKeys.conversations(id),
      queryFn: async () => {
        if (!actor) return [];
        return actor.listConversations(BigInt(id));
      },
      enabled: ready,
    })),
  });

  const sourcesLoading = sourceQueries.some((query) => query.isLoading);
  const chatsLoading = conversationQueries.some((query) => query.isLoading);

  const recentSources = useMemo<SourceSummary[]>(
    () =>
      sourceQueries
        .flatMap((query) => query.data ?? [])
        .sort((a, b) => Number(b.source.createdAt - a.source.createdAt))
        .slice(0, 5),
    [sourceQueries],
  );

  const recentConversations = useMemo<ConversationSummary[]>(
    () =>
      conversationQueries
        .flatMap((query) => query.data ?? [])
        .sort((a, b) =>
          Number(b.conversation.updatedAt - a.conversation.updatedAt),
        )
        .slice(0, 5),
    [conversationQueries],
  );

  if (!authenticated) {
    return <LoadingSkeleton variant="detail" />;
  }

  const handleSeed = () => {
    seedDemo.mutate(undefined, {
      onSuccess: () => toast.success("Demo notebook is ready"),
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  return (
    <div data-ocid="dashboard.page" className="space-y-8">
      <DashboardHero
        notebookCount={notebooks.length}
        onCreateNotebook={() => setCreateOpen(true)}
        extraActions={
          <Button
            type="button"
            size="lg"
            variant="ghost"
            onClick={handleSeed}
            disabled={seedDemo.isPending}
            className="rounded-full"
            data-ocid="dashboard.seed_button"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {seedDemo.isPending ? "Preparing…" : "Load demo notebook"}
          </Button>
        }
      />

      {isError ? (
        <ErrorState
          message={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <NotebooksCard
          notebooks={notebooks}
          isLoading={isLoading}
          onCreateNotebook={() => setCreateOpen(true)}
        />
        <div className="space-y-6">
          <RecentSourcesCard
            sources={recentSources}
            isLoading={isLoading || sourcesLoading}
          />
          <RecentChatsCard
            conversations={recentConversations}
            isLoading={isLoading || chatsLoading}
          />
        </div>
      </div>

      <ProgressCard notebooks={notebooks} isLoading={isLoading} />

      <CreateNotebookDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
