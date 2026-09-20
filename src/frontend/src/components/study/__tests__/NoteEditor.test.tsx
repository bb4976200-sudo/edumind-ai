import { Difficulty, StudyMaterialKind } from "@/backend";
import type { Note } from "@/backend";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NoteEditor } from "@/components/study/NoteEditor";

const NOTE: Note = {
  id: 1n,
  title: "Monetary Policy — Detailed Notes",
  content: "## Overview\n\nThe RBI manages money supply.",
  owner: undefined as never,
  kind: StudyMaterialKind.detailedNotes,
  difficulty: Difficulty.intermediate,
  createdAt: 0n,
  updatedAt: 0n,
  notebookId: 1n,
};

describe("NoteEditor", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("auto-saves an edited note after a pause in typing", () => {
    const onSave = vi.fn();
    render(
      <NoteEditor
        note={NOTE}
        isSaving={false}
        isRegenerating={false}
        onSave={onSave}
        onRegenerateSection={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Note content"), {
      target: { value: "## Overview\n\nUpdated content." },
    });

    expect(onSave).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1300);
    });
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ content: "## Overview\n\nUpdated content." }),
    );
  });

  it("saves immediately when the Save button is pressed", () => {
    const onSave = vi.fn();
    render(
      <NoteEditor
        note={NOTE}
        isSaving={false}
        isRegenerating={false}
        onSave={onSave}
        onRegenerateSection={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /^Save$/i }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
