import Map "mo:core/Map";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import SourceTypes "../types/sources";
import ChatTypes "../types/chat";
import StudyTypes "../types/study";
import NotebooksLib "../lib/notebooks";

mixin (
  state : { var nextNotebookId : Nat },
  notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
  chapters : Map.Map<Common.NotebookId, [NotebookTypes.Chapter]>,
  sources : Map.Map<Common.SourceId, SourceTypes.Source>,
  notes : Map.Map<Common.NoteId, StudyTypes.Note>,
  flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>,
  quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
  conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
) {
  // --- Internal helpers ---------------------------------------------------

  func removeWhere<V>(map : Map.Map<Nat, V>, predicate : V -> Bool) : () {
    let doomed = map.entries().filter(func(entry) = predicate(entry.1)).map(func(entry) = entry.0).toArray();
    for (key in doomed.values()) {
      map.remove(key);
    };
  };

  /// Create a notebook owned by the caller.
  public shared ({ caller }) func createNotebook(input : NotebookTypes.NotebookInput) : async NotebookTypes.Notebook {
    NotebooksLib.createNotebook(state, notebooks, caller, input);
  };

  /// List the caller's notebooks with aggregate counts.
  public query ({ caller }) func listNotebooks() : async [NotebookTypes.NotebookSummary] {
    let base = NotebooksLib.listNotebooks(notebooks, caller);
    base.map(func(summary) = {
      notebook = summary.notebook;
      sourceCount = sources.values().filter(func(s) = s.notebookId == summary.notebook.id and s.owner == caller).size();
      noteCount = notes.values().filter(func(n) = n.notebookId == summary.notebook.id and n.owner == caller).size();
      flashcardCount = flashcards.values().filter(func(f) = f.notebookId == summary.notebook.id and f.owner == caller).size();
      quizCount = quizzes.values().filter(func(q) = q.notebookId == summary.notebook.id and q.owner == caller).size();
      conversationCount = conversations.values().filter(func(c) = c.notebookId == summary.notebook.id and c.owner == caller).size();
    });
  };

  /// Fetch one of the caller's notebooks.
  public query ({ caller }) func getNotebook(id : Common.NotebookId) : async ?NotebookTypes.Notebook {
    NotebooksLib.getNotebook(notebooks, caller, id);
  };

  /// Update one of the caller's notebooks.
  public shared ({ caller }) func updateNotebook(id : Common.NotebookId, update : NotebookTypes.NotebookUpdate) : async ?NotebookTypes.Notebook {
    NotebooksLib.updateNotebook(notebooks, caller, id, update);
  };

  /// Delete one of the caller's notebooks and all data scoped to it.
  public shared ({ caller }) func deleteNotebook(id : Common.NotebookId) : async Bool {
    switch (NotebooksLib.getNotebook(notebooks, caller, id)) {
      case null { false };
      case (?_) {
        // Cascade: remove every entity scoped to this notebook.
        removeWhere(sources, func(s) = s.notebookId == id);
        removeWhere(notes, func(n) = n.notebookId == id);
        removeWhere(flashcards, func(f) = f.notebookId == id);
        removeWhere(quizzes, func(q) = q.notebookId == id);
        removeWhere(conversations, func(c) = c.notebookId == id);
        chapters.remove(id);
        NotebooksLib.deleteNotebook(notebooks, caller, id);
      };
    };
  };

  /// List the chapters of one of the caller's notebooks.
  public query ({ caller }) func listChapters(notebookId : Common.NotebookId) : async [NotebookTypes.Chapter] {
    NotebooksLib.listChapters(chapters, notebooks, caller, notebookId);
  };

  /// Replace the chapter list of one of the caller's notebooks.
  public shared ({ caller }) func setChapters(notebookId : Common.NotebookId, titles : [Text]) : async [NotebookTypes.Chapter] {
    NotebooksLib.setChapters(chapters, notebooks, caller, notebookId, titles);
  };

};
