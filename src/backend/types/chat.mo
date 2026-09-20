import Common "common";

module {
  public type NotebookId = Common.NotebookId;
  public type ConversationId = Common.ConversationId;
  public type MessageId = Common.MessageId;
  public type Timestamp = Common.Timestamp;
  public type UserId = Common.UserId;
  public type Citation = Common.Citation;

  /// Who produced a message.
  public type MessageRole = {
    #user;
    #assistant;
  };

  /// A single turn in a notebook conversation.
  public type Message = {
    id : MessageId;
    conversationId : ConversationId;
    notebookId : NotebookId;
    owner : UserId;
    role : MessageRole;
    content : Text;
    citations : [Citation];
    createdAt : Timestamp;
  };

  /// A chat thread scoped to one notebook.
  public type Conversation = {
    id : ConversationId;
    notebookId : NotebookId;
    owner : UserId;
    title : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  /// A conversation plus its message count, for history lists.
  public type ConversationSummary = {
    conversation : Conversation;
    messageCount : Nat;
  };

  /// The assistant's answer to a question, with grounding citations.
  public type Answer = {
    conversationId : ConversationId;
    userMessage : Message;
    assistantMessage : Message;
  };
};
