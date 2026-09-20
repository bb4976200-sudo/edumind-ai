import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `Common.StudyMaterialKind`.
  public func _toRow(self : { #summary; #detailedNotes; #flashcards; #quiz }) : OQL.Value =
    #text(
      switch (self) {
        case (#summary) { "summary" };
        case (#detailedNotes) { "detailedNotes" };
        case (#flashcards) { "flashcards" };
        case (#quiz) { "quiz" };
      }
    );
};
