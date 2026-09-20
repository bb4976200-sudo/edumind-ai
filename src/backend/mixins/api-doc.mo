mixin () {
  /// Static Markdown documentation of this backend's public API.
  public query func getApiDoc() : async Text {
    "# EduMind AI Backend API\n\n" #
    "EduMind AI is an educational study workspace. A signed-in user creates notebooks (subjects), attaches study sources, asks grounded questions, and generates notes, flashcards and quizzes. All data is isolated per caller principal.\n\n" #
    "## Authentication and authorization\n\n" #
    "Every method below requires a signed (non-anonymous) caller. The app's frontend pins an Internet Identity derivation origin, published at `/.well-known/ii-derivation-origin`; an agent already holding the user's Internet Identity authorization derives the correct per-app principal against that origin (for example `icp identity link web <name> --app <host>`). Such a delegation acts with the user's full authority in this app until it expires.\n\n" #
    "Registration is a prerequisite for guarded calls. A direct API caller must first call `_initialize_access_control()` once as a signed-in caller; the first caller to initialize becomes the admin (`#admin`), and every later caller becomes a regular user (`#user`). An unregistered or anonymous caller receives the authorization trap produced by the access-control component on guarded endpoints. A caller can be unregistered even when the app already knows it: registration happens only when a caller signs in through the app's own frontend, so a principal that never did so is unregistered even if it belongs to the app's owner, and a signed-in caller derived against a different origin is a different principal than the one the frontend registered.\n\n" #
    "## Notebooks\n\n" #
    "- `createNotebook(input : NotebookInput) : Notebook` — create a notebook owned by the caller.\n" #
    "- `listNotebooks() : [NotebookSummary]` — the caller's notebooks, newest first, with aggregate counts.\n" #
    "- `getNotebook(id : NotebookId) : ?Notebook` — one of the caller's notebooks.\n" #
    "- `updateNotebook(id : NotebookId, update : NotebookUpdate) : ?Notebook` — update title and/or description.\n" #
    "- `deleteNotebook(id : NotebookId) : Bool` — delete a notebook and cascade-delete its sources, notes, flashcards, quizzes and conversations.\n" #
    "- `listChapters(notebookId : NotebookId) : [Chapter]` — chapters of a notebook.\n" #
    "- `setChapters(notebookId : NotebookId, titles : [Text]) : [Chapter]` — replace the chapter list.\n\n" #
    "## Sources\n\n" #
    "- `addSource(input : SourceInput) : Result<Source>` — attach a source. `kind` is one of `#pdf`, `#docx`, `#pptx`, `#text`, `#url`, `#youtube`, `#note`. Uploads over 20,000,000 bytes are rejected with `#sourceTooLarge`.\n" #
    "- `listSources(notebookId : NotebookId) : [SourceSummary]` — sources with chunk counts.\n" #
    "- `getSource(id : SourceId) : ?Source` — one source.\n" #
    "- `processSource(id : SourceId) : Result<Source>` — run the source through the knowledge engine and index its chunks. Status transitions `#pending` -> `#processing` -> `#ready` or `#failed`.\n" #
    "- `deleteSource(id : SourceId) : Bool` — delete a source and its chunks.\n\n" #
    "## Conversations and questions\n\n" #
    "- `createConversation(notebookId : NotebookId, title : Text) : Result<Conversation>` — start a thread.\n" #
    "- `listConversations(notebookId : NotebookId) : [ConversationSummary]` — threads with message counts.\n" #
    "- `getConversation(id : ConversationId) : ?Conversation` — one thread.\n" #
    "- `deleteConversation(id : ConversationId) : Bool` — delete a thread and its messages.\n" #
    "- `listMessages(conversationId : ConversationId) : [Message]` — messages in order.\n" #
    "- `askQuestion(conversationId : ConversationId, question : Text) : Result<Answer>` — persist the user turn, ask the knowledge engine, persist the grounded answer with citations, and return both messages. Not idempotent: each call appends two messages.\n\n" #
    "## Study material\n\n" #
    "- `generateNote(request : NoteRequest) : Result<Note>` — generate a note document. `kind` is `#summary`, `#detailedNotes`, `#flashcards` or `#quiz`; `difficulty` is `#beginner`, `#intermediate`, `#advanced` or `#exam`.\n" #
    "- `listNotes(notebookId : NotebookId) : [Note]`, `getNote(id : NoteId) : ?Note`, `updateNote(id : NoteId, title : ?Text, content : ?Text) : ?Note`, `deleteNote(id : NoteId) : Bool`.\n" #
    "- `generateFlashcards(request : FlashcardRequest) : Result<[Flashcard]>` — generate and persist flashcards.\n" #
    "- `listFlashcards(notebookId : NotebookId) : [Flashcard]` — flashcards of a notebook.\n" #
    "- `reviewFlashcard(id : FlashcardId, known : Bool) : ?Flashcard` — record a review; `known = true` increments `knownCount`, and every call increments `reviewCount`.\n" #
    "- `generateQuiz(request : QuizRequest) : Result<Quiz>` — generate a quiz with questions. `difficulty` is `#easy`, `#medium` or `#hard`; `kinds` selects `#mcq`, `#trueFalse` and/or `#shortAnswer`.\n" #
    "- `getQuiz(id : QuizId) : ?(Quiz, [QuizQuestionView])` — a quiz with its questions, without the answer key.\n" #
    "- `listQuizzes(notebookId : NotebookId) : [Quiz]` — quizzes of a notebook.\n" #
    "- `submitQuiz(quizId : QuizId, answers : [QuizAnswer]) : Result<QuizResult>` — grade a submission and update study progress. `score` is a percentage (0-100); `weakTopics` and `recommendedRevision` list topics to revisit. Not idempotent: each call increments `quizzesTaken` and the answered-question counters.\n" #
    "- `getProgress(notebookId : NotebookId) : ?StudyProgress` — aggregate progress for a notebook.\n\n" #
    "## Search and demo\n\n" #
    "- `search(term : Text) : [SearchHit]` — search the caller's notebooks, sources, notes, flashcards, conversations and quizzes. An empty or whitespace-only term returns no hits.\n" #
    "- `seedDemoData() : Notebook` — idempotently seed the Indian Economy demo notebook (chapters Monetary Policy, Fiscal Policy, Inflation, Banking, National Income) for the caller and return it. Calling it again returns the existing demo notebook without duplicating data.\n\n" #
    "## Units and encodings\n\n" #
    "Timestamps are nanoseconds since the Unix epoch (`Int`). Identifiers are `Nat`. `SourceKind`, `SourceStatus`, `Difficulty`, `StudyMaterialKind`, `QuestionKind` and `QuizDifficulty` are Candid variants. `AppError` is a variant with `#notFound(Text)`, `#notAuthorized`, `#invalidInput(Text)`, `#unsupportedSourceKind(Text)`, `#sourceTooLarge(Text)` and `#engineUnavailable(Text)`. `?T` fields are optional and may be `null`.\n\n" #
    "## Knowledge engine\n\n" #
    "The knowledge layer is modular. The active engine is selected by `lib/knowledge.activeEngine()`, which currently returns a deterministic mock engine grounded in the Indian Economy corpus. A NotebookLM connector stub implements the same interface but performs no network access and reports `#engineUnavailable` until a real, officially supported integration is configured. Untrusted source content is sanitized and wrapped before it reaches the engine.\n\n" #
    "## Errors and limits\n\n" #
    "Guarded endpoints trap for unregistered or anonymous callers. Caller-fixable failures are returned as `Result<T>` values: `#ok(value)` on success or `#err(AppError)` on failure. Source uploads are limited to 20,000,000 bytes. All reads and writes are scoped to the caller principal; another user's data is never returned.\n\n" #
    "## Query layer (OQL)\n\n" #
    "The canister also exposes a read-only object-query surface: `schema() : Text` returns the JSON schema of the queryable entities and `execute(query : Text) : Text` runs a JSON query against them. Both are `query` methods and are authorized per entity against the live caller. The exposed entities are `notebook`, `source`, `sourceChunk`, `conversation`, `message`, `note`, `flashcard`, `quiz`, `quizQuestion` and `studyProgress`; each is scoped to the caller's own rows (`controllerOrScoped`), so a signed-in caller reads only rows it owns and the platform controller reads all. `sourceChunk`, `message` and `quizQuestion` are flattened from their parent's nested arrays, so each row carries its parent's `sourceId` / `conversationId` / `quizId`. `citations` and `options` are encoded as text columns (citations as `sourceId:sourceTitle` joined by `; `, options joined by ` | `).\n";
  };
};
