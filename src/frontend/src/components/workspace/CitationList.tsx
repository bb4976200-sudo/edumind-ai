import type { Citation } from "@/types/view";
import { Quote } from "lucide-react";

interface CitationListProps {
  citations: Citation[];
  "data-ocid"?: string;
}

/** Inline source citations attached to an assistant answer. */
export function CitationList({
  citations,
  "data-ocid": dataOcid,
}: CitationListProps) {
  if (citations.length === 0) return null;

  return (
    <div
      data-ocid={dataOcid ?? "chat.citations"}
      className="mt-3 border-t border-border/60 pt-3"
    >
      <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Sources
      </p>
      <ul className="space-y-2">
        {citations.map((citation, index) => (
          <li
            key={`${citation.sourceId.toString()}-${index}`}
            data-ocid={`chat.citation.${index + 1}`}
            className="flex gap-2 rounded-md bg-background/60 px-2.5 py-2"
          >
            <Quote
              className="mt-0.5 size-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium text-foreground">
                {citation.sourceTitle}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                {citation.snippet}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
