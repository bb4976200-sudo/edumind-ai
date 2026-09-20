import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  isSearching?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  "data-ocid"?: string;
}

/**
 * The single search field used by the global search surface and the command
 * palette. Owns no state — the caller owns the query so it can drive results.
 */
export function SearchInput({
  value,
  onChange,
  onSubmit,
  isSearching = false,
  autoFocus = false,
  placeholder = "Search your notebooks, sources and generated content…",
  className,
  "data-ocid": dataOcid,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className={cn("relative", className)}
    >
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search your notebooks, sources and generated content"
        autoComplete="off"
        spellCheck={false}
        className="h-12 pl-10 pr-24 text-base [&::-webkit-search-cancel-button]:hidden"
        data-ocid={dataOcid ?? "search.input"}
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {isSearching ? (
          <Loader2
            className="size-4 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
        {value.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            data-ocid="search.clear_button"
            className="size-8 text-muted-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    </form>
  );
}
