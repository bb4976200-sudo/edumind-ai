import { PocketIc } from "@dfinity/pic";
import { Principal } from "@icp-sdk/core/principal";
import { afterAll, beforeAll, expect, it } from "vitest";

import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";
import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

const alice = Principal.fromText("aaaaa-aa");
const bob = Principal.fromText("2vxsx-fae");

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers empty-state reads instead of trapping", async () => {
  actor.setPrincipal(alice);
  await expect(actor.listNotebooks()).resolves.toEqual([]);
  await expect(actor.search("inflation")).resolves.toEqual([]);
  await expect(actor.getProgress(1n)).resolves.toEqual([]);
  await expect(actor.getNotebook(1n)).resolves.toEqual([]);
});

it("round-trips a notebook through the real canister", async () => {
  actor.setPrincipal(alice);
  const notebook = await actor.createNotebook({
    title: "Round-trip notebook",
    description: "Demo notebook",
  });
  expect(notebook.title).toBe("Round-trip notebook");

  const listed = await actor.listNotebooks();
  expect(listed).toHaveLength(1);
  expect(listed[0].notebook.title).toBe("Round-trip notebook");
  expect(listed[0].sourceCount).toBe(0n);
});

it("moves a source from pending to ready and lists it", async () => {
  actor.setPrincipal(alice);
  const notebook = await actor.createNotebook({
    title: "Sources notebook",
    description: "",
  });

  const added = await actor.addSource({
    notebookId: notebook.id,
    title: "Monetary Policy — RBI Framework",
    content: "The RBI targets consumer price inflation of 4 percent.",
    kind: { note: null },
    url: "",
    storageKey: "",
    sizeBytes: 0n,
  });
  expect("ok" in added).toBe(true);
  if (!("ok" in added)) return;
  expect(added.ok.status).toEqual({ pending: null });

  const processed = await actor.processSource(added.ok.id);
  expect("ok" in processed).toBe(true);
  if (!("ok" in processed)) return;
  expect(processed.ok.status).toEqual({ ready: null });

  const sources = await actor.listSources(notebook.id);
  expect(sources).toHaveLength(1);
  expect(sources[0].source.status).toEqual({ ready: null });
});

it("answers a question with a citation and generates study material", async () => {
  actor.setPrincipal(alice);
  const notebook = await actor.createNotebook({
    title: "Monetary Policy notebook",
    description: "",
  });
  const added = await actor.addSource({
    notebookId: notebook.id,
    title: "Monetary Policy — RBI Framework",
    content:
      "Monetary policy is conducted by the Reserve Bank of India. The committee targets consumer price inflation of 4 percent.",
    kind: { note: null },
    url: "",
    storageKey: "",
    sizeBytes: 0n,
  });
  if (!("ok" in added)) throw new Error("addSource failed");
  await actor.processSource(added.ok.id);

  const conversation = await actor.createConversation(
    notebook.id,
    "Monetary policy",
  );
  expect("ok" in conversation).toBe(true);
  if (!("ok" in conversation)) return;

  const answer = await actor.askQuestion(
    conversation.ok.id,
    "Explain monetary policy in simple language.",
  );
  expect("ok" in answer).toBe(true);
  if (!("ok" in answer)) return;
  expect(answer.ok.assistantMessage.content.length).toBeGreaterThan(0);
  expect(answer.ok.assistantMessage.citations.length).toBeGreaterThan(0);

  const note = await actor.generateNote({
    notebookId: notebook.id,
    kind: { detailedNotes: null },
    difficulty: { intermediate: null },
    chapter: ["Monetary Policy"],
    sourceId: [],
  });
  expect("ok" in note).toBe(true);

  const flashcards = await actor.generateFlashcards({
    notebookId: notebook.id,
    difficulty: { intermediate: null },
    count: 5n,
    sourceId: [],
  });
  expect("ok" in flashcards).toBe(true);
  if (!("ok" in flashcards)) return;
  expect(flashcards.ok.length).toBeGreaterThan(0);

  const reviewed = await actor.reviewFlashcard(flashcards.ok[0].id, true);
  expect(reviewed).toHaveLength(1);
  expect(reviewed[0]?.knownCount).toBe(1n);

  const quiz = await actor.generateQuiz({
    notebookId: notebook.id,
    difficulty: { medium: null },
    count: 5n,
    kinds: [{ mcq: null }],
    sourceId: [],
  });
  expect("ok" in quiz).toBe(true);
  if (!("ok" in quiz)) return;

  const fetched = await actor.getQuiz(quiz.ok.id);
  expect(fetched).toHaveLength(1);
  if (fetched.length === 0) return;
  const [quizView, questions] = fetched[0];
  expect(quizView.title.length).toBeGreaterThan(0);
  expect(questions.length).toBeGreaterThan(0);

  const graded = await actor.submitQuiz(
    quiz.ok.id,
    questions.map((question) => ({
      questionId: question.id,
      selectedIndex: 0n,
    })),
  );
  expect("ok" in graded).toBe(true);
  if (!("ok" in graded)) return;
  expect(graded.ok.total).toBe(BigInt(questions.length));
  expect(graded.ok.items.length).toBe(questions.length);
});

it("seeds the Indian Economy demo notebook with chapters and material", async () => {
  actor.setPrincipal(alice);
  const notebook = await actor.seedDemoData();
  expect(notebook.title).toBe("Indian Economy");

  const chapters = await actor.listChapters(notebook.id);
  expect(chapters.length).toBe(5);

  const sources = await actor.listSources(notebook.id);
  expect(sources.length).toBeGreaterThan(0);

  const notes = await actor.listNotes(notebook.id);
  expect(notes.length).toBeGreaterThan(0);

  const flashcards = await actor.listFlashcards(notebook.id);
  expect(flashcards.length).toBeGreaterThan(0);

  const quizzes = await actor.listQuizzes(notebook.id);
  expect(quizzes.length).toBeGreaterThan(0);

  const hits = await actor.search("inflation");
  expect(hits.length).toBeGreaterThan(0);
});

it("does not show one caller's notebooks to another", async () => {
  actor.setPrincipal(alice);
  await actor.createNotebook({ title: "Alice private", description: "" });
  const aliceNotebooks = await actor.listNotebooks();
  expect(aliceNotebooks.length).toBeGreaterThan(0);

  actor.setPrincipal(bob);
  const bobNotebooks = await actor.listNotebooks();
  expect(bobNotebooks).toEqual([]);

  const bobSearch = await actor.search("inflation");
  expect(bobSearch).toEqual([]);
});
