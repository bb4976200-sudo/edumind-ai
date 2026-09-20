import Map "mo:core/Map";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import SourceTypes "../types/sources";
import StudyTypes "../types/study";
import DemoLib "../lib/demo";

mixin (
  state : {
    var nextNotebookId : Nat;
    var nextSourceId : Nat;
    var nextNoteId : Nat;
    var nextFlashcardId : Nat;
    var nextQuizId : Nat;
    var nextQuestionId : Nat;
    var nextChunkId : Nat;
  },
  notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
  chapters : Map.Map<Common.NotebookId, [NotebookTypes.Chapter]>,
  sources : Map.Map<Common.SourceId, SourceTypes.Source>,
  chunks : Map.Map<Common.SourceId, [SourceTypes.SourceChunk]>,
  notes : Map.Map<Common.NoteId, StudyTypes.Note>,
  flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>,
  quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
  questions : Map.Map<Common.QuizId, [StudyTypes.QuizQuestion]>,
) {
  /// Seed the Indian Economy demo notebook for the caller if absent, and
  /// return it.
  public shared ({ caller }) func seedDemoData() : async NotebookTypes.Notebook {
    DemoLib.seedDemoNotebook(state, notebooks, chapters, sources, chunks, notes, flashcards, quizzes, questions, caller);
  };
};
