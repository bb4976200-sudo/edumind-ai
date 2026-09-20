import Map "mo:core/Map";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import ChatTypes "../types/chat";
import KnowledgeTypes "../types/knowledge";
import ChatLib "../lib/chat";

mixin (
  state : { var nextConversationId : Nat; var nextMessageId : Nat },
  conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
  messages : Map.Map<Common.ConversationId, [ChatTypes.Message]>,
  notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
  engine : KnowledgeTypes.KnowledgeEngine,
) {
  /// Start a conversation inside one of the caller's notebooks.
  public shared ({ caller }) func createConversation(notebookId : Common.NotebookId, title : Text) : async Common.Result<ChatTypes.Conversation> {
    ChatLib.createConversation(state, conversations, notebooks, caller, notebookId, title);
  };

  /// List the conversations of one of the caller's notebooks.
  public query ({ caller }) func listConversations(notebookId : Common.NotebookId) : async [ChatTypes.ConversationSummary] {
    ChatLib.listConversations(conversations, messages, notebooks, caller, notebookId);
  };

  /// Fetch one of the caller's conversations.
  public query ({ caller }) func getConversation(id : Common.ConversationId) : async ?ChatTypes.Conversation {
    ChatLib.getConversation(conversations, caller, id);
  };

  /// Delete one of the caller's conversations and its messages.
  public shared ({ caller }) func deleteConversation(id : Common.ConversationId) : async Bool {
    ChatLib.deleteConversation(conversations, messages, caller, id);
  };

  /// List the messages of one of the caller's conversations.
  public query ({ caller }) func listMessages(conversationId : Common.ConversationId) : async [ChatTypes.Message] {
    ChatLib.listMessages(messages, conversations, caller, conversationId);
  };

  /// Ask a question grounded in the notebook's sources.
  public shared ({ caller }) func askQuestion(conversationId : Common.ConversationId, question : Text) : async Common.Result<ChatTypes.Answer> {
    await ChatLib.askQuestion(state, messages, conversations, engine, caller, conversationId, question);
  };
};
