import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type NotebookId = Nat;
  type SourceId = Nat;
  type ConversationId = Nat;
  type NoteId = Nat;
  type FlashcardId = Nat;
  type QuizId = Nat;

  type Notebook = {
    id : NotebookId;
    owner : Principal;
    title : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type Chapter = {
    id : Nat;
    notebookId : NotebookId;
    title : Text;
    order : Nat;
  };

  type Source = {
    id : SourceId;
    notebookId : NotebookId;
    owner : Principal;
    title : Text;
    kind : { #pdf; #docx; #pptx; #text; #url; #youtube; #note };
    url : Text;
    content : Text;
    storageKey : Text;
    sizeBytes : Nat;
    status : { #pending; #processing; #ready; #failed };
    pageCount : Nat;
    errorMessage : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type SourceChunk = {
    id : Nat;
    sourceId : SourceId;
    notebookId : NotebookId;
    owner : Principal;
    ordinal : Nat;
    text : Text;
  };

  type Conversation = {
    id : ConversationId;
    notebookId : NotebookId;
    owner : Principal;
    title : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type Message = {
    id : Nat;
    conversationId : ConversationId;
    notebookId : NotebookId;
    owner : Principal;
    role : { #user; #assistant };
    content : Text;
    citations : [{ sourceId : SourceId; sourceTitle : Text; snippet : Text }];
    createdAt : Int;
  };

  type Note = {
    id : NoteId;
    notebookId : NotebookId;
    owner : Principal;
    title : Text;
    kind : { #summary; #detailedNotes; #flashcards; #quiz };
    difficulty : { #beginner; #intermediate; #advanced; #exam };
    content : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type Flashcard = {
    id : FlashcardId;
    notebookId : NotebookId;
    owner : Principal;
    front : Text;
    back : Text;
    knownCount : Nat;
    reviewCount : Nat;
    lastReviewedAt : ?Int;
    createdAt : Int;
  };

  type Quiz = {
    id : QuizId;
    notebookId : NotebookId;
    owner : Principal;
    title : Text;
    difficulty : { #easy; #medium; #hard };
    createdAt : Int;
  };

  type QuizQuestion = {
    id : Nat;
    quizId : QuizId;
    owner : Principal;
    kind : { #mcq; #trueFalse; #shortAnswer };
    prompt : Text;
    options : [Text];
    correctIndex : Nat;
    explanation : Text;
    topic : Text;
  };

  type StudyProgress = {
    id : Nat;
    notebookId : NotebookId;
    owner : Principal;
    notesGenerated : Nat;
    flashcardsReviewed : Nat;
    quizzesTaken : Nat;
    questionsAnswered : Nat;
    questionsCorrect : Nat;
    lastActivityAt : Int;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    counters : {
      var nextNotebookId : Nat;
      var nextSourceId : Nat;
      var nextChunkId : Nat;
      var nextConversationId : Nat;
      var nextMessageId : Nat;
      var nextNoteId : Nat;
      var nextFlashcardId : Nat;
      var nextQuizId : Nat;
      var nextQuestionId : Nat;
    };
    notebooks : Map.Map<NotebookId, Notebook>;
    chapters : Map.Map<NotebookId, [Chapter]>;
    sources : Map.Map<SourceId, Source>;
    chunks : Map.Map<SourceId, [SourceChunk]>;
    conversations : Map.Map<ConversationId, Conversation>;
    messages : Map.Map<ConversationId, [Message]>;
    notes : Map.Map<NoteId, Note>;
    flashcards : Map.Map<FlashcardId, Flashcard>;
    quizzes : Map.Map<QuizId, Quiz>;
    questions : Map.Map<QuizId, [QuizQuestion]>;
    progress : Map.Map<NotebookId, StudyProgress>;
  };

  public func migration(_old : {}) : NewActor {
    {
      accessControlState = AccessControl.initState();
      counters = {
        var nextNotebookId = 0;
        var nextSourceId = 0;
        var nextChunkId = 0;
        var nextConversationId = 0;
        var nextMessageId = 0;
        var nextNoteId = 0;
        var nextFlashcardId = 0;
        var nextQuizId = 0;
        var nextQuestionId = 0;
      };
      notebooks = Map.empty();
      chapters = Map.empty();
      sources = Map.empty();
      chunks = Map.empty();
      conversations = Map.empty();
      messages = Map.empty();
      notes = Map.empty();
      flashcards = Map.empty();
      quizzes = Map.empty();
      questions = Map.empty();
      progress = Map.empty();
    };
  };
};
