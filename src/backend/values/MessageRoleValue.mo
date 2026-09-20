import OQL "mo:caffeineai-oql";

module {
  /// OQL row conversion for `ChatTypes.MessageRole`.
  public func _toRow(self : { #user; #assistant }) : OQL.Value =
    #text(
      switch (self) {
        case (#user) { "user" };
        case (#assistant) { "assistant" };
      }
    );
};
