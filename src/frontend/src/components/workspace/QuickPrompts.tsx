import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface QuickPrompt {
  label: string;
  prompt: string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: "Explain like I'm a beginner",
    prompt: "Explain this like I am a beginner",
  },
  { label: "Make UPSC-level notes", prompt: "Make UPSC-level notes" },
  { label: "Create 20 MCQs", prompt: "Create 20 MCQs" },
  { label: "7-day revision plan", prompt: "Give me a 7-day revision plan" },
  {
    label: "Most important concepts",
    prompt: "Find the most important concepts",
  },
  {
    label: "Convert to Cornell Notes",
    prompt: "Convert this chapter into Cornell Notes",
  },
];

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
  "data-ocid"?: string;
}

/** One-tap study prompts shown before the first question is asked. */
export function QuickPrompts({
  onSelect,
  disabled = false,
  className,
  "data-ocid": dataOcid,
}: QuickPromptsProps) {
  return (
    <div
      data-ocid={dataOcid ?? "chat.quick_prompts"}
      className={cn("space-y-3", className)}
    >
      <p className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
        Quick prompts
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((item, index) => (
          <button
            key={item.prompt}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.prompt)}
            data-ocid={`chat.quick_prompt.${index + 1}`}
            className="rounded-full border border-border bg-card px-3.5 py-2 text-left text-xs font-medium text-foreground transition-smooth hover:border-primary/40 hover:bg-secondary focus-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
