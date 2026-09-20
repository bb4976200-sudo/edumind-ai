import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SourceSummary } from "@/types/view";
import { formatRelative, humanize } from "@/types/view";
import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Upload } from "lucide-react";

interface RecentSourcesCardProps {
  sources: SourceSummary[];
  isLoading: boolean;
}

/** Dashboard card listing the most recently added sources across notebooks. */
export function RecentSourcesCard({
  sources,
  isLoading,
}: RecentSourcesCardProps) {
  return (
    <Card data-ocid="dashboard.sources.card" className="shadow-subtle">
      <CardHeader>
        <CardTitle className="font-display text-base">Recent Sources</CardTitle>
        <CardDescription>
          The latest material you added to your notebooks.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <LoadingSkeleton variant="list" count={3} />
        ) : sources.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No sources yet"
            description="Add a PDF, link or pasted text to a notebook and it will appear here."
            action={
              <Button asChild className="rounded-full">
                <Link to="/sources" data-ocid="dashboard.sources.empty_link">
                  <Upload className="size-4" aria-hidden="true" />
                  Upload sources
                </Link>
              </Button>
            }
          />
        ) : (
          <ul data-ocid="dashboard.sources.list" className="space-y-3">
            {sources.map((item, index) => (
              <li key={item.source.id.toString()}>
                <Link
                  to="/notebooks/$notebookId"
                  params={{ notebookId: item.source.notebookId.toString() }}
                  data-ocid={`dashboard.sources.item.${index + 1}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-background/60 px-4 py-3.5 transition-smooth hover:border-primary/40 hover:bg-secondary/60 focus-ring"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-foreground">
                      {item.source.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline">
                        {humanize(item.source.kind)}
                      </Badge>
                      <Badge variant="secondary">
                        {humanize(item.source.status)}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {Number(item.chunkCount)} chunks
                      </span>
                    </div>
                  </div>

                  <div className="hidden shrink-0 items-center gap-2 sm:flex">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {formatRelative(item.source.createdAt)}
                    </span>
                    <ArrowRight
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
