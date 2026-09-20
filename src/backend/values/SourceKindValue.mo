import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `Common.SourceKind`.
  public func _toRow(self : { #pdf; #docx; #pptx; #text; #url; #youtube; #note }) : OQL.Value =
    #text(
      switch (self) {
        case (#pdf) { "pdf" };
        case (#docx) { "docx" };
        case (#pptx) { "pptx" };
        case (#text) { "text" };
        case (#url) { "url" };
        case (#youtube) { "youtube" };
        case (#note) { "note" };
      }
    );
};
