import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `Common.SourceStatus`.
  public func _toRow(self : { #pending; #processing; #ready; #failed }) : OQL.Value =
    #text(
      switch (self) {
        case (#pending) { "pending" };
        case (#processing) { "processing" };
        case (#ready) { "ready" };
        case (#failed) { "failed" };
      }
    );
};
