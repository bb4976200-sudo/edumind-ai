import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  "data-ocid"?: string;
}

/** Inline error surface with an optional retry action. */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
  "data-ocid": dataOcid,
}: ErrorStateProps) {
  return (
    <div
      data-ocid={dataOcid ?? "error_state"}
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-destructive"
          aria-hidden="true"
        />
        <div>
          <p className="font-display text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          data-ocid="error_state.retry_button"
        >
          <RotateCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
