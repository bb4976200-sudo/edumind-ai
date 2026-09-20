import type {
  Chapter,
  Citation,
  Conversation,
  ConversationSummary,
  Flashcard,
  Message,
  Note,
  Notebook,
  NotebookSummary,
  Quiz,
  QuizQuestionView,
  QuizResult,
  SearchHit,
  Source,
  SourceSummary,
  StudyProgress,
} from "@/backend";

export type {
  Chapter,
  Citation,
  Conversation,
  ConversationSummary,
  Flashcard,
  Message,
  Note,
  Notebook,
  NotebookSummary,
  Quiz,
  QuizQuestionView,
  QuizResult,
  SearchHit,
  Source,
  SourceSummary,
  StudyProgress,
};

/** A notebook plus the aggregate counts the dashboard renders. */
export interface NotebookCardData {
  notebook: Notebook;
  sourceCount: bigint;
  noteCount: bigint;
  flashcardCount: bigint;
  quizCount: bigint;
  conversationCount: bigint;
}

/** A source plus its chunk count, flattened for list rendering. */
export interface SourceRowData {
  source: Source;
  chunkCount: bigint;
}

/** A conversation plus its message count. */
export interface ConversationRowData {
  conversation: Conversation;
  messageCount: number;
}

/** Normalized search result used by the global search surface. */
export interface SearchResultItem {
  id: string;
  title: string;
  kind: string;
  snippet: string;
  notebookId: string;
}

/** A single graded quiz answer, flattened for the results view. */
export interface QuizResultRow {
  questionId: string;
  prompt: string;
  topic: string;
  correct: boolean;
  correctIndex: number;
  selectedIndex: number;
  explanation: string;
}

/** Aggregate progress numbers with bigint values converted to numbers. */
export interface ProgressView {
  questionsAnswered: number;
  questionsCorrect: number;
  quizzesTaken: number;
  flashcardsReviewed: number;
  notesGenerated: number;
  lastActivityAt: Date | null;
  accuracy: number;
}

/** Convert a Motoko nanosecond timestamp into a JS Date. */
export function timestampToDate(timestamp: bigint | undefined): Date | null {
  if (timestamp === undefined) return null;
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a backend timestamp as a short, human-readable date. */
export function formatDate(timestamp: bigint | undefined): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format a backend timestamp as a relative "time ago" label. */
export function formatRelative(timestamp: bigint | undefined): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(timestamp);
}

/** Format a byte count as a compact size label. */
export function formatBytes(bytes: bigint): string {
  const value = Number(bytes);
  if (value <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1,
  );
  const scaled = value / 1024 ** exponent;
  return `${scaled.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/** Turn a backend enum-ish string into a readable label. */
export function humanize(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase());
}

/** Convert a bigint id into a stable string key. */
export function idKey(id: bigint): string {
  return id.toString();
}
