import Common "common";

module {
  public type NotebookId = Common.NotebookId;
  public type SourceId = Common.SourceId;
  public type Timestamp = Common.Timestamp;
  public type UserId = Common.UserId;
  public type SourceKind = Common.SourceKind;
  public type Difficulty = Common.Difficulty;
  public type Citation = Common.Citation;
  public type AppError = Common.AppError;

  /// A source as handed to the knowledge engine for indexing.
  public type EngineSource = {
    id : SourceId;
    notebookId : NotebookId;
    title : Text;
    kind : SourceKind;
    url : Text;
    content : Text;
  };

  /// A grounded answer returned by the knowledge engine.
  public type EngineAnswer = {
    text : Text;
    citations : [Citation];
  };

  /// A generated flashcard pair returned by the knowledge engine.
  public type EngineFlashcard = {
    front : Text;
    back : Text;
  };

  /// A generated quiz question returned by the knowledge engine.
  public type EngineQuestion = {
    kind : Common.QuestionKind;
    prompt : Text;
    options : [Text];
    correctIndex : Nat;
    explanation : Text;
    topic : Text;
  };

  /// A search hit returned by the knowledge engine.
  public type EngineSearchHit = {
    sourceId : SourceId;
    title : Text;
    snippet : Text;
  };

  /// Request for a grounded answer.
  public type AskRequest = {
    notebookId : NotebookId;
    question : Text;
    history : [Text];
  };

  /// Request for generated notes.
  public type NotesRequest = {
    notebookId : NotebookId;
    sourceId : ?SourceId;
    kind : Common.StudyMaterialKind;
    difficulty : Difficulty;
    chapter : ?Text;
  };

  /// Request for generated flashcards.
  public type FlashcardsRequest = {
    notebookId : NotebookId;
    sourceId : ?SourceId;
    count : Nat;
    difficulty : Difficulty;
  };

  /// Request for a generated quiz.
  public type QuizGenRequest = {
    notebookId : NotebookId;
    sourceId : ?SourceId;
    count : Nat;
    difficulty : Common.QuizDifficulty;
    kinds : [Common.QuestionKind];
  };

  /// The modular knowledge-engine boundary. Every method is async so a real
  /// remote connector can replace the mock without changing callers.
  public type KnowledgeEngine = {
    createNotebook : (UserId, Text, Text) -> async NotebookId;
    addSource : (UserId, EngineSource) -> async SourceId;
    processSource : (UserId, SourceId) -> async SourceStatusResult;
    askQuestion : (UserId, AskRequest) -> async EngineAnswer;
    generateSummary : (UserId, NotesRequest) -> async Text;
    generateNotes : (UserId, NotesRequest) -> async Text;
    generateQuiz : (UserId, QuizGenRequest) -> async [EngineQuestion];
    generateFlashcards : (UserId, FlashcardsRequest) -> async [EngineFlashcard];
    getSources : (UserId, NotebookId) -> async [EngineSource];
    searchNotebook : (UserId, NotebookId, Text) -> async [EngineSearchHit];
  };

  /// Result of processing a source through the engine.
  public type SourceStatusResult = {
    status : Common.SourceStatus;
    pageCount : Nat;
    errorMessage : Text;
  };
};
