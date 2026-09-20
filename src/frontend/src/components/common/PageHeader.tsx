import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
  "data-ocid"?: string;
}

/** Consistent page title block with optional eyebrow and action slot. */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
  "data-ocid": dataOcid,
}: PageHeaderProps) {
  return (
    <header
      data-ocid={dataOcid ?? "page_header"}
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 font-mono text-xs font-medium uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
