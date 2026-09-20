import Map "mo:core/Map";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import StudyTypes "../types/study";
import KnowledgeTypes "../types/knowledge";
import StudyLib "../lib/study";

mixin (
  state : { var nextNoteId : Nat; var nextFlashcardId : Nat; var nextQuizId : Nat; var nextQuestionId : Nat },
  notes : Map.Map<Common.NoteId, StudyTypes.Note>,
  flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>,
  quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
  questions : Map.Map<Common.QuizId, [StudyTypes.QuizQuestion]>,
  progress : Map.Map<Common.NotebookId, StudyTypes.StudyProgress>,
  notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
  engine : KnowledgeTypes.KnowledgeEngine,
) {
  /// Generate a note document for one of the caller's notebooks.
  public shared ({ caller }) func generateNote(request : StudyTypes.NoteRequest) : async Common.Result<StudyTypes.Note> {
    await StudyLib.generateNote(state, notes, notebooks, engine, caller, request);
  };

  /// List the notes of one of the caller's notebooks.
  public query ({ caller }) func listNotes(notebookId : Common.NotebookId) : async [StudyTypes.Note] {
    StudyLib.listNotes(notes, notebooks, caller, notebookId);
  };

  /// Fetch one of the caller's notes.
  public query ({ caller }) func getNote(id : Common.NoteId) : async ?StudyTypes.Note {
    StudyLib.getNote(notes, caller, id);
  };

  /// Update one of the caller's notes.
  public shared ({ caller }) func updateNote(id : Common.NoteId, title : ?Text, content : ?Text) : async ?StudyTypes.Note {
    StudyLib.updateNote(notes, caller, id, title, content);
  };

  /// Delete one of the caller's notes.
  public shared ({ caller }) func deleteNote(id : Common.NoteId) : async Bool {
    StudyLib.deleteNote(notes, caller, id);
  };

  /// Generate flashcards for one of the caller's notebooks.
  public shared ({ caller }) func generateFlashcards(request : StudyTypes.FlashcardRequest) : async Common.Result<[StudyTypes.Flashcard]> {
    await StudyLib.generateFlashcards(state, flashcards, notebooks, engine, caller, request);
  };

  /// List the flashcards of one of the caller's notebooks.
  public query ({ caller }) func listFlashcards(notebookId : Common.NotebookId) : async [StudyTypes.Flashcard] {
    StudyLib.listFlashcards(flashcards, notebooks, caller, notebookId);
  };

  /// Record a flashcard review outcome.
  public shared ({ caller }) func reviewFlashcard(id : Common.FlashcardId, known : Bool) : async ?StudyTypes.Flashcard {
    StudyLib.reviewFlashcard(flashcards, progress, caller, id, known);
  };

  /// Generate a quiz for one of the caller's notebooks.
  public shared ({ caller }) func generateQuiz(request : StudyTypes.QuizRequest) : async Common.Result<StudyTypes.Quiz> {
    await StudyLib.generateQuiz(state, quizzes, questions, notebooks, engine, caller, request);
  };

  /// Fetch one of the caller's quizzes with its questions.
  public query ({ caller }) func getQuiz(id : Common.QuizId) : async ?(StudyTypes.Quiz, [StudyTypes.QuizQuestionView]) {
    StudyLib.getQuiz(quizzes, questions, caller, id);
  };

  /// List the quizzes of one of the caller's notebooks.
  public query ({ caller }) func listQuizzes(notebookId : Common.NotebookId) : async [StudyTypes.Quiz] {
    StudyLib.listQuizzes(quizzes, notebooks, caller, notebookId);
  };

  /// Submit answers to one of the caller's quizzes and receive a graded report.
  public shared ({ caller }) func submitQuiz(quizId : Common.QuizId, answers : [StudyTypes.QuizAnswer]) : async Common.Result<StudyTypes.QuizResult> {
    StudyLib.submitQuiz(quizzes, questions, progress, caller, quizId, answers);
  };

  /// Fetch aggregate study progress for one of the caller's notebooks.
  public query ({ caller }) func getProgress(notebookId : Common.NotebookId) : async ?StudyTypes.StudyProgress {
    StudyLib.getProgress(progress, notebooks, caller, notebookId);
  };
};
