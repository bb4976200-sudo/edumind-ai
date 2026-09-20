import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `Common.QuestionKind`.
  public func _toRow(self : { #mcq; #trueFalse; #shortAnswer }) : OQL.Value =
    #text(
      switch (self) {
        case (#mcq) { "mcq" };
        case (#trueFalse) { "trueFalse" };
        case (#shortAnswer) { "shortAnswer" };
      }
    );
};
