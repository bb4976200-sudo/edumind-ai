import { Difficulty, StudyMaterialKind } from "@/backend";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useState } from "react";

/** Output formats offered by the note generator. */
export const NOTE_KINDS = [
  { value: StudyMaterialKind.summary, label: "Short notes" },
  { value: StudyMaterialKind.detailedNotes, label: "Detailed notes" },
] as const;

/** Depth levels offered by the note generator. */
export const NOTE_DIFFICULTIES = [
  { value: Difficulty.beginner, label: "Beginner" },
  { value: Difficulty.intermediate, label: "Intermediate" },
  { value: Difficulty.advanced, label: "Advanced" },
  { value: Difficulty.exam, label: "Exam level" },
] as const;

export interface NoteGeneratorValues {
  kind: StudyMaterialKind;
  difficulty: Difficulty;
  chapter: string;
  sourceId: string;
}

interface NoteGeneratorFormProps {
  sources: { id: string; title: string }[];
  chapters: string[];
  isPending: boolean;
  onSubmit: (values: NoteGeneratorValues) => void;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Generator form for study notes: subject chapter, source, depth and output
 * format. Owns its own draft state and hands a complete request to the caller.
 */
export function NoteGeneratorForm({
  sources,
  chapters,
  isPending,
  onSubmit,
  className,
  "data-ocid": dataOcid,
}: NoteGeneratorFormProps) {
  const [kind, setKind] = useState<string>(StudyMaterialKind.summary);
  const [difficulty, setDifficulty] = useState<string>(Difficulty.intermediate);
  const [chapter, setChapter] = useState<string>("");
  const [sourceId, setSourceId] = useState<string>("all");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      kind: kind as StudyMaterialKind,
      difficulty: difficulty as Difficulty,
      chapter,
      sourceId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid={dataOcid ?? "notes.generator_form"}
      className={cn(
        "space-y-5 rounded-lg border border-border bg-card p-5 shadow-subtle sm:p-6",
        className,
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="note-chapter">Chapter</Label>
          <Select value={chapter} onValueChange={setChapter}>
            <SelectTrigger id="note-chapter" data-ocid="notes.chapter_select">
              <SelectValue placeholder="Whole notebook" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Whole notebook</SelectItem>
              {chapters.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note-source">Source</Label>
          <Select value={sourceId} onValueChange={setSourceId}>
            <SelectTrigger id="note-source" data-ocid="notes.source_select">
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {sources.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note-difficulty">Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger
              id="note-difficulty"
              data-ocid="notes.difficulty_select"
            >
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {NOTE_DIFFICULTIES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note-kind">Output type</Label>
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger id="note-kind" data-ocid="notes.kind_select">
              <SelectValue placeholder="Select output type" />
            </SelectTrigger>
            <SelectContent>
              {NOTE_KINDS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Notes are saved to this notebook and stay editable afterwards.
        </p>
        <Button
          type="submit"
          disabled={isPending}
          data-ocid="notes.generate_button"
          className="w-full rounded-full sm:w-auto"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {isPending ? "Generating…" : "Generate notes"}
        </Button>
      </div>
    </form>
  );
}
