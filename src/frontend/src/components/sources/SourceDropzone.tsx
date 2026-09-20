import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CloudUpload, Link2, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface SourceDropzoneProps {
  /** Called with the accepted files once validation passes. */
  onFiles: (files: File[]) => void;
  /** Called when the user chooses to add a website or YouTube link instead. */
  onAddLink: () => void;
  /** 0–100 while an upload is in flight; `null` when idle. */
  progress: number | null;
  disabled?: boolean;
}

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".pptx", ".txt"];

/** Human-readable list of the file types the dropzone accepts. */
export const ACCEPTED_LABEL = "PDF, DOCX, PPTX or TXT";

/** True when a file's extension is one of the supported study formats. */
export function isAcceptedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((extension) => name.endsWith(extension));
}

/**
 * Drag-and-drop upload surface with a click-to-browse fallback and a secondary
 * action for adding website or YouTube links.
 */
export function SourceDropzone({
  onFiles,
  onAddLink,
  progress,
  disabled = false,
}: SourceDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isUploading = progress !== null;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    onFiles(Array.from(fileList));
  };

  return (
    <div
      data-ocid="sources.dropzone"
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled && !isUploading) setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        if (disabled || isUploading) return;
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "rounded-lg border-2 border-dashed border-border bg-card/50 px-6 py-10 text-center transition-smooth",
        isDragging && "border-primary bg-primary/5",
        (disabled || isUploading) && "opacity-70",
      )}
    >
      <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
        {isUploading ? (
          <Loader2 className="size-6 animate-spin" aria-hidden="true" />
        ) : (
          <CloudUpload className="size-6" aria-hidden="true" />
        )}
      </span>

      <h3 className="font-display text-lg font-semibold text-foreground">
        Drop your study material here
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
        {ACCEPTED_LABEL} up to 20 MB each. Everything you add is indexed into
        this notebook's knowledge base.
      </p>

      {isUploading ? (
        <div className="mx-auto mt-6 max-w-sm space-y-2">
          <Progress
            value={progress}
            className="h-1.5"
            data-ocid="sources.upload_progress"
          />
          <p className="font-mono text-xs text-muted-foreground">
            Uploading… {Math.round(progress)}%
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="rounded-full"
            data-ocid="sources.upload_button"
          >
            <Upload className="size-4" aria-hidden="true" />
            Browse files
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onAddLink}
            disabled={disabled}
            className="rounded-full"
            data-ocid="sources.add_link_button"
          >
            <Link2 className="size-4" aria-hidden="true" />
            Add a link
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS.join(",")}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
        data-ocid="sources.file_input"
      />
    </div>
  );
}
