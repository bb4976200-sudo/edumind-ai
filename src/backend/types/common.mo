import Principal "mo:core/Principal";

module {
  /// Stable identifier for a notebook.
  public type NotebookId = Nat;

  /// Stable identifier for a source.
  public type SourceId = Nat;

  /// Stable identifier for a conversation.
  public type ConversationId = Nat;

  /// Stable identifier for a message.
  public type MessageId = Nat;

  /// Stable identifier for a generated note document.
  public type NoteId = Nat;

  /// Stable identifier for a flashcard.
  public type FlashcardId = Nat;

  /// Stable identifier for a quiz.
  public type QuizId = Nat;

  /// Stable identifier for a quiz question.
  public type QuestionId = Nat;

  /// Stable identifier for a study-progress record.
  public type ProgressId = Nat;

  /// Nanoseconds since the epoch.
  public type Timestamp = Int;

  /// The principal that owns a piece of data.
  public type UserId = Principal;

  /// Supported source kinds accepted by the source pipeline.
  public type SourceKind = {
    #pdf;
    #docx;
    #pptx;
    #text;
    #url;
    #youtube;
    #note;
  };

  /// Lifecycle of a source as it moves through the knowledge engine.
  public type SourceStatus = {
    #pending;
    #processing;
    #ready;
    #failed;
  };

  /// Difficulty level requested for generated study material.
  public type Difficulty = {
    #beginner;
    #intermediate;
    #advanced;
    #exam;
  };

  /// Kinds of study material the knowledge engine can generate.
  public type StudyMaterialKind = {
    #summary;
    #detailedNotes;
    #flashcards;
    #quiz;
  };

  /// Question shapes supported by the quiz generator.
  public type QuestionKind = {
    #mcq;
    #trueFalse;
    #shortAnswer;
  };

  /// Quiz difficulty requested by the caller.
  public type QuizDifficulty = {
    #easy;
    #medium;
    #hard;
  };

  /// A citation pointing back into a source that grounded an answer.
  public type Citation = {
    sourceId : SourceId;
    sourceTitle : Text;
    snippet : Text;
  };

  /// Caller-visible failure for any knowledge-engine or validation operation.
  public type AppError = {
    #notFound : Text;
    #notAuthorized;
    #invalidInput : Text;
    #unsupportedSourceKind : Text;
    #sourceTooLarge : Text;
    #engineUnavailable : Text;
  };

  /// A fallible result carrying either a caller-visible error or a value.
  public type Result<T> = {
    #ok : T;
    #err : AppError;
  };
};
