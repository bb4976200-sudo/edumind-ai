import Map "mo:core/Map";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import SourceTypes "../types/sources";
import ChatTypes "../types/chat";
import StudyTypes "../types/study";
import SearchLib "../lib/search";

mixin (
  notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
  sources : Map.Map<Common.SourceId, SourceTypes.Source>,
  notes : Map.Map<Common.NoteId, StudyTypes.Note>,
  flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>,
  conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
  quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
) {
  /// Search the caller's notebooks, sources, notes, flashcards, conversations
  /// and quizzes.
  public query ({ caller }) func search(term : Text) : async [StudyTypes.SearchHit] {
    SearchLib.search(notebooks, sources, notes, flashcards, conversations, quizzes, caller, term);
  };
};
