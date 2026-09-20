import Common "common";

module {
  public type NotebookId = Common.NotebookId;
  public type SourceId = Common.SourceId;
  public type Timestamp = Common.Timestamp;
  public type UserId = Common.UserId;

  /// A subject / notebook owned by exactly one user.
  public type Notebook = {
    id : NotebookId;
    owner : UserId;
    title : Text;
    description : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  /// Caller-supplied fields when creating a notebook.
  public type NotebookInput = {
    title : Text;
    description : Text;
  };

  /// Caller-supplied fields when updating a notebook.
  public type NotebookUpdate = {
    title : ?Text;
    description : ?Text;
  };

  /// A chapter grouping inside a notebook.
  public type Chapter = {
    id : Nat;
    notebookId : NotebookId;
    title : Text;
    order : Nat;
  };

  /// A notebook plus its aggregate counts, for dashboard and list views.
  public type NotebookSummary = {
    notebook : Notebook;
    sourceCount : Nat;
    noteCount : Nat;
    flashcardCount : Nat;
    quizCount : Nat;
    conversationCount : Nat;
  };
};
