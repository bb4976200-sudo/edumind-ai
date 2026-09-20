import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: "cards" | "list" | "detail";
  count?: number;
  className?: string;
  "data-ocid"?: string;
}

/** Layout-matched loading placeholders for cards, lists and detail views. */
export function LoadingSkeleton({
  variant = "cards",
  count = 6,
  className,
  "data-ocid": dataOcid,
}: LoadingSkeletonProps) {
  const ids = Array.from({ length: count }, (_, i) => `skeleton-${i}`);

  if (variant === "list") {
    return (
      <div
        data-ocid={dataOcid ?? "loading_state"}
        className={cn("space-y-3", className)}
        aria-busy="true"
        aria-live="polite"
      >
        {ids.map((id) => (
          <div
            key={id}
            className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4"
          >
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div
        data-ocid={dataOcid ?? "loading_state"}
        className={cn("space-y-6", className)}
        aria-busy="true"
        aria-live="polite"
      >
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ids.slice(0, 4).map((id) => (
            <Skeleton key={id} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div
      data-ocid={dataOcid ?? "loading_state"}
      className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}
      aria-busy="true"
      aria-live="polite"
    >
      {ids.map((id) => (
        <Card key={id} className="shadow-subtle">
          <CardHeader className="space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-3 w-5/6" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
