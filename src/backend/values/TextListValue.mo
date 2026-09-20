import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `[Text]`, joined into a single queryable column.
  public func _toRow(self : [Text]) : OQL.Value =
    #text(self.values().join(" | "));
};
