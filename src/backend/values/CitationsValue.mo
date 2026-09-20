import OQL "mo:caffeineai-oql";
import Common "../types/common";

module {
  /// OQL row conversion for `[Common.Citation]`, flattened to a
  /// `sourceId:sourceTitle` list so the column stays queryable as text.
  public func _toRow(self : [Common.Citation]) : OQL.Value =
    #text(
      self
        .map(func c = c.sourceId.toText() # ":" # c.sourceTitle)
        .values()
        .join("; ")
    );
};
