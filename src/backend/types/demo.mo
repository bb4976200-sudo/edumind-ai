import Common "common";

module {
  public type NotebookId = Common.NotebookId;
  public type SourceId = Common.SourceId;
  public type Timestamp = Common.Timestamp;
  public type UserId = Common.UserId;
  public type SourceKind = Common.SourceKind;
  public type Difficulty = Common.Difficulty;
  public type StudyMaterialKind = Common.StudyMaterialKind;
  public type QuestionKind = Common.QuestionKind;
  public type QuizDifficulty = Common.QuizDifficulty;

  /// A demo chapter definition.
  public type DemoChapter = {
    title : Text;
    order : Nat;
  };

  /// A demo source definition.
  public type DemoSource = {
    title : Text;
    kind : SourceKind;
    url : Text;
    content : Text;
    pageCount : Nat;
  };

  /// A demo note definition.
  public type DemoNote = {
    title : Text;
    kind : StudyMaterialKind;
    difficulty : Difficulty;
    content : Text;
  };

  /// A demo flashcard definition.
  public type DemoFlashcard = {
    front : Text;
    back : Text;
  };

  /// A demo quiz question definition.
  public type DemoQuestion = {
    kind : QuestionKind;
    prompt : Text;
    options : [Text];
    correctIndex : Nat;
    explanation : Text;
    topic : Text;
  };

  /// The complete Indian Economy demo notebook seed.
  public type DemoSeed = {
    notebookTitle : Text;
    notebookDescription : Text;
    chapters : [DemoChapter];
    sources : [DemoSource];
    notes : [DemoNote];
    flashcards : [DemoFlashcard];
    questions : [DemoQuestion];
    quizTitle : Text;
    quizDifficulty : QuizDifficulty;
  };
};
