import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Upload } from "lucide-react";
import type { ReactNode } from "react";

interface DashboardHeroProps {
  /** Opens the create-notebook dialog owned by the dashboard route. */
  onCreateNotebook: () => void;
  /** Total notebooks, used for the contextual sub-line. */
  notebookCount: number;
  /** Rendered in the action row, e.g. the demo-data button. */
  extraActions?: ReactNode;
}

/**
 * Editorial hero for the dashboard: the product promise, the two primary
 * actions, and a quiet stat line that grounds the page in the user's data.
 */
export function DashboardHero({
  onCreateNotebook,
  notebookCount,
  extraActions,
}: DashboardHeroProps) {
  return (
    <section
      data-ocid="dashboard.hero"
      className="relative overflow-hidden rounded-lg border border-border gradient-subtle px-6 py-10 shadow-subtle sm:px-10 sm:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" aria-hidden="true" />
          AI study workspace
        </span>

        <h1 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Turn your study material into your{" "}
          <span className="text-gradient-primary">personal AI classroom.</span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Upload your notes, PDFs and links, then ask questions, generate study
          notes, drill flashcards and test yourself — all grounded in the
          sources you choose.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={onCreateNotebook}
            data-ocid="dashboard.hero.create_button"
            className="rounded-full"
          >
            Create New Notebook
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full bg-card/70"
          >
            <Link to="/sources" data-ocid="dashboard.hero.upload_button">
              <Upload className="size-4" aria-hidden="true" />
              Upload Sources
            </Link>
          </Button>
          {extraActions}
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {notebookCount === 0
            ? "No notebooks yet — create one to begin."
            : `${notebookCount} notebook${notebookCount === 1 ? "" : "s"} in your workspace`}
        </p>
      </div>
    </section>
  );
}
