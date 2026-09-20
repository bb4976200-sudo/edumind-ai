import Map "mo:core/Map";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import SourceTypes "../types/sources";
import KnowledgeTypes "../types/knowledge";
import SourcesLib "../lib/sources";

mixin (
  state : { var nextSourceId : Nat; var nextChunkId : Nat },
  sources : Map.Map<Common.SourceId, SourceTypes.Source>,
  chunks : Map.Map<Common.SourceId, [SourceTypes.SourceChunk]>,
  notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
  engine : KnowledgeTypes.KnowledgeEngine,
) {
  /// Add a source to one of the caller's notebooks.
  public shared ({ caller }) func addSource(input : SourceTypes.SourceInput) : async Common.Result<SourceTypes.Source> {
    SourcesLib.addSource(state, sources, notebooks, caller, input);
  };

  /// List the sources of one of the caller's notebooks.
  public query ({ caller }) func listSources(notebookId : Common.NotebookId) : async [SourceTypes.SourceSummary] {
    let base = SourcesLib.listSources(sources, notebooks, caller, notebookId);
    base.map(func(summary) = {
      source = summary.source;
      chunkCount = (chunks.get(summary.source.id) ?? []).size();
    });
  };

  /// Fetch one of the caller's sources.
  public query ({ caller }) func getSource(id : Common.SourceId) : async ?SourceTypes.Source {
    SourcesLib.getSource(sources, caller, id);
  };

  /// Send a source through the knowledge engine and record its status.
  public shared ({ caller }) func processSource(id : Common.SourceId) : async Common.Result<SourceTypes.Source> {
    let source = switch (SourcesLib.getSource(sources, caller, id)) {
      case (?s) { s };
      case null { return #err(#notFound("Source not found")) };
    };
    ignore SourcesLib.setSourceStatus(sources, caller, id, #processing, source.pageCount, "");
    let result = await engine.processSource(caller, id);
    let updated = switch (SourcesLib.setSourceStatus(sources, caller, id, result.status, result.pageCount, result.errorMessage)) {
      case (?s) { s };
      case null { return #err(#notFound("Source not found")) };
    };
    if (result.status == #ready) {
      ignore SourcesLib.indexChunks(state, chunks, updated);
    };
    #ok(updated);
  };

  /// Delete one of the caller's sources and its chunks.
  public shared ({ caller }) func deleteSource(id : Common.SourceId) : async Bool {
    SourcesLib.deleteSource(sources, chunks, caller, id);
  };
};
