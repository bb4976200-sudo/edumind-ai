import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `Common.Timestamp` (an `Int`).
  public func _toRow(self : Int) : OQL.Value = #int(self);
};
