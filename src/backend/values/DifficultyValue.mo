import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `Common.Difficulty`.
  public func _toRow(self : { #beginner; #intermediate; #advanced; #exam }) : OQL.Value =
    #text(
      switch (self) {
        case (#beginner) { "beginner" };
        case (#intermediate) { "intermediate" };
        case (#advanced) { "advanced" };
        case (#exam) { "exam" };
      }
    );
};
