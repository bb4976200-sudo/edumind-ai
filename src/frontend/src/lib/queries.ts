import type {
  Answer,
  Conversation,
  Flashcard,
  FlashcardRequest,
  Note,
  NoteRequest,
  NotebookInput,
  NotebookUpdate,
  Quiz,
  QuizAnswer,
  QuizRequest,
  QuizResult,
  Source,
  SourceInput,
} from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { unwrapResult } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ------------------------------------------------------------------ */
/* Query keys                                                          */
/* ------------------------------------------------------------------ */

export const queryKeys = {
  notebooks: ["notebooks"] as const,
  notebook: (id: string) => ["notebook", id] as const,
  chapters: (id: string) => ["chapters", id] as const,
  sources: (id: string) => ["sources", id] as const,
  source: (id: string) => ["source", id] as const,
  conversations: (id: string) => ["conversations", id] as const,
  conversation: (id: string) => ["conversation", id] as const,
  messages: (id: string) => ["messages", id] as const,
  notes: (id: string) => ["notes", id] as const,
  note: (id: string) => ["note", id] as const,
  flashcards: (id: string) => ["flashcards", id] as const,
  quizzes: (id: string) => ["quizzes", id] as const,
  quiz: (id: string) => ["quiz", id] as const,
  progress: (id: string) => ["progress", id] as const,
  search: (term: string) => ["search", term] as const,
};

/* ------------------------------------------------------------------ */
/* Notebooks                                                           */
/* ------------------------------------------------------------------ */

export function useNotebooks() {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.notebooks,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotebooks();
    },
    enabled: ready,
  });
}

export function useNotebook(id: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.notebook(id ?? ""),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getNotebook(BigInt(id));
    },
    enabled: ready && !!id,
  });
}

export function useCreateNotebook() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NotebookInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createNotebook(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
    },
  });
}

export function useUpdateNotebook() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; update: NotebookUpdate }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateNotebook(BigInt(vars.id), vars.update);
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notebook(vars.id),
      });
    },
  });
}

export function useDeleteNotebook() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteNotebook(BigInt(id));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
    },
  });
}

export function useSeedDemoData() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.seedDemoData();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Chapters                                                            */
/* ------------------------------------------------------------------ */

export function useChapters(notebookId: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.chapters(notebookId ?? ""),
    queryFn: async () => {
      if (!actor || !notebookId) return [];
      return actor.listChapters(BigInt(notebookId));
    },
    enabled: ready && !!notebookId,
  });
}

export function useSetChapters() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { notebookId: string; titles: string[] }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setChapters(BigInt(vars.notebookId), vars.titles);
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chapters(vars.notebookId),
      });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

export function useSources(notebookId: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.sources(notebookId ?? ""),
    queryFn: async () => {
      if (!actor || !notebookId) return [];
      return actor.listSources(BigInt(notebookId));
    },
    enabled: ready && !!notebookId,
  });
}

export function useSource(id: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.source(id ?? ""),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getSource(BigInt(id));
    },
    enabled: ready && !!id,
  });
}

export function useAddSource() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SourceInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return unwrapResult<Source>(await actor.addSource(input));
    },
    onSuccess: (_data, input) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sources(input.notebookId.toString()),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
    },
  });
}

export function useProcessSource() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; notebookId: string }) => {
      if (!actor) throw new Error("Backend is not ready");
      return unwrapResult<Source>(await actor.processSource(BigInt(vars.id)));
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sources(vars.notebookId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.source(vars.id),
      });
    },
  });
}

export function useDeleteSource() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; notebookId: string }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteSource(BigInt(vars.id));
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sources(vars.notebookId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Conversations and messages                                          */
/* ------------------------------------------------------------------ */

export function useConversations(notebookId: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.conversations(notebookId ?? ""),
    queryFn: async () => {
      if (!actor || !notebookId) return [];
      return actor.listConversations(BigInt(notebookId));
    },
    enabled: ready && !!notebookId,
  });
}

export function useConversation(id: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.conversation(id ?? ""),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getConversation(BigInt(id));
    },
    enabled: ready && !!id,
  });
}

export function useMessages(conversationId: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.messages(conversationId ?? ""),
    queryFn: async () => {
      if (!actor || !conversationId) return [];
      return actor.listMessages(BigInt(conversationId));
    },
    enabled: ready && !!conversationId,
  });
}

export function useCreateConversation() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { notebookId: string; title: string }) => {
      if (!actor) throw new Error("Backend is not ready");
      return unwrapResult<Conversation>(
        await actor.createConversation(BigInt(vars.notebookId), vars.title),
      );
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations(vars.notebookId),
      });
    },
  });
}

export function useDeleteConversation() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; notebookId: string }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteConversation(BigInt(vars.id));
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations(vars.notebookId),
      });
    },
  });
}

export function useAskQuestion() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { conversationId: string; question: string }) => {
      if (!actor) throw new Error("Backend is not ready");
      return unwrapResult<Answer>(
        await actor.askQuestion(BigInt(vars.conversationId), vars.question),
      );
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages(vars.conversationId),
      });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Notes                                                               */
/* ------------------------------------------------------------------ */

export function useNotes(notebookId: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.notes(notebookId ?? ""),
    queryFn: async () => {
      if (!actor || !notebookId) return [];
      return actor.listNotes(BigInt(notebookId));
    },
    enabled: ready && !!notebookId,
  });
}

export function useNote(id: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.note(id ?? ""),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getNote(BigInt(id));
    },
    enabled: ready && !!id,
  });
}

export function useGenerateNote() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: NoteRequest) => {
      if (!actor) throw new Error("Backend is not ready");
      return unwrapResult<Note>(await actor.generateNote(request));
    },
    onSuccess: (_data, request) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notes(request.notebookId.toString()),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
    },
  });
}

export function useUpdateNote() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: string;
      notebookId: string;
      title: string | null;
      content: string | null;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateNote(BigInt(vars.id), vars.title, vars.content);
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notes(vars.notebookId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.note(vars.id) });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; notebookId: string }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteNote(BigInt(vars.id));
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notes(vars.notebookId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Flashcards                                                          */
/* ------------------------------------------------------------------ */

export function useFlashcards(notebookId: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.flashcards(notebookId ?? ""),
    queryFn: async () => {
      if (!actor || !notebookId) return [];
      return actor.listFlashcards(BigInt(notebookId));
    },
    enabled: ready && !!notebookId,
  });
}

export function useGenerateFlashcards() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: FlashcardRequest) => {
      if (!actor) throw new Error("Backend is not ready");
      return unwrapResult<Flashcard[]>(await actor.generateFlashcards(request));
    },
    onSuccess: (_data, request) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.flashcards(request.notebookId.toString()),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
    },
  });
}

export function useReviewFlashcard() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: string;
      notebookId: string;
      known: boolean;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.reviewFlashcard(BigInt(vars.id), vars.known);
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.flashcards(vars.notebookId),
      });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Quizzes                                                             */
/* ------------------------------------------------------------------ */

export function useQuizzes(notebookId: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.quizzes(notebookId ?? ""),
    queryFn: async () => {
      if (!actor || !notebookId) return [];
      return actor.listQuizzes(BigInt(notebookId));
    },
    enabled: ready && !!notebookId,
  });
}

export function useQuiz(id: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.quiz(id ?? ""),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getQuiz(BigInt(id));
    },
    enabled: ready && !!id,
  });
}

export function useGenerateQuiz() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: QuizRequest) => {
      if (!actor) throw new Error("Backend is not ready");
      return unwrapResult<Quiz>(await actor.generateQuiz(request));
    },
    onSuccess: (_data, request) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.quizzes(request.notebookId.toString()),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notebooks });
    },
  });
}

export function useSubmitQuiz() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { quizId: string; answers: QuizAnswer[] }) => {
      if (!actor) throw new Error("Backend is not ready");
      return unwrapResult<QuizResult>(
        await actor.submitQuiz(BigInt(vars.quizId), vars.answers),
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Progress and search                                                 */
/* ------------------------------------------------------------------ */

export function useProgress(notebookId: string | undefined) {
  const { actor, ready } = useBackend();
  return useQuery({
    queryKey: queryKeys.progress(notebookId ?? ""),
    queryFn: async () => {
      if (!actor || !notebookId) return null;
      return actor.getProgress(BigInt(notebookId));
    },
    enabled: ready && !!notebookId,
  });
}

export function useSearch(term: string) {
  const { actor, ready } = useBackend();
  const trimmed = term.trim();
  return useQuery({
    queryKey: queryKeys.search(trimmed),
    queryFn: async () => {
      if (!actor) return [];
      return actor.search(trimmed);
    },
    enabled: ready && trimmed.length > 0,
  });
}
