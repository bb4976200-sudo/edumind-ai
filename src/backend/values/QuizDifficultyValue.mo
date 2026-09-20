import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `Common.QuizDifficulty`.
  public func _toRow(self : { #easy; #medium; #hard }) : OQL.Value =
    #text(
      switch (self) {
        case (#easy) { "easy" };
        case (#medium) { "medium" };
        case (#hard) { "hard" };
      }
    );
};
