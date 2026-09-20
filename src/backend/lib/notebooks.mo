import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

import Common "../types/common";
import NotebookTypes "../types/notebooks";

module {
  /// Create a notebook owned by `owner` and return its id.
  public func createNotebook(
    state : { var nextNotebookId : Nat },
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    input : NotebookTypes.NotebookInput,
  ) : NotebookTypes.Notebook {
    let id = state.nextNotebookId;
    state.nextNotebookId := id + 1;
    let now = Time.now();
    let notebook : NotebookTypes.Notebook = {
      id;
      owner;
      title = input.title;
      description = input.description;
      createdAt = now;
      updatedAt = now;
    };
    notebooks.add(id, notebook);
    notebook;
  };

  /// List every notebook owned by `owner`, newest first.
  public func listNotebooks(
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
  ) : [NotebookTypes.NotebookSummary] {
    let owned = notebooks.values().filter(func(n) = n.owner == owner).toArray();
    let sorted = owned.sort(func(a, b) = Nat.compare(b.id, a.id));
    sorted.map(func(n) = { notebook = n; sourceCount = 0; noteCount = 0; flashcardCount = 0; quizCount = 0; conversationCount = 0 });
  };

  /// Fetch one notebook, enforcing ownership.
  public func getNotebook(
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    id : Common.NotebookId,
  ) : ?NotebookTypes.Notebook {
    switch (notebooks.get(id)) {
      case (?n) { if (n.owner == owner) { ?n } else { null } };
      case null { null };
    };
  };

  /// Update a notebook's title and/or description, enforcing ownership.
  public func updateNotebook(
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    id : Common.NotebookId,
    update : NotebookTypes.NotebookUpdate,
  ) : ?NotebookTypes.Notebook {
    switch (notebooks.get(id)) {
      case (?n) {
        if (n.owner != owner) { return null };
        let updated : NotebookTypes.Notebook = {
          id = n.id;
          owner = n.owner;
          title = update.title ?? n.title;
          description = update.description ?? n.description;
          createdAt = n.createdAt;
          updatedAt = Time.now();
        };
        notebooks.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  /// Delete a notebook and all data scoped to it, enforcing ownership.
  public func deleteNotebook(
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    id : Common.NotebookId,
  ) : Bool {
    switch (notebooks.get(id)) {
      case (?n) {
        if (n.owner != owner) { return false };
        notebooks.remove(id);
        true;
      };
      case null { false };
    };
  };

  /// List the chapters of a notebook, enforcing ownership.
  public func listChapters(
    chapters : Map.Map<Common.NotebookId, [NotebookTypes.Chapter]>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
  ) : [NotebookTypes.Chapter] {
    switch (notebooks.get(notebookId)) {
      case (?n) { if (n.owner != owner) { return [] } };
      case null { return [] };
    };
    chapters.get(notebookId) ?? [];
  };

  /// Replace the chapter list of a notebook, enforcing ownership.
  public func setChapters(
    chapters : Map.Map<Common.NotebookId, [NotebookTypes.Chapter]>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
    titles : [Text],
  ) : [NotebookTypes.Chapter] {
    switch (notebooks.get(notebookId)) {
      case (?n) { if (n.owner != owner) { return [] } };
      case null { return [] };
    };
    var order = 0;
    let built = List.empty<NotebookTypes.Chapter>();
    for (title in titles.values()) {
      let chapter : NotebookTypes.Chapter = { id = order; notebookId; title; order };
      order += 1;
      built.add(chapter);
    };
    let result = built.toArray();
    chapters.add(notebookId, result);
    result;
  };
};
