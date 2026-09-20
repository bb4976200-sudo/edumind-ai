import { SourceRow } from "@/components/sources/SourceRow";
import type { SourceSummary } from "@/types/view";

interface SourceListProps {
  sources: SourceSummary[];
  onOpen: (item: SourceSummary) => void;
  onDelete: (item: SourceSummary) => void;
  onRetry: (item: SourceSummary) => void;
  retryingId: string | null;
}

/** Vertical list of source rows with per-row actions. */
export function SourceList({
  sources,
  onOpen,
  onDelete,
  onRetry,
  retryingId,
}: SourceListProps) {
  return (
    <ul data-ocid="sources.list" className="space-y-3">
      {sources.map((item, index) => (
        <li key={item.source.id.toString()}>
          <SourceRow
            item={item}
            index={index}
            onOpen={onOpen}
            onDelete={onDelete}
            onRetry={onRetry}
            isRetrying={retryingId === item.source.id.toString()}
          />
        </li>
      ))}
    </ul>
  );
}
