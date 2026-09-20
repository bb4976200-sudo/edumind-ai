import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import SourceTypes "../types/sources";

module {
  /// Maximum accepted upload size in bytes.
  public let maxSourceBytes : Nat = 20_000_000;

  /// Validate a source input against kind, size and content rules.
  public func validateSourceInput(input : SourceTypes.SourceInput) : ?Common.AppError {
    if (input.title.trim(#char ' ').size() == 0) {
      return ?#invalidInput("Source title is required");
    };
    if (input.sizeBytes > maxSourceBytes) {
      return ?#sourceTooLarge("Source exceeds the 20 MB limit");
    };
    switch (input.kind) {
      case (#url) {
        if (not (input.url.startsWith(#text "http://") or input.url.startsWith(#text "https://"))) {
          return ?#invalidInput("URL sources must start with http:// or https://");
        };
      };
      case (#youtube) {
        if (not (input.url.startsWith(#text "http://") or input.url.startsWith(#text "https://"))) {
          return ?#invalidInput("YouTube sources must be a valid URL");
        };
      };
      case (#text or #note) {
        if (input.content.trim(#char ' ').size() == 0) {
          return ?#invalidInput("Text sources must include content");
        };
      };
      case (#pdf or #docx or #pptx) {
        if (input.storageKey.trim(#char ' ').size() == 0) {
          return ?#invalidInput("Uploaded files must include a storage key");
        };
      };
    };
    null;
  };

  /// Add a source to a notebook, enforcing ownership and validation.
  public func addSource(
    state : { var nextSourceId : Nat },
    sources : Map.Map<Common.SourceId, SourceTypes.Source>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    input : SourceTypes.SourceInput,
  ) : Common.Result<SourceTypes.Source> {
    switch (notebooks.get(input.notebookId)) {
      case (?n) { if (n.owner != owner) { return #err(#notAuthorized) } };
      case null { return #err(#notFound("Notebook not found")) };
    };
    switch (validateSourceInput(input)) {
      case (?err) { return #err(err) };
      case null {};
    };
    let id = state.nextSourceId;
    state.nextSourceId := id + 1;
    let now = Time.now();
    let source : SourceTypes.Source = {
      id;
      notebookId = input.notebookId;
      owner;
      title = input.title;
      kind = input.kind;
      url = input.url;
      content = input.content;
      storageKey = input.storageKey;
      sizeBytes = input.sizeBytes;
      status = #pending;
      pageCount = 0;
      errorMessage = "";
      createdAt = now;
      updatedAt = now;
    };
    sources.add(id, source);
    #ok(source);
  };
  /// List the sources of a notebook, enforcing ownership.
  public func listSources(
    sources : Map.Map<Common.SourceId, SourceTypes.Source>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
  ) : [SourceTypes.SourceSummary] {
    switch (notebooks.get(notebookId)) {
      case (?n) { if (n.owner != owner) { return [] } };
      case null { return [] };
    };
    let owned = sources.values().filter(func(s) = s.notebookId == notebookId and s.owner == owner).toArray();
    let sorted = owned.sort(func(a, b) = Nat.compare(b.id, a.id));
    sorted.map(func(s) = { source = s; chunkCount = 0 });
  };

  /// Fetch one source, enforcing ownership.
  public func getSource(
    sources : Map.Map<Common.SourceId, SourceTypes.Source>,
    owner : Common.UserId,
    id : Common.SourceId,
  ) : ?SourceTypes.Source {
    switch (sources.get(id)) {
      case (?s) { if (s.owner == owner) { ?s } else { null } };
      case null { null };
    };
  };

  /// Delete a source and its chunks, enforcing ownership.
  public func deleteSource(
    sources : Map.Map<Common.SourceId, SourceTypes.Source>,
    chunks : Map.Map<Common.SourceId, [SourceTypes.SourceChunk]>,
    owner : Common.UserId,
    id : Common.SourceId,
  ) : Bool {
    switch (sources.get(id)) {
      case (?s) {
        if (s.owner != owner) { return false };
        sources.remove(id);
        chunks.remove(id);
        true;
      };
      case null { false };
    };
  };

  /// Split source text into retrievable chunks and persist them.
  public func indexChunks(
    state : { var nextChunkId : Nat },
    chunks : Map.Map<Common.SourceId, [SourceTypes.SourceChunk]>,
    source : SourceTypes.Source,
  ) : Nat {
    let text = if (source.content.size() == 0) { source.title } else { source.content };
    let words = text.split(#predicate(func(c : Char) : Bool { c == ' ' or c == '\n' or c == '\t' })).filter(func(w) = w.size() > 0).toArray();
    let chunkSize = 120;
    var built : [SourceTypes.SourceChunk] = [];
    var ordinal = 0;
    var start = 0;
    let total = words.size();
    while (start < total) {
      let end = if (start + chunkSize > total) { total } else { start + chunkSize };
      let slice = words.sliceToArray(start, end);
      let chunkText = slice.values().join(" ");
      let chunk : SourceTypes.SourceChunk = {
        id = state.nextChunkId;
        sourceId = source.id;
        notebookId = source.notebookId;
        owner = source.owner;
        ordinal;
        text = chunkText;
      };
      state.nextChunkId := state.nextChunkId + 1;
      built := built.concat([chunk]);
      ordinal += 1;
      start := end;
    };
    chunks.add(source.id, built);
    built.size();
  };

  /// Mark a source as processing, ready or failed.
  public func setSourceStatus(
    sources : Map.Map<Common.SourceId, SourceTypes.Source>,
    owner : Common.UserId,
    id : Common.SourceId,
    status : Common.SourceStatus,
    pageCount : Nat,
    errorMessage : Text,
  ) : ?SourceTypes.Source {
    switch (sources.get(id)) {
      case (?s) {
        if (s.owner != owner) { return null };
        let updated : SourceTypes.Source = {
          id = s.id;
          notebookId = s.notebookId;
          owner = s.owner;
          title = s.title;
          kind = s.kind;
          url = s.url;
          content = s.content;
          storageKey = s.storageKey;
          sizeBytes = s.sizeBytes;
          status;
          pageCount;
          errorMessage;
          createdAt = s.createdAt;
          updatedAt = Time.now();
        };
        sources.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };
};
