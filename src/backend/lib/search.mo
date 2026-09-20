import Map "mo:core/Map";
import Text "mo:core/Text";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import SourceTypes "../types/sources";
import ChatTypes "../types/chat";
import StudyTypes "../types/study";

module {
  func matches(needle : Text, a : Text, b : Text) : Bool {
    a.toLower().contains(#text needle) or b.toLower().contains(#text needle);
  };

  func snippet(text : Text) : Text {
    let chars = text.toArray();
    let limit = if (chars.size() > 140) { 140 } else { chars.size() };
    Text.fromIter(chars.sliceToArray(0, limit).values());
  };

  /// Search the caller's notebooks, sources, notes, flashcards, conversations
  /// and quizzes for `term`.
  public func search(
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    sources : Map.Map<Common.SourceId, SourceTypes.Source>,
    notes : Map.Map<Common.NoteId, StudyTypes.Note>,
    flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>,
    conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
    quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
    owner : Common.UserId,
    term : Text,
  ) : [StudyTypes.SearchHit] {
    let needle = term.trim(#char ' ').toLower();
    if (needle.size() == 0) { return [] };

    var hits : [StudyTypes.SearchHit] = [];

    for (n in notebooks.values()) {
      if (n.owner == owner and matches(needle, n.title, n.description)) {
        hits := hits.concat([{ kind = "notebook"; id = n.id; notebookId = n.id; title = n.title; snippet = snippet(n.description) }]);
      };
    };
    for (s in sources.values()) {
      if (s.owner == owner and matches(needle, s.title, s.content)) {
        hits := hits.concat([{ kind = "source"; id = s.id; notebookId = s.notebookId; title = s.title; snippet = snippet(s.content) }]);
      };
    };
    for (n in notes.values()) {
      if (n.owner == owner and matches(needle, n.title, n.content)) {
        hits := hits.concat([{ kind = "note"; id = n.id; notebookId = n.notebookId; title = n.title; snippet = snippet(n.content) }]);
      };
    };
    for (f in flashcards.values()) {
      if (f.owner == owner and matches(needle, f.front, f.back)) {
        hits := hits.concat([{ kind = "flashcard"; id = f.id; notebookId = f.notebookId; title = f.front; snippet = snippet(f.back) }]);
      };
    };
    for (c in conversations.values()) {
      if (c.owner == owner and matches(needle, c.title, "")) {
        hits := hits.concat([{ kind = "conversation"; id = c.id; notebookId = c.notebookId; title = c.title; snippet = "" }]);
      };
    };
    for (q in quizzes.values()) {
      if (q.owner == owner and matches(needle, q.title, "")) {
        hits := hits.concat([{ kind = "quiz"; id = q.id; notebookId = q.notebookId; title = q.title; snippet = "" }]);
      };
    };
    hits;
  };
};
