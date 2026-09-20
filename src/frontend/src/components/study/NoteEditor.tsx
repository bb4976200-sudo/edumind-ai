import type { Note } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatRelative, humanize } from "@/types/view";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Highlighter,
  RefreshCw,
  Save,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface NoteEditorProps {
  note: Note;
  isSaving: boolean;
  isRegenerating: boolean;
  onSave: (values: { title: string; content: string }) => void;
  onRegenerateSection: (sectionTitle: string) => void;
  className?: string;
  "data-ocid"?: string;
}

interface Section {
  title: string;
  body: string;
}

/** Split a note body into `## Heading` sections, keeping any preamble. */
function splitSections(content: string): Section[] {
  const lines = content.split("\n");
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    const heading = /^#{1,3}\s+(.*)$/.exec(line.trim());
    if (heading) {
      if (current) sections.push(current);
      current = { title: heading[1].trim(), body: "" };
    } else if (current) {
      current.body += `${line}\n`;
    } else {
      current = { title: "Overview", body: `${line}\n` };
    }
  }
  if (current) sections.push(current);

  return sections
    .map((section) => ({ ...section, body: section.body.trim() }))
    .filter((section) => section.title.length > 0 || section.body.length > 0);
}

/** Wrap every case-insensitive occurrence of `term` in a mark element. */
function highlightMatches(text: string, term: string) {
  if (!term) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  let offset = 0;
  return parts.map((part) => {
    const key = `${offset}-${part}`;
    offset += part.length;
    return part.toLowerCase() === term.toLowerCase() ? (
      <mark key={key} className="rounded bg-warning/30 px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    );
  });
}

/**
 * Editable document surface for a generated note. Owns the draft, auto-saves
 * after a pause in typing, and supports in-document search, highlight, copy
 * and per-section regeneration.
 */
export function NoteEditor({
  note,
  isSaving,
  isRegenerating,
  onSave,
  onRegenerateSection,
  className,
  "data-ocid": dataOcid,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(false);
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const noteId = note.id.toString();
  const lastSaved = useRef({ title: note.title, content: note.content });

  // Re-initialize the draft only when a different note is opened.
  // biome-ignore lint/correctness/useExhaustiveDependencies: noteId is the identity that resets the draft
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setQuery("");
    setHighlight(false);
    setCollapsed({});
    setSavedAt(null);
    lastSaved.current = { title: note.title, content: note.content };
  }, [noteId, note.title, note.content]);

  // Auto-save the draft after a pause in typing.
  useEffect(() => {
    if (
      title === lastSaved.current.title &&
      content === lastSaved.current.content
    ) {
      return;
    }
    const timer = window.setTimeout(() => {
      lastSaved.current = { title, content };
      onSave({ title, content });
      setSavedAt(new Date().toLocaleTimeString());
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [title, content, onSave]);

  const sections = useMemo(() => splitSections(content), [content]);
  const matchCount = useMemo(() => {
    if (!query.trim()) return 0;
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return (content.match(new RegExp(escaped, "gi")) ?? []).length;
  }, [content, query]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${content}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSaveNow = () => {
    lastSaved.current = { title, content };
    onSave({ title, content });
    setSavedAt(new Date().toLocaleTimeString());
  };

  return (
    <article
      data-ocid={dataOcid ?? "notes.editor"}
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card shadow-subtle",
        className,
      )}
    >
      <header className="space-y-4 border-b border-border p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{humanize(note.kind)}</Badge>
          <Badge variant="outline">{humanize(note.difficulty)}</Badge>
          <span className="font-mono text-[11px] text-muted-foreground">
            Updated {formatRelative(note.updatedAt)}
          </span>
        </div>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-label="Note title"
          data-ocid="notes.title_input"
          className="w-full rounded-md border border-transparent bg-transparent font-display text-xl font-semibold text-foreground transition-smooth hover:border-border focus:border-input focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-2xl"
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search in document"
              aria-label="Search in document"
              data-ocid="notes.search_input"
              className="pl-9 pr-9"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                data-ocid="notes.clear_search_button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-smooth hover:text-foreground focus-ring"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {query ? (
              <span
                data-ocid="notes.search_count"
                className="font-mono text-xs text-muted-foreground"
              >
                {matchCount} {matchCount === 1 ? "match" : "matches"}
              </span>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant={highlight ? "default" : "outline"}
              aria-pressed={highlight}
              onClick={() => setHighlight((prev) => !prev)}
              data-ocid="notes.highlight_button"
              className="rounded-full"
            >
              <Highlighter className="size-4" aria-hidden="true" />
              Highlight
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void handleCopy()}
              data-ocid="notes.copy_button"
              className="rounded-full"
            >
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveNow}
              disabled={isSaving}
              data-ocid="notes.save_button"
              className="rounded-full"
            >
              <Save className="size-4" aria-hidden="true" />
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        <p
          aria-live="polite"
          data-ocid="notes.autosave_status"
          className="font-mono text-[11px] text-muted-foreground"
        >
          {isSaving
            ? "Auto-saving…"
            : savedAt
              ? `Auto-saved at ${savedAt}`
              : "Changes save automatically"}
        </p>
      </header>

      <div className="space-y-4 p-5">
        {sections.map((section, index) => {
          const isCollapsed = collapsed[section.title] ?? false;
          return (
            <section
              key={section.title}
              data-ocid={`notes.section.${index + 1}`}
              className="rounded-md border border-border bg-background/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  {highlight && query
                    ? highlightMatches(section.title, query)
                    : section.title}
                </h3>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Regenerate ${section.title}`}
                    disabled={isRegenerating}
                    onClick={() => onRegenerateSection(section.title)}
                    data-ocid={`notes.regenerate_button.${index + 1}`}
                    className="size-8 text-muted-foreground"
                  >
                    <RefreshCw
                      className={cn(
                        "size-3.5",
                        isRegenerating && "animate-spin",
                      )}
                      aria-hidden="true"
                    />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={
                      isCollapsed
                        ? `Expand ${section.title}`
                        : `Collapse ${section.title}`
                    }
                    aria-expanded={!isCollapsed}
                    onClick={() =>
                      setCollapsed((prev) => ({
                        ...prev,
                        [section.title]: !isCollapsed,
                      }))
                    }
                    data-ocid={`notes.collapse_button.${index + 1}`}
                    className="size-8 text-muted-foreground"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="size-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronUp className="size-3.5" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
              {isCollapsed ? null : (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {highlight && query
                    ? highlightMatches(section.body, query)
                    : section.body}
                </p>
              )}
            </section>
          );
        })}
      </div>

      <Separator />

      <footer className="space-y-2 p-5">
        <label
          htmlFor="note-raw-content"
          className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
        >
          Edit source
        </label>
        <Textarea
          id="note-raw-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={8}
          aria-label="Note content"
          data-ocid="notes.content_textarea"
          className="font-mono text-xs leading-relaxed"
        />
      </footer>
    </article>
  );
}
