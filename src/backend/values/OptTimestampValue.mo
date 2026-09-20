import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `?Common.Timestamp`, using `0` as the null sentinel.
  public func _toRow(self : ?Int) : OQL.Value =
    switch (self) {
      case null { #int(0) };
      case (?t) { #int(t) };
    };
};
