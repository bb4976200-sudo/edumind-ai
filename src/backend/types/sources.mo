import Common "common";

module {
  public type NotebookId = Common.NotebookId;
  public type SourceId = Common.SourceId;
  public type Timestamp = Common.Timestamp;
  public type UserId = Common.UserId;
  public type SourceKind = Common.SourceKind;
  public type SourceStatus = Common.SourceStatus;

  /// A study source attached to a notebook.
  public type Source = {
    id : SourceId;
    notebookId : NotebookId;
    owner : UserId;
    title : Text;
    kind : SourceKind;
    /// Original URL for `#url` / `#youtube` sources, empty otherwise.
    url : Text;
    /// Extracted plain text handed to the knowledge engine.
    content : Text;
    /// Object-storage key for uploaded files, empty for text/url sources.
    storageKey : Text;
    /// Declared byte size of the uploaded file, 0 for text/url sources.
    sizeBytes : Nat;
    status : SourceStatus;
    pageCount : Nat;
    /// Human-readable reason when `status` is `#failed`.
    errorMessage : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  /// Caller-supplied fields when adding a source.
  public type SourceInput = {
    notebookId : NotebookId;
    title : Text;
    kind : SourceKind;
    url : Text;
    content : Text;
    storageKey : Text;
    sizeBytes : Nat;
  };

  /// A retrievable slice of a source's text, used for grounding answers.
  public type SourceChunk = {
    id : Nat;
    sourceId : SourceId;
    notebookId : NotebookId;
    owner : UserId;
    ordinal : Nat;
    text : Text;
  };

  /// A source plus its chunk count, for source-management views.
  public type SourceSummary = {
    source : Source;
    chunkCount : Nat;
  };
};
