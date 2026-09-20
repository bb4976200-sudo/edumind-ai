import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { DEMO_NOTEBOOK } from "@/lib/demoContent";
import { cn } from "@/lib/utils";
import { Route as rootRoute } from "@/routes/__root";
import { Link, createRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Layers,
  ListChecks,
  Lock,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/demo",
  component: DemoPage,
});

type DemoTab = "sources" | "notes" | "flashcards" | "quiz";

const TABS: { id: DemoTab; label: string; icon: typeof FileText }[] = [
  { id: "sources", label: "Sources", icon: FileText },
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quiz", icon: ListChecks },
];

/**
 * Public, read-only demo surface. Renders the Indian Economy demo notebook
 * from a static fixture so an unauthenticated visitor can explore it without
 * signing in. It never calls the guarded `seedDemoData` mutation and is not
 * gated by `useRequireAuth`, so it does not touch any signed-in user's data.
 */
function DemoPage() {
  const { isAuthenticated, login } = useAuth();
  const [tab, setTab] = useState<DemoTab>("sources");
  const notebook = DEMO_NOTEBOOK;

  return (
    <div className="space-y-8" data-ocid="demo.page">
      <PageHeader
        eyebrow="Demo notebook"
        title={notebook.title}
        description={notebook.description}
        actions={
          isAuthenticated ? (
            <Button asChild className="rounded-full">
              <Link to="/dashboard" data-ocid="demo.dashboard_button">
                Go to dashboard
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={login}
              className="rounded-full"
              data-ocid="demo.signin_button"
            >
              Sign in to build your own
            </Button>
          )
        }
      />

      <div
        className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/50 px-4 py-3"
        data-ocid="demo.readonly_notice"
      >
        <Lock className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Read-only preview. Sign in to create notebooks, add your own sources
          and generate study material.
        </p>
      </div>

      <section aria-labelledby="demo-chapters-heading" className="space-y-3">
        <h2
          id="demo-chapters-heading"
          className="font-display text-sm font-semibold text-foreground"
        >
          Chapters
        </h2>
        <ul className="flex flex-wrap gap-2" data-ocid="demo.chapter_list">
          {notebook.chapters.map((chapter) => (
            <li key={chapter.title}>
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 font-mono text-[11px]"
              >
                {chapter.title}
              </Badge>
            </li>
          ))}
        </ul>
      </section>

      <div
        role="tablist"
        aria-label="Demo notebook content"
        className="flex flex-wrap gap-1.5 border-b border-border pb-3"
      >
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              data-ocid={`demo.tab.${item.id}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-smooth focus-ring",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "sources" ? (
        <ul className="grid gap-5 sm:grid-cols-2" data-ocid="demo.source_list">
          {notebook.sources.map((source) => (
            <li key={source.title} className="flex">
              <Card className="flex w-full flex-col rounded-lg shadow-subtle">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <FileText className="size-4" aria-hidden="true" />
                    </span>
                    <p className="font-display text-base font-semibold text-foreground">
                      {source.title}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {source.content}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "notes" ? (
        <ul className="space-y-5" data-ocid="demo.note_list">
          {notebook.notes.map((note) => (
            <li key={note.title}>
              <Card className="rounded-lg shadow-subtle">
                <CardContent className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                      <NotebookPen className="size-4" aria-hidden="true" />
                    </span>
                    <p className="font-display text-base font-semibold text-foreground">
                      {note.title}
                    </p>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] uppercase tracking-wide"
                    >
                      {note.difficulty}
                    </Badge>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "flashcards" ? (
        <ul
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="demo.flashcard_list"
        >
          {notebook.flashcards.map((card) => (
            <li key={card.front} className="flex">
              <Card className="flex w-full flex-col rounded-lg shadow-subtle">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                    <Layers className="size-4" aria-hidden="true" />
                  </span>
                  <p className="font-display text-sm font-semibold text-foreground">
                    {card.front}
                  </p>
                  <p className="text-sm text-muted-foreground">{card.back}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "quiz" ? (
        <section className="space-y-5" data-ocid="demo.quiz_list">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
              <ListChecks className="size-4" aria-hidden="true" />
            </span>
            <h2 className="font-display text-base font-semibold text-foreground">
              {notebook.quizTitle}
            </h2>
          </div>
          <ol className="space-y-4">
            {notebook.questions.map((question, index) => (
              <li key={question.prompt}>
                <Card className="rounded-lg shadow-subtle">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {question.prompt}
                        </p>
                        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                          {question.topic}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2 pl-10">
                      {question.options.map((option, optionIndex) => (
                        <li
                          key={option}
                          className={cn(
                            "rounded-md border px-3 py-2 text-sm",
                            optionIndex === question.correctIndex
                              ? "border-primary/40 bg-primary/5 font-medium text-foreground"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                    <p className="pl-10 text-xs text-muted-foreground">
                      {question.explanation}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <div className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-6 shadow-subtle sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-foreground">
              Want this for your own material?
            </p>
            <p className="text-sm text-muted-foreground">
              Sign in to create notebooks and generate notes, flashcards and
              quizzes from your sources.
            </p>
          </div>
        </div>
        {isAuthenticated ? (
          <Button asChild className="shrink-0 rounded-full">
            <Link to="/notebooks" data-ocid="demo.create_notebook_button">
              Create a notebook
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={login}
            className="shrink-0 rounded-full"
            data-ocid="demo.cta_signin_button"
          >
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
}
