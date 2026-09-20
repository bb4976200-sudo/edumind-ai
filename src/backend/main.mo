import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import OQL "mo:caffeineai-oql";
import MapEntity "mo:caffeineai-oql/MapEntity";
import Entity "mo:caffeineai-oql/Entity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";

import TimestampValue "values/TimestampValue";
import OptTimestampValue "values/OptTimestampValue";
import SourceKindValue "values/SourceKindValue";
import SourceStatusValue "values/SourceStatusValue";
import DifficultyValue "values/DifficultyValue";
import StudyMaterialKindValue "values/StudyMaterialKindValue";
import QuizDifficultyValue "values/QuizDifficultyValue";
import MessageRoleValue "values/MessageRoleValue";
import QuestionKindValue "values/QuestionKindValue";
import CitationsValue "values/CitationsValue";
import TextListValue "values/TextListValue";

import Common "types/common";
import NotebookTypes "types/notebooks";
import SourceTypes "types/sources";
import ChatTypes "types/chat";
import StudyTypes "types/study";
import KnowledgeTypes "types/knowledge";

import KnowledgeLib "lib/knowledge";

import NotebooksApi "mixins/notebooks-api";
import SourcesApi "mixins/sources-api";
import ChatApi "mixins/chat-api";
import StudyApi "mixins/study-api";
import SearchApi "mixins/search-api";
import DemoApi "mixins/demo-api";
import ApiDocMixin "mixins/api-doc";

actor {
  // --- Stable state -------------------------------------------------------
  let accessControlState : AccessControl.AccessControlState;

  let counters : {
    var nextNotebookId : Nat;
    var nextSourceId : Nat;
    var nextChunkId : Nat;
    var nextConversationId : Nat;
    var nextMessageId : Nat;
    var nextNoteId : Nat;
    var nextFlashcardId : Nat;
    var nextQuizId : Nat;
    var nextQuestionId : Nat;
  };

  let notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>;
  let chapters : Map.Map<Common.NotebookId, [NotebookTypes.Chapter]>;
  let sources : Map.Map<Common.SourceId, SourceTypes.Source>;
  let chunks : Map.Map<Common.SourceId, [SourceTypes.SourceChunk]>;
  let conversations : Map.Map<Common.ConversationId, ChatTypes.Conversation>;
  let messages : Map.Map<Common.ConversationId, [ChatTypes.Message]>;
  let notes : Map.Map<Common.NoteId, StudyTypes.Note>;
  let flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>;
  let quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>;
  let questions : Map.Map<Common.QuizId, [StudyTypes.QuizQuestion]>;
  let progress : Map.Map<Common.NotebookId, StudyTypes.StudyProgress>;

  // --- Knowledge engine (modular, swappable) ------------------------------
  transient let engine : KnowledgeTypes.KnowledgeEngine = KnowledgeLib.activeEngine();

  // --- API surface --------------------------------------------------------
  include MixinAuthorization(accessControlState, null);

  include NotebooksApi(counters, notebooks, chapters, sources, notes, flashcards, quizzes, conversations);
  include SourcesApi(counters, sources, chunks, notebooks, engine);
  include ChatApi(counters, conversations, messages, notebooks, engine);
  include StudyApi(counters, notes, flashcards, quizzes, questions, progress, notebooks, engine);
  include SearchApi(notebooks, sources, notes, flashcards, conversations, quizzes);
  include DemoApi(counters, notebooks, chapters, sources, chunks, notes, flashcards, quizzes, questions);
  include ApiDocMixin();

  // --- OQL exposure -------------------------------------------------------
  transient let anyPrincipal = Principal.fromText("aaaaa-aa");

  // Flatten the nested per-key arrays into one row per element so each
  // element becomes a queryable OQL row.
  func flattenChunks() : Iter.Iter<(Common.SourceId, SourceTypes.SourceChunk)> {
    chunks.entries().flatMap(
      func ((sourceId, list)) = list.values().map(func c = (sourceId, c))
    );
  };

  func flattenMessages() : Iter.Iter<(Common.ConversationId, ChatTypes.Message)> {
    messages.entries().flatMap(
      func ((conversationId, list)) = list.values().map(func m = (conversationId, m))
    );
  };

  func flattenQuestions() : Iter.Iter<(Common.QuizId, StudyTypes.QuizQuestion)> {
    questions.entries().flatMap(
      func ((quizId, list)) = list.values().map(func q = (quizId, q))
    );
  };

  include Expose({
    entities = [
      notebooks.toEntity("notebook", "Notebook", "id")
        .sample({ id = 0; owner = anyPrincipal; title = ""; description = ""; createdAt = 0; updatedAt = 0 })
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      sources.toEntity("source", "Source", "id")
        .sample({
          id = 0;
          notebookId = 0;
          owner = anyPrincipal;
          title = "";
          kind = #text;
          url = "";
          content = "";
          storageKey = "";
          sizeBytes = 0;
          status = #pending;
          pageCount = 0;
          errorMessage = "";
          createdAt = 0;
          updatedAt = 0;
        })
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      notes.toEntity("note", "Note", "id")
        .sample({ id = 0; notebookId = 0; owner = anyPrincipal; title = ""; kind = #summary; difficulty = #beginner; content = ""; createdAt = 0; updatedAt = 0 })
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      flashcards.toEntity("flashcard", "Flashcard", "id")
        .sample({ id = 0; notebookId = 0; owner = anyPrincipal; front = ""; back = ""; knownCount = 0; reviewCount = 0; lastReviewedAt = null; createdAt = 0 })
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      quizzes.toEntity("quiz", "Quiz", "id")
        .sample({ id = 0; notebookId = 0; owner = anyPrincipal; title = ""; difficulty = #easy; createdAt = 0 })
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      conversations.toEntity("conversation", "Conversation", "id")
        .sample({ id = 0; notebookId = 0; owner = anyPrincipal; title = ""; createdAt = 0; updatedAt = 0 })
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      progress.toEntity("studyProgress", "StudyProgress", "id")
        .sample({
          id = 0;
          notebookId = 0;
          owner = anyPrincipal;
          notesGenerated = 0;
          flashcardsReviewed = 0;
          quizzesTaken = 0;
          questionsAnswered = 0;
          questionsCorrect = 0;
          lastActivityAt = 0;
        })
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      // `chunks : Map<SourceId, [SourceChunk]>` — one row per chunk, so the
      // nested array is flattened into a single iterator.
      OQL.Entity.manual<(Common.SourceId, SourceTypes.SourceChunk)>(
        "sourceChunk",
        func () = flattenChunks(),
        "SourceChunk",
        "id",
      )
        .sample((0, { id = 0; sourceId = 0; notebookId = 0; owner = anyPrincipal; ordinal = 0; text = "" }))
        .payload("id", func ((_, c)) = c.id)
        .payload("sourceId", func ((_, c)) = c.sourceId)
        .payload("notebookId", func ((_, c)) = c.notebookId)
        .payload("owner", func ((_, c)) = c.owner)
        .payload("ordinal", func ((_, c)) = c.ordinal)
        .payload("text", func ((_, c)) = c.text)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      // `messages : Map<ConversationId, [Message]>` — one row per message.
      OQL.Entity.manual<(Common.ConversationId, ChatTypes.Message)>(
        "message",
        func () = flattenMessages(),
        "Message",
        "id",
      )
        .sample((
          0,
          {
            id = 0;
            conversationId = 0;
            notebookId = 0;
            owner = anyPrincipal;
            role = #user;
            content = "";
            citations = [];
            createdAt = 0;
          },
        ))
        .payload("id", func ((_, m)) = m.id)
        .payload("conversationId", func ((_, m)) = m.conversationId)
        .payload("notebookId", func ((_, m)) = m.notebookId)
        .payload("owner", func ((_, m)) = m.owner)
        .payload("role", func ((_, m)) = m.role)
        .payload("content", func ((_, m)) = m.content)
        .payload("citations", func ((_, m)) = m.citations)
        .payload("createdAt", func ((_, m)) = m.createdAt)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      // `questions : Map<QuizId, [QuizQuestion]>` — one row per question.
      OQL.Entity.manual<(Common.QuizId, StudyTypes.QuizQuestion)>(
        "quizQuestion",
        func () = flattenQuestions(),
        "QuizQuestion",
        "id",
      )
        .sample((
          0,
          {
            id = 0;
            quizId = 0;
            owner = anyPrincipal;
            kind = #mcq;
            prompt = "";
            options = [];
            correctIndex = 0;
            explanation = "";
            topic = "";
          },
        ))
        .payload("id", func ((_, q)) = q.id)
        .payload("quizId", func ((_, q)) = q.quizId)
        .payload("owner", func ((_, q)) = q.owner)
        .payload("kind", func ((_, q)) = q.kind)
        .payload("prompt", func ((_, q)) = q.prompt)
        .payload("options", func ((_, q)) = q.options)
        .payload("correctIndex", func ((_, q)) = q.correctIndex)
        .payload("explanation", func ((_, q)) = q.explanation)
        .payload("topic", func ((_, q)) = q.topic)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
    ];
  });
};
