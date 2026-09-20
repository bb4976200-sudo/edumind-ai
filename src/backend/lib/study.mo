import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import StudyTypes "../types/study";
import KnowledgeTypes "../types/knowledge";

module {
  // --- Internal helpers ---------------------------------------------------

  func kindLabel(kind : Common.StudyMaterialKind) : Text {
    switch (kind) {
      case (#summary) { "Summary" };
      case (#detailedNotes) { "Detailed Notes" };
      case (#flashcards) { "Flashcards" };
      case (#quiz) { "Quiz" };
    };
  };

  func bumpProgress(
    progress : Map.Map<Common.NotebookId, StudyTypes.StudyProgress>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
    update : StudyTypes.StudyProgress -> StudyTypes.StudyProgress,
  ) : () {
    let current = switch (progress.get(notebookId)) {
      case (?p) { p };
      case null {
        {
          id = notebookId;
          notebookId;
          owner;
          notesGenerated = 0;
          flashcardsReviewed = 0;
          quizzesTaken = 0;
          questionsAnswered = 0;
          questionsCorrect = 0;
          lastActivityAt = 0;
        };
      };
    };
    progress.add(notebookId, update(current));
  };

  /// Generate and persist a note document, enforcing ownership.
  public func generateNote(
    state : { var nextNoteId : Nat },
    notes : Map.Map<Common.NoteId, StudyTypes.Note>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    engine : KnowledgeTypes.KnowledgeEngine,
    owner : Common.UserId,
    request : StudyTypes.NoteRequest,
  ) : async Common.Result<StudyTypes.Note> {
    switch (notebooks.get(request.notebookId)) {
      case (?n) { if (n.owner != owner) { return #err(#notAuthorized) } };
      case null { return #err(#notFound("Notebook not found")) };
    };
    let engineRequest : KnowledgeTypes.NotesRequest = {
      notebookId = request.notebookId;
      sourceId = request.sourceId;
      kind = request.kind;
      difficulty = request.difficulty;
      chapter = request.chapter;
    };
    let content = switch (request.kind) {
      case (#summary) { await engine.generateSummary(owner, engineRequest) };
      case (#detailedNotes) { await engine.generateNotes(owner, engineRequest) };
      case (#flashcards) { await engine.generateNotes(owner, engineRequest) };
      case (#quiz) { await engine.generateNotes(owner, engineRequest) };
    };
    let id = state.nextNoteId;
    state.nextNoteId := id + 1;
    let now = Time.now();
    let title = switch (request.chapter) {
      case (?chapter) { chapter };
      case null { kindLabel(request.kind) };
    };
    let note : StudyTypes.Note = {
      id;
      notebookId = request.notebookId;
      owner;
      title;
      kind = request.kind;
      difficulty = request.difficulty;
      content;
      createdAt = now;
      updatedAt = now;
    };
    notes.add(id, note);
    #ok(note);
  };

  /// List the notes of a notebook, enforcing ownership.
  public func listNotes(
    notes : Map.Map<Common.NoteId, StudyTypes.Note>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
  ) : [StudyTypes.Note] {
    switch (notebooks.get(notebookId)) {
      case (?n) { if (n.owner != owner) { return [] } };
      case null { return [] };
    };
    let owned = notes.values().filter(func(n) = n.notebookId == notebookId and n.owner == owner).toArray();
    owned.sort(func(a, b) = Nat.compare(b.id, a.id));
  };

  /// Fetch one note, enforcing ownership.
  public func getNote(
    notes : Map.Map<Common.NoteId, StudyTypes.Note>,
    owner : Common.UserId,
    id : Common.NoteId,
  ) : ?StudyTypes.Note {
    switch (notes.get(id)) {
      case (?n) { if (n.owner == owner) { ?n } else { null } };
      case null { null };
    };
  };

  /// Update a note's title and/or content, enforcing ownership.
  public func updateNote(
    notes : Map.Map<Common.NoteId, StudyTypes.Note>,
    owner : Common.UserId,
    id : Common.NoteId,
    title : ?Text,
    content : ?Text,
  ) : ?StudyTypes.Note {
    switch (notes.get(id)) {
      case (?n) {
        if (n.owner != owner) { return null };
        let updated : StudyTypes.Note = {
          id = n.id;
          notebookId = n.notebookId;
          owner = n.owner;
          title = title ?? n.title;
          kind = n.kind;
          difficulty = n.difficulty;
          content = content ?? n.content;
          createdAt = n.createdAt;
          updatedAt = Time.now();
        };
        notes.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  /// Delete a note, enforcing ownership.
  public func deleteNote(
    notes : Map.Map<Common.NoteId, StudyTypes.Note>,
    owner : Common.UserId,
    id : Common.NoteId,
  ) : Bool {
    switch (notes.get(id)) {
      case (?n) {
        if (n.owner != owner) { return false };
        notes.remove(id);
        true;
      };
      case null { false };
    };
  };

  /// Generate and persist flashcards, enforcing ownership.
  public func generateFlashcards(
    state : { var nextFlashcardId : Nat },
    flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    engine : KnowledgeTypes.KnowledgeEngine,
    owner : Common.UserId,
    request : StudyTypes.FlashcardRequest,
  ) : async Common.Result<[StudyTypes.Flashcard]> {
    switch (notebooks.get(request.notebookId)) {
      case (?n) { if (n.owner != owner) { return #err(#notAuthorized) } };
      case null { return #err(#notFound("Notebook not found")) };
    };
    let generated = await engine.generateFlashcards(owner, {
      notebookId = request.notebookId;
      sourceId = request.sourceId;
      count = request.count;
      difficulty = request.difficulty;
    });
    let now = Time.now();
    let built = List.empty<StudyTypes.Flashcard>();
    for (g in generated.values()) {
      let card : StudyTypes.Flashcard = {
        id = state.nextFlashcardId;
        notebookId = request.notebookId;
        owner;
        front = g.front;
        back = g.back;
        knownCount = 0;
        reviewCount = 0;
        lastReviewedAt = null;
        createdAt = now;
      };
      state.nextFlashcardId := state.nextFlashcardId + 1;
      built.add(card);
    };
    let cards = built.toArray();
    for (card in cards.values()) {
      flashcards.add(card.id, card);
    };
    #ok(cards);
  };

  /// List the flashcards of a notebook, enforcing ownership.
  public func listFlashcards(
    flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
  ) : [StudyTypes.Flashcard] {
    switch (notebooks.get(notebookId)) {
      case (?n) { if (n.owner != owner) { return [] } };
      case null { return [] };
    };
    let owned = flashcards.values().filter(func(f) = f.notebookId == notebookId and f.owner == owner).toArray();
    owned.sort(func(a, b) = Nat.compare(a.id, b.id));
  };

  /// Record a flashcard review outcome, enforcing ownership.
  public func reviewFlashcard(
    flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>,
    progress : Map.Map<Common.NotebookId, StudyTypes.StudyProgress>,
    owner : Common.UserId,
    id : Common.FlashcardId,
    known : Bool,
  ) : ?StudyTypes.Flashcard {
    switch (flashcards.get(id)) {
      case (?f) {
        if (f.owner != owner) { return null };
        let updated : StudyTypes.Flashcard = {
          id = f.id;
          notebookId = f.notebookId;
          owner = f.owner;
          front = f.front;
          back = f.back;
          knownCount = if (known) { f.knownCount + 1 } else { f.knownCount };
          reviewCount = f.reviewCount + 1;
          lastReviewedAt = ?Time.now();
          createdAt = f.createdAt;
        };
        flashcards.add(id, updated);
        bumpProgress(progress, owner, f.notebookId, func(p) = {
          id = p.id;
          notebookId = p.notebookId;
          owner = p.owner;
          notesGenerated = p.notesGenerated;
          flashcardsReviewed = p.flashcardsReviewed + 1;
          quizzesTaken = p.quizzesTaken;
          questionsAnswered = p.questionsAnswered;
          questionsCorrect = p.questionsCorrect;
          lastActivityAt = Time.now();
        });
        ?updated;
      };
      case null { null };
    };
  };

  /// Generate and persist a quiz with its questions, enforcing ownership.
  public func generateQuiz(
    state : { var nextQuizId : Nat; var nextQuestionId : Nat },
    quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
    questions : Map.Map<Common.QuizId, [StudyTypes.QuizQuestion]>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    engine : KnowledgeTypes.KnowledgeEngine,
    owner : Common.UserId,
    request : StudyTypes.QuizRequest,
  ) : async Common.Result<StudyTypes.Quiz> {
    switch (notebooks.get(request.notebookId)) {
      case (?n) { if (n.owner != owner) { return #err(#notAuthorized) } };
      case null { return #err(#notFound("Notebook not found")) };
    };
    let generated = await engine.generateQuiz(owner, {
      notebookId = request.notebookId;
      sourceId = request.sourceId;
      count = request.count;
      difficulty = request.difficulty;
      kinds = request.kinds;
    });
    let quizId = state.nextQuizId;
    state.nextQuizId := quizId + 1;
    let quiz : StudyTypes.Quiz = {
      id = quizId;
      notebookId = request.notebookId;
      owner;
      title = "Quiz " # quizId.toText();
      difficulty = request.difficulty;
      createdAt = Time.now();
    };
    quizzes.add(quizId, quiz);
    let built = List.empty<StudyTypes.QuizQuestion>();
    for (g in generated.values()) {
      let question : StudyTypes.QuizQuestion = {
        id = state.nextQuestionId;
        quizId;
        owner;
        kind = g.kind;
        prompt = g.prompt;
        options = g.options;
        correctIndex = g.correctIndex;
        explanation = g.explanation;
        topic = g.topic;
      };
      state.nextQuestionId := state.nextQuestionId + 1;
      built.add(question);
    };
    questions.add(quizId, built.toArray());
    #ok(quiz);
  };

  /// Fetch a quiz with its questions stripped of the answer key.
  public func getQuiz(
    quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
    questions : Map.Map<Common.QuizId, [StudyTypes.QuizQuestion]>,
    owner : Common.UserId,
    id : Common.QuizId,
  ) : ?(StudyTypes.Quiz, [StudyTypes.QuizQuestionView]) {
    switch (quizzes.get(id)) {
      case (?q) {
        if (q.owner != owner) { return null };
        let views = (questions.get(id) ?? []).map(func(question) = {
          id = question.id;
          kind = question.kind;
          prompt = question.prompt;
          options = question.options;
          topic = question.topic;
        });
        ?(q, views);
      };
      case null { null };
    };
  };

  /// List the quizzes of a notebook, enforcing ownership.
  public func listQuizzes(
    quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
  ) : [StudyTypes.Quiz] {
    switch (notebooks.get(notebookId)) {
      case (?n) { if (n.owner != owner) { return [] } };
      case null { return [] };
    };
    let owned = quizzes.values().filter(func(q) = q.notebookId == notebookId and q.owner == owner).toArray();
    owned.sort(func(a, b) = Nat.compare(b.id, a.id));
  };

  /// Grade a quiz submission and update study progress.
  public func submitQuiz(
    quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
    questions : Map.Map<Common.QuizId, [StudyTypes.QuizQuestion]>,
    progress : Map.Map<Common.NotebookId, StudyTypes.StudyProgress>,
    owner : Common.UserId,
    quizId : Common.QuizId,
    answers : [StudyTypes.QuizAnswer],
  ) : Common.Result<StudyTypes.QuizResult> {
    let quiz = switch (quizzes.get(quizId)) {
      case (?q) { if (q.owner != owner) { return #err(#notAuthorized) }; q };
      case null { return #err(#notFound("Quiz not found")) };
    };
    let all = questions.get(quizId) ?? [];
    var correctCount = 0;
    var wrongCount = 0;
    var weakTopics : [Text] = [];
    let items = List.empty<StudyTypes.QuizResultItem>();
    for (question in all.values()) {
      let selected = switch (answers.find(func(a) = a.questionId == question.id)) {
        case (?a) { a.selectedIndex };
        case null { 0 };
      };
      let isCorrect = selected == question.correctIndex;
      if (isCorrect) { correctCount += 1 } else {
        wrongCount += 1;
        if (not weakTopics.contains(question.topic)) {
          weakTopics := weakTopics.concat([question.topic]);
        };
      };
      items.add({
        questionId = question.id;
        prompt = question.prompt;
        selectedIndex = selected;
        correctIndex = question.correctIndex;
        correct = isCorrect;
        explanation = question.explanation;
        topic = question.topic;
      });
    };
    let itemViews = items.toArray();
    let total = all.size();
    let score = if (total == 0) { 0 } else { (correctCount * 100) / total };
    let recommended = weakTopics.map(func(topic) = "Revise " # topic);
    bumpProgress(progress, owner, quiz.notebookId, func(p) = {
      id = p.id;
      notebookId = p.notebookId;
      owner = p.owner;
      notesGenerated = p.notesGenerated;
      flashcardsReviewed = p.flashcardsReviewed;
      quizzesTaken = p.quizzesTaken + 1;
      questionsAnswered = p.questionsAnswered + total;
      questionsCorrect = p.questionsCorrect + correctCount;
      lastActivityAt = Time.now();
    });
    #ok({
      quizId;
      score;
      total;
      correctCount;
      wrongCount;
      items = itemViews;
      weakTopics;
      recommendedRevision = recommended;
    });
  };

  /// Fetch aggregate study progress for a notebook, enforcing ownership.
  public func getProgress(
    progress : Map.Map<Common.NotebookId, StudyTypes.StudyProgress>,
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    owner : Common.UserId,
    notebookId : Common.NotebookId,
  ) : ?StudyTypes.StudyProgress {
    switch (notebooks.get(notebookId)) {
      case (?n) { if (n.owner != owner) { return null } };
      case null { return null };
    };
    switch (progress.get(notebookId)) {
      case (?p) { if (p.owner == owner) { ?p } else { null } };
      case null {
        ?{
          id = notebookId;
          notebookId;
          owner;
          notesGenerated = 0;
          flashcardsReviewed = 0;
          quizzesTaken = 0;
          questionsAnswered = 0;
          questionsCorrect = 0;
          lastActivityAt = 0;
        };
      };
    };
  };

};
