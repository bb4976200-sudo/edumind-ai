import { PageHeader } from "@/components/common/PageHeader";
import { StudyHub } from "@/components/study/StudyHub";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/useAuth";
import { Route as rootRoute } from "@/routes/__root";
import { Link, createRoute } from "@tanstack/react-router";
import { BrainCircuit, MessageSquarePlus } from "lucide-react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/study",
  validateSearch: (
    search: Record<string, unknown>,
  ): { notebookId?: string } => ({
    notebookId:
      typeof search.notebookId === "string" ? search.notebookId : undefined,
  }),
  component: StudyPage,
});

function StudyPage() {
  const authenticated = useRequireAuth();

  if (!authenticated) {
    return <StudySkeleton />;
  }

  return (
    <div className="space-y-8" data-ocid="study.page">
      <PageHeader
        eyebrow="AI Study"
        title="Study hub"
        description="Your notebooks and everything generated from them — notes, flashcards, quizzes and study sessions — with a quick way into each."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/library" data-ocid="study.library_link">
                <BrainCircuit className="size-4" aria-hidden="true" />
                Browse library
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/study" data-ocid="study.new_session_button">
                <MessageSquarePlus className="size-4" aria-hidden="true" />
                New session
              </Link>
            </Button>
          </>
        }
      />

      <StudyHub data-ocid="study.hub" />
    </div>
  );
}

function StudySkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse-soft rounded bg-muted" />
        <div className="h-8 w-64 animate-pulse-soft rounded bg-muted" />
        <div className="h-4 w-full max-w-xl animate-pulse-soft rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => `study-skeleton-${i}`).map(
          (id) => (
            <div
              key={id}
              className="h-36 animate-pulse-soft rounded-lg border border-border bg-card"
            />
          ),
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => `study-action-${i}`).map((id) => (
          <div
            key={id}
            className="h-40 animate-pulse-soft rounded-lg border border-border bg-card"
          />
        ))}
      </div>
    </div>
  );
}
