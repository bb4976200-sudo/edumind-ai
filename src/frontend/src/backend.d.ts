import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Answer {
    assistantMessage: Message;
    userMessage: Message;
    conversationId: ConversationId;
}
export type AppError = {
    __kind__: "notAuthorized";
    notAuthorized: null;
} | {
    __kind__: "unsupportedSourceKind";
    unsupportedSourceKind: string;
} | {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "notFound";
    notFound: string;
} | {
    __kind__: "engineUnavailable";
    engineUnavailable: string;
} | {
    __kind__: "sourceTooLarge";
    sourceTooLarge: string;
};
export interface Cell {
    value: Value;
    name: string;
}
export interface Chapter {
    id: bigint;
    title: string;
    order: bigint;
    notebookId: NotebookId;
}
export interface Citation {
    sourceTitle: string;
    sourceId: SourceId;
    snippet: string;
}
export interface Conversation {
    id: ConversationId;
    title: string;
    owner: UserId;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    notebookId: NotebookId;
}
export type ConversationId = bigint;
export interface ConversationSummary {
    conversation: Conversation;
    messageCount: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Flashcard {
    id: FlashcardId;
    front: string;
    owner: UserId;
    back: string;
    createdAt: Timestamp;
    reviewCount: bigint;
    notebookId: NotebookId;
    lastReviewedAt?: Timestamp;
    knownCount: bigint;
}
export type FlashcardId = bigint;
export interface FlashcardRequest {
    difficulty: Difficulty;
    count: bigint;
    sourceId?: SourceId;
    notebookId: NotebookId;
}
export interface Message {
    id: MessageId;
    content: string;
    owner: UserId;
    createdAt: Timestamp;
    role: MessageRole;
    conversationId: ConversationId;
    citations: Array<Citation>;
    notebookId: NotebookId;
}
export type MessageId = bigint;
export interface Note {
    id: NoteId;
    title: string;
    content: string;
    owner: UserId;
    kind: StudyMaterialKind;
    difficulty: Difficulty;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    notebookId: NotebookId;
}
export type NoteId = bigint;
export interface NoteRequest {
    kind: StudyMaterialKind;
    difficulty: Difficulty;
    sourceId?: SourceId;
    notebookId: NotebookId;
    chapter?: string;
}
export interface Notebook {
    id: NotebookId;
    title: string;
    owner: UserId;
    createdAt: Timestamp;
    description: string;
    updatedAt: Timestamp;
}
export type NotebookId = bigint;
export interface NotebookInput {
    title: string;
    description: string;
}
export interface NotebookSummary {
    conversationCount: bigint;
    notebook: Notebook;
    sourceCount: bigint;
    flashcardCount: bigint;
    noteCount: bigint;
    quizCount: bigint;
}
export interface NotebookUpdate {
    title?: string;
    description?: string;
}
export type ProgressId = bigint;
export type QuestionId = bigint;
export interface Quiz {
    id: QuizId;
    title: string;
    owner: UserId;
    difficulty: QuizDifficulty;
    createdAt: Timestamp;
    notebookId: NotebookId;
}
export interface QuizAnswer {
    questionId: QuestionId;
    selectedIndex: bigint;
}
export type QuizId = bigint;
export interface QuizQuestionView {
    id: QuestionId;
    topic: string;
    kind: QuestionKind;
    prompt: string;
    options: Array<string>;
}
export interface QuizRequest {
    difficulty: QuizDifficulty;
    count: bigint;
    sourceId?: SourceId;
    notebookId: NotebookId;
    kinds: Array<QuestionKind>;
}
export interface QuizResult {
    wrongCount: bigint;
    total: bigint;
    weakTopics: Array<string>;
    score: bigint;
    items: Array<QuizResultItem>;
    correctCount: bigint;
    quizId: QuizId;
    recommendedRevision: Array<string>;
}
export interface QuizResultItem {
    topic: string;
    correctIndex: bigint;
    explanation: string;
    correct: boolean;
    questionId: QuestionId;
    selectedIndex: bigint;
    prompt: string;
}
export type Result = {
    __kind__: "ok";
    ok: QuizResult;
} | {
    __kind__: "err";
    err: AppError;
};
export type Result_1 = {
    __kind__: "ok";
    ok: Source;
} | {
    __kind__: "err";
    err: AppError;
};
export type Result_2 = {
    __kind__: "ok";
    ok: Quiz;
} | {
    __kind__: "err";
    err: AppError;
};
export type Result_3 = {
    __kind__: "ok";
    ok: Note;
} | {
    __kind__: "err";
    err: AppError;
};
export type Result_4 = {
    __kind__: "ok";
    ok: Array<Flashcard>;
} | {
    __kind__: "err";
    err: AppError;
};
export type Result_5 = {
    __kind__: "ok";
    ok: Conversation;
} | {
    __kind__: "err";
    err: AppError;
};
export type Result_6 = {
    __kind__: "ok";
    ok: Answer;
} | {
    __kind__: "err";
    err: AppError;
};
export interface Result__1 {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__2 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface SearchHit {
    id: bigint;
    title: string;
    kind: string;
    snippet: string;
    notebookId: NotebookId;
}
export interface Source {
    id: SourceId;
    url: string;
    status: SourceStatus;
    title: string;
    content: string;
    owner: UserId;
    kind: SourceKind;
    createdAt: Timestamp;
    errorMessage: string;
    updatedAt: Timestamp;
    storageKey: string;
    sizeBytes: bigint;
    notebookId: NotebookId;
    pageCount: bigint;
}
export type SourceId = bigint;
export interface SourceInput {
    url: string;
    title: string;
    content: string;
    kind: SourceKind;
    storageKey: string;
    sizeBytes: bigint;
    notebookId: NotebookId;
}
export interface SourceSummary {
    source: Source;
    chunkCount: bigint;
}
export interface StudyProgress {
    id: ProgressId;
    questionsAnswered: bigint;
    notesGenerated: bigint;
    owner: UserId;
    quizzesTaken: bigint;
    questionsCorrect: bigint;
    notebookId: NotebookId;
    lastActivityAt: Timestamp;
    flashcardsReviewed: bigint;
}
export type Timestamp = bigint;
export type UserId = Principal;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum Difficulty {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced",
    exam = "exam"
}
export enum MessageRole {
    user = "user",
    assistant = "assistant"
}
export enum QuestionKind {
    mcq = "mcq",
    shortAnswer = "shortAnswer",
    trueFalse = "trueFalse"
}
export enum QuizDifficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum SourceKind {
    pdf = "pdf",
    url = "url",
    docx = "docx",
    note = "note",
    pptx = "pptx",
    text = "text",
    youtube = "youtube"
}
export enum SourceStatus {
    pending = "pending",
    processing = "processing",
    ready = "ready",
    failed = "failed"
}
export enum StudyMaterialKind {
    quiz = "quiz",
    summary = "summary",
    detailedNotes = "detailedNotes",
    flashcards = "flashcards"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Add a source to one of the caller's notebooks.
     */
    addSource(input: SourceInput): Promise<Result_1>;
    /**
     * / Ask a question grounded in the notebook's sources.
     */
    askQuestion(conversationId: ConversationId, question: string): Promise<Result_6>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Start a conversation inside one of the caller's notebooks.
     */
    createConversation(notebookId: NotebookId, title: string): Promise<Result_5>;
    /**
     * / Create a notebook owned by the caller.
     */
    createNotebook(input: NotebookInput): Promise<Notebook>;
    /**
     * / Delete one of the caller's conversations and its messages.
     */
    deleteConversation(id: ConversationId): Promise<boolean>;
    /**
     * / Delete one of the caller's notes.
     */
    deleteNote(id: NoteId): Promise<boolean>;
    /**
     * / Delete one of the caller's notebooks and all data scoped to it.
     */
    deleteNotebook(id: NotebookId): Promise<boolean>;
    /**
     * / Delete one of the caller's sources and its chunks.
     */
    deleteSource(id: SourceId): Promise<boolean>;
    execute(qJson: string): Promise<Result__1>;
    /**
     * / Generate flashcards for one of the caller's notebooks.
     */
    generateFlashcards(request: FlashcardRequest): Promise<Result_4>;
    /**
     * / Generate a note document for one of the caller's notebooks.
     */
    generateNote(request: NoteRequest): Promise<Result_3>;
    /**
     * / Generate a quiz for one of the caller's notebooks.
     */
    generateQuiz(request: QuizRequest): Promise<Result_2>;
    /**
     * / Static Markdown documentation of this backend's public API.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Fetch one of the caller's conversations.
     */
    getConversation(id: ConversationId): Promise<Conversation | null>;
    /**
     * / Fetch one of the caller's notes.
     */
    getNote(id: NoteId): Promise<Note | null>;
    /**
     * / Fetch one of the caller's notebooks.
     */
    getNotebook(id: NotebookId): Promise<Notebook | null>;
    /**
     * / Fetch aggregate study progress for one of the caller's notebooks.
     */
    getProgress(notebookId: NotebookId): Promise<StudyProgress | null>;
    /**
     * / Fetch one of the caller's quizzes with its questions.
     */
    getQuiz(id: QuizId): Promise<[Quiz, Array<QuizQuestionView>] | null>;
    /**
     * / Fetch one of the caller's sources.
     */
    getSource(id: SourceId): Promise<Source | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / List the chapters of one of the caller's notebooks.
     */
    listChapters(notebookId: NotebookId): Promise<Array<Chapter>>;
    /**
     * / List the conversations of one of the caller's notebooks.
     */
    listConversations(notebookId: NotebookId): Promise<Array<ConversationSummary>>;
    /**
     * / List the flashcards of one of the caller's notebooks.
     */
    listFlashcards(notebookId: NotebookId): Promise<Array<Flashcard>>;
    /**
     * / List the messages of one of the caller's conversations.
     */
    listMessages(conversationId: ConversationId): Promise<Array<Message>>;
    /**
     * / List the caller's notebooks with aggregate counts.
     */
    listNotebooks(): Promise<Array<NotebookSummary>>;
    /**
     * / List the notes of one of the caller's notebooks.
     */
    listNotes(notebookId: NotebookId): Promise<Array<Note>>;
    /**
     * / List the quizzes of one of the caller's notebooks.
     */
    listQuizzes(notebookId: NotebookId): Promise<Array<Quiz>>;
    /**
     * / List the sources of one of the caller's notebooks.
     */
    listSources(notebookId: NotebookId): Promise<Array<SourceSummary>>;
    /**
     * / Send a source through the knowledge engine and record its status.
     */
    processSource(id: SourceId): Promise<Result_1>;
    /**
     * / Record a flashcard review outcome.
     */
    reviewFlashcard(id: FlashcardId, known: boolean): Promise<Flashcard | null>;
    schema(): Promise<string>;
    /**
     * / Search the caller's notebooks, sources, notes, flashcards, conversations
     * / and quizzes.
     */
    search(term: string): Promise<Array<SearchHit>>;
    /**
     * / Seed the Indian Economy demo notebook for the caller if absent, and
     * / return it.
     */
    seedDemoData(): Promise<Notebook>;
    /**
     * / Replace the chapter list of one of the caller's notebooks.
     */
    setChapters(notebookId: NotebookId, titles: Array<string>): Promise<Array<Chapter>>;
    /**
     * / Submit answers to one of the caller's quizzes and receive a graded report.
     */
    submitQuiz(quizId: QuizId, answers: Array<QuizAnswer>): Promise<Result>;
    /**
     * / Update one of the caller's notes.
     */
    updateNote(id: NoteId, title: string | null, content: string | null): Promise<Note | null>;
    /**
     * / Update one of the caller's notebooks.
     */
    updateNotebook(id: NotebookId, update: NotebookUpdate): Promise<Notebook | null>;
}
