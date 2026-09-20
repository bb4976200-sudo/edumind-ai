import Common "common";

module {
  public type NotebookId = Common.NotebookId;
  public type SourceId = Common.SourceId;
  public type NoteId = Common.NoteId;
  public type FlashcardId = Common.FlashcardId;
  public type QuizId = Common.QuizId;
  public type QuestionId = Common.QuestionId;
  public type ProgressId = Common.ProgressId;
  public type Timestamp = Common.Timestamp;
  public type UserId = Common.UserId;
  public type Difficulty = Common.Difficulty;
  public type StudyMaterialKind = Common.StudyMaterialKind;
  public type QuestionKind = Common.QuestionKind;
  public type QuizDifficulty = Common.QuizDifficulty;

  /// A generated, editable study document.
  public type Note = {
    id : NoteId;
    notebookId : NotebookId;
    owner : UserId;
    title : Text;
    kind : StudyMaterialKind;
    difficulty : Difficulty;
    content : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  /// Request for generating a note document.
  public type NoteRequest = {
    notebookId : NotebookId;
    sourceId : ?SourceId;
    kind : StudyMaterialKind;
    difficulty : Difficulty;
    chapter : ?Text;
  };

  /// A single flashcard with spaced-repetition progress.
  public type Flashcard = {
    id : FlashcardId;
    notebookId : NotebookId;
    owner : UserId;
    front : Text;
    back : Text;
    /// Number of times the learner marked this card as known.
    knownCount : Nat;
    /// Number of times the learner asked to review it again.
    reviewCount : Nat;
    lastReviewedAt : ?Timestamp;
    createdAt : Timestamp;
  };

  /// Request for generating flashcards.
  public type FlashcardRequest = {
    notebookId : NotebookId;
    sourceId : ?SourceId;
    count : Nat;
    difficulty : Difficulty;
  };

  /// A generated quiz shell.
  public type Quiz = {
    id : QuizId;
    notebookId : NotebookId;
    owner : UserId;
    title : Text;
    difficulty : QuizDifficulty;
    createdAt : Timestamp;
  };

  /// A single quiz question. `correctIndex` is only returned after submission.
  public type QuizQuestion = {
    id : QuestionId;
    quizId : QuizId;
    owner : UserId;
    kind : QuestionKind;
    prompt : Text;
    options : [Text];
    correctIndex : Nat;
    explanation : Text;
    topic : Text;
  };

  /// A quiz question as shown to the learner, without the answer key.
  public type QuizQuestionView = {
    id : QuestionId;
    kind : QuestionKind;
    prompt : Text;
    options : [Text];
    topic : Text;
  };

  /// Request for generating a quiz.
  public type QuizRequest = {
    notebookId : NotebookId;
    sourceId : ?SourceId;
    count : Nat;
    difficulty : QuizDifficulty;
    kinds : [QuestionKind];
  };

  /// A learner's answer to one question.
  public type QuizAnswer = {
    questionId : QuestionId;
    selectedIndex : Nat;
  };

  /// Per-question outcome after grading.
  public type QuizResultItem = {
    questionId : QuestionId;
    prompt : Text;
    selectedIndex : Nat;
    correctIndex : Nat;
    correct : Bool;
    explanation : Text;
    topic : Text;
  };

  /// Full grading report for a submitted quiz.
  public type QuizResult = {
    quizId : QuizId;
    score : Nat;
    total : Nat;
    correctCount : Nat;
    wrongCount : Nat;
    items : [QuizResultItem];
    weakTopics : [Text];
    recommendedRevision : [Text];
  };

  /// Aggregate study progress for one notebook.
  public type StudyProgress = {
    id : ProgressId;
    notebookId : NotebookId;
    owner : UserId;
    notesGenerated : Nat;
    flashcardsReviewed : Nat;
    quizzesTaken : Nat;
    questionsAnswered : Nat;
    questionsCorrect : Nat;
    lastActivityAt : Timestamp;
  };

  /// A single search hit across notebooks, sources, notes, flashcards,
  /// conversations and quizzes.
  public type SearchHit = {
    kind : Text;
    id : Nat;
    notebookId : NotebookId;
    title : Text;
    snippet : Text;
  };
};
