import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MarkdownViewProps {
  content: string;
  className?: string;
  "data-ocid"?: string;
}

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; text: string }
  | { kind: "table"; header: string[]; rows: string[][] }
  | { kind: "divider" };

const HEADING = /^(#{1,6})\s+(.*)$/;
const UNORDERED = /^[-*+]\s+(.*)$/;
const ORDERED = /^(\d+)[.)]\s+(.*)$/;
const FENCE = /^```/;
const DIVIDER = /^(-{3,}|\*{3,}|_{3,})$/;
const TABLE_ROW = /^\|(.+)\|$/;
const TABLE_DIVIDER = /^\|[\s:|-]+\|$/;

function splitRow(line: string): string[] {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed === "") {
      index += 1;
      continue;
    }

    if (FENCE.test(trimmed)) {
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !FENCE.test(lines[index].trim())) {
        body.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ kind: "code", text: body.join("\n") });
      continue;
    }

    if (DIVIDER.test(trimmed)) {
      blocks.push({ kind: "divider" });
      index += 1;
      continue;
    }

    const heading = HEADING.exec(trimmed);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length,
        text: heading[2].trim(),
      });
      index += 1;
      continue;
    }

    if (
      TABLE_ROW.test(trimmed) &&
      index + 1 < lines.length &&
      TABLE_DIVIDER.test(lines[index + 1].trim())
    ) {
      const header = splitRow(trimmed);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && TABLE_ROW.test(lines[index].trim())) {
        rows.push(splitRow(lines[index].trim()));
        index += 1;
      }
      blocks.push({ kind: "table", header, rows });
      continue;
    }

    if (UNORDERED.test(trimmed) || ORDERED.test(trimmed)) {
      const ordered = ORDERED.test(trimmed);
      const items: string[] = [];
      while (index < lines.length) {
        const candidate = lines[index].trim();
        const match = ordered
          ? ORDERED.exec(candidate)
          : UNORDERED.exec(candidate);
        if (!match) break;
        items.push(ordered ? match[2].trim() : match[1].trim());
        index += 1;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    if (trimmed.startsWith(">")) {
      const body: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        body.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ kind: "quote", text: body.join(" ") });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const candidate = lines[index].trim();
      if (
        candidate === "" ||
        HEADING.test(candidate) ||
        FENCE.test(candidate) ||
        DIVIDER.test(candidate) ||
        UNORDERED.test(candidate) ||
        ORDERED.test(candidate) ||
        candidate.startsWith(">") ||
        TABLE_ROW.test(candidate)
      ) {
        break;
      }
      paragraph.push(candidate);
      index += 1;
    }
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

/** Derive a stable, content-based key for a parsed block. */
function blockKey(block: Block, index: number): string {
  switch (block.kind) {
    case "heading":
      return `h${block.level}-${block.text}`;
    case "paragraph":
      return `p-${block.text}`;
    case "list":
      return `l-${block.ordered ? "o" : "u"}-${block.items.join("|")}`;
    case "quote":
      return `q-${block.text}`;
    case "code":
      return `c-${block.text}`;
    case "table":
      return `t-${block.header.join("|")}-${block.rows.map((row) => row.join("|")).join("~")}`;
    case "divider":
      return `d-${index}`;
    default:
      return `b-${index}`;
  }
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|\$[^$\n]+\$)/g;
  let cursor = 0;
  let match = pattern.exec(text);
  let token = 0;

  while (match) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }
    const value = match[0];
    const key = `${keyPrefix}-i${token}`;
    token += 1;

    if (value.startsWith("**") || value.startsWith("__")) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {value.slice(2, -2)}
        </strong>,
      );
    } else if (value.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {value.slice(1, -1)}
        </code>,
      );
    } else if (value.startsWith("$")) {
      nodes.push(
        <span
          key={key}
          className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[0.9em] text-accent"
        >
          {value.slice(1, -1)}
        </span>,
      );
    } else {
      nodes.push(
        <em key={key} className="italic">
          {value.slice(1, -1)}
        </em>,
      );
    }
    cursor = match.index + value.length;
    match = pattern.exec(text);
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

/**
 * Lightweight markdown renderer for assistant answers: headings, lists,
 * tables, blockquotes, fenced code, inline emphasis, code and formulas.
 */
export function MarkdownView({
  content,
  className,
  "data-ocid": dataOcid,
}: MarkdownViewProps) {
  const blocks = parseBlocks(content);

  return (
    <div
      data-ocid={dataOcid ?? "markdown_view"}
      className={cn(
        "space-y-3 text-sm leading-relaxed text-foreground",
        className,
      )}
    >
      {blocks.map((block, blockIndex) => {
        const key = blockKey(block, blockIndex);

        if (block.kind === "heading") {
          const size =
            block.level <= 2
              ? "text-base font-semibold"
              : "text-sm font-semibold";
          return (
            <p key={key} className={cn("font-display text-foreground", size)}>
              {renderInline(block.text, key)}
            </p>
          );
        }

        if (block.kind === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={key}
              className={cn(
                "space-y-1.5 pl-5",
                block.ordered ? "list-decimal" : "list-disc",
              )}
            >
              {block.items.map((item) => (
                <li key={`${key}-item-${item}`} className="marker:text-primary">
                  {renderInline(item, `${key}-item-${item}`)}
                </li>
              ))}
            </ListTag>
          );
        }

        if (block.kind === "quote") {
          return (
            <blockquote
              key={key}
              className="border-l-2 border-primary/50 bg-secondary/60 px-3 py-2 text-muted-foreground"
            >
              {renderInline(block.text, key)}
            </blockquote>
          );
        }

        if (block.kind === "code") {
          return (
            <pre
              key={key}
              className="overflow-x-auto rounded-md border border-border bg-muted px-3 py-2.5 font-mono text-xs text-foreground"
            >
              <code>{block.text}</code>
            </pre>
          );
        }

        if (block.kind === "divider") {
          return <hr key={key} className="border-border" />;
        }

        if (block.kind === "table") {
          return (
            <div
              key={key}
              className="overflow-x-auto rounded-md border border-border"
            >
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-secondary">
                  <tr>
                    {block.header.map((cell) => (
                      <th
                        key={`${key}-h-${cell}`}
                        scope="col"
                        className="border-b border-border px-3 py-2 font-display font-semibold text-foreground"
                      >
                        {renderInline(cell, `${key}-h-${cell}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr
                      key={`${key}-r-${row.join("|")}`}
                      className="odd:bg-card even:bg-secondary/40"
                    >
                      {row.map((cell) => (
                        <td
                          key={`${key}-r-${row.join("|")}-c-${cell}`}
                          className="border-b border-border/60 px-3 py-2 align-top text-muted-foreground"
                        >
                          {renderInline(
                            cell,
                            `${key}-r-${row.join("|")}-c-${cell}`,
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={key} className="text-foreground">
            {renderInline(block.text, key)}
          </p>
        );
      })}
    </div>
  );
}
