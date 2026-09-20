import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SourceSummary } from "@/types/view";
import { formatBytes, formatRelative, humanize } from "@/types/view";
import {
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  NotebookPen,
  Presentation,
  RefreshCw,
  Trash2,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SourceRowProps {
  item: SourceSummary;
  index: number;
  onOpen: (item: SourceSummary) => void;
  onDelete: (item: SourceSummary) => void;
  onRetry: (item: SourceSummary) => void;
  isRetrying: boolean;
}

const KIND_ICONS: Record<string, LucideIcon> = {
  pdf: FileText,
  docx: FileText,
  pptx: Presentation,
  text: FileText,
  note: NotebookPen,
  url: Globe,
  youtube: Youtube,
};

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ready: "default",
  processing: "secondary",
  pending: "outline",
  failed: "destructive",
};

/** One source row: identity, metadata, status and its row actions. */
export function SourceRow({
  item,
  index,
  onOpen,
  onDelete,
  onRetry,
  isRetrying,
}: SourceRowProps) {
  const { source } = item;
  const Icon = KIND_ICONS[source.kind] ?? FileText;
  const isFailed = source.status === "failed";
  const isProcessing = source.status === "processing";

  return (
    <Card
      data-ocid={`sources.row.${index + 1}`}
      className="shadow-subtle transition-smooth hover:shadow-elevated"
    >
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {source.title}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {humanize(source.kind)} · {formatBytes(source.sizeBytes)} ·{" "}
              {Number(source.pageCount)} pages · {Number(item.chunkCount)}{" "}
              chunks · {formatRelative(source.createdAt)}
            </p>
            {isFailed && source.errorMessage ? (
              <p className="mt-1.5 text-xs text-destructive">
                {source.errorMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge
            variant={STATUS_VARIANTS[source.status] ?? "secondary"}
            className="gap-1"
          >
            {isProcessing ? (
              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
            ) : null}
            {humanize(source.status)}
          </Badge>

          {isFailed ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRetry(item)}
              disabled={isRetrying}
              className="rounded-full"
              data-ocid={`sources.retry_button.${index + 1}`}
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              {isRetrying ? "Retrying…" : "Retry"}
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpen(item)}
            className="rounded-full"
            data-ocid={`sources.open_button.${index + 1}`}
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Open
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete ${source.title}`}
            onClick={() => onDelete(item)}
            className="text-muted-foreground hover:text-destructive"
            data-ocid={`sources.delete_button.${index + 1}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
