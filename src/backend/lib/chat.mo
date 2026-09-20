import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import ChatTypes "../types/chat";
import KnowledgeTypes "../types/knowledge";

module {
  /// Create a conversation inside a notebook, enforcing ownership.
  public func createConversation(
    state : { var nextConversationId : Nat },
    conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
    title : Text,
  ) : Common.Result<ChatTypes.Conversation> {
    switch (notebooks.get(notebookId)) {
      case (?n) { if (n.owner != owner) { return #err(#notAuthorized) } };
      case null { return #err(#notFound("Notebook not found")) };
    };
    let id = state.nextConversationId;
    state.nextConversationId := id + 1;
    let now = Time.now();
    let conversation : ChatTypes.Conversation = {
      id;
      notebookId;
      owner;
      title = if (title.trim(#char ' ').size() == 0) { "New conversation" } else { title };
      createdAt = now;
      updatedAt = now;
    };
    conversations.add(id, conversation);
    #ok(conversation);
  };

  /// List the conversations of a notebook, enforcing ownership.
  public func listConversations(
    conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
    messages : Map.Map<Common.ConversationId, [ChatTypes.Message]>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
  ) : [ChatTypes.ConversationSummary] {
    switch (notebooks.get(notebookId)) {
      case (?n) { if (n.owner != owner) { return [] } };
      case null { return [] };
    };
    let owned = conversations.values().filter(func(c) = c.notebookId == notebookId and c.owner == owner).toArray();
    let sorted = owned.sort(func(a, b) = Nat.compare(b.id, a.id));
    sorted.map(func(c) = { conversation = c; messageCount = (messages.get(c.id) ?? []).size() });
  };

  /// Fetch one conversation, enforcing ownership.
  public func getConversation(
    conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
    owner : Common.UserId,
    id : Common.ConversationId,
  ) : ?ChatTypes.Conversation {
    switch (conversations.get(id)) {
      case (?c) { if (c.owner == owner) { ?c } else { null } };
      case null { null };
    };
  };

  /// Delete a conversation and its messages, enforcing ownership.
  public func deleteConversation(
    conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
    messages : Map.Map<Common.ConversationId, [ChatTypes.Message]>,
    owner : Common.UserId,
    id : Common.ConversationId,
  ) : Bool {
    switch (conversations.get(id)) {
      case (?c) {
        if (c.owner != owner) { return false };
        conversations.remove(id);
        messages.remove(id);
        true;
      };
      case null { false };
    };
  };

  /// Append a message to a conversation, enforcing ownership.
  public func appendMessage(
    state : { var nextMessageId : Nat },
    messages : Map.Map<Common.ConversationId, [ChatTypes.Message]>,
    conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
    owner : Common.UserId,
    conversationId : Common.ConversationId,
    role : ChatTypes.MessageRole,
    content : Text,
    citations : [Common.Citation],
  ) : Common.Result<ChatTypes.Message> {
    let conversation = switch (conversations.get(conversationId)) {
      case (?c) { if (c.owner != owner) { return #err(#notAuthorized) }; c };
      case null { return #err(#notFound("Conversation not found")) };
    };
    let id = state.nextMessageId;
    state.nextMessageId := id + 1;
    let message : ChatTypes.Message = {
      id;
      conversationId;
      notebookId = conversation.notebookId;
      owner;
      role;
      content;
      citations;
      createdAt = Time.now();
    };
    let existing = messages.get(conversationId) ?? [];
    messages.add(conversationId, existing.concat([message]));
    #ok(message);
  };

  /// List the messages of a conversation, enforcing ownership.
  public func listMessages(
    messages : Map.Map<Common.ConversationId, [ChatTypes.Message]>,
    conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
    owner : Common.UserId,
    conversationId : Common.ConversationId,
  ) : [ChatTypes.Message] {
    switch (conversations.get(conversationId)) {
      case (?c) { if (c.owner != owner) { return [] } };
      case null { return [] };
    };
    messages.get(conversationId) ?? [];
  };

  /// Ask a question: persist the user turn, call the engine, persist the answer.
  public func askQuestion(
    state : { var nextMessageId : Nat },
    messages : Map.Map<Common.ConversationId, [ChatTypes.Message]>,
    conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>,
    engine : KnowledgeTypes.KnowledgeEngine,
    owner : Common.UserId,
    conversationId : Common.ConversationId,
    question : Text,
  ) : async Common.Result<ChatTypes.Answer> {
    let conversation = switch (conversations.get(conversationId)) {
      case (?c) { if (c.owner != owner) { return #err(#notAuthorized) }; c };
      case null { return #err(#notFound("Conversation not found")) };
    };
    if (question.trim(#char ' ').size() == 0) {
      return #err(#invalidInput("Question cannot be empty"));
    };
    let history = (messages.get(conversationId) ?? []).map(func(m) = m.content);
    let userMessage = switch (appendMessage(state, messages, conversations, owner, conversationId, #user, question, [])) {
      case (#ok(m)) { m };
      case (#err(e)) { return #err(e) };
    };
    let answer = await engine.askQuestion(owner, {
      notebookId = conversation.notebookId;
      question;
      history;
    });
    let assistantMessage = switch (appendMessage(state, messages, conversations, owner, conversationId, #assistant, answer.text, answer.citations)) {
      case (#ok(m)) { m };
      case (#err(e)) { return #err(e) };
    };
    #ok({ conversationId; userMessage; assistantMessage });
  };
};
