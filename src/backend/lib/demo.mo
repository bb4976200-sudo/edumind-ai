import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

import Common "../types/common";
import NotebookTypes "../types/notebooks";
import SourceTypes "../types/sources";
import StudyTypes "../types/study";
import DemoTypes "../types/demo";

module {
  /// The Indian Economy demo seed used when no real knowledge engine is
  /// connected. Chapters: Monetary Policy, Fiscal Policy, Inflation, Banking,
  /// National Income.
  public func indianEconomySeed() : DemoTypes.DemoSeed {
    {
      notebookTitle = "Indian Economy";
      notebookDescription = "Demo notebook covering monetary policy, fiscal policy, inflation, banking and national income.";
      chapters = [
        { title = "Monetary Policy"; order = 0 },
        { title = "Fiscal Policy"; order = 1 },
        { title = "Inflation"; order = 2 },
        { title = "Banking"; order = 3 },
        { title = "National Income"; order = 4 },
      ];
      sources = [
        {
          title = "Monetary Policy — RBI Framework";
          kind = #note;
          url = "";
          content = "Monetary policy is conducted by the Reserve Bank of India through the Monetary Policy Committee. The committee targets consumer price inflation of 4 percent with a tolerance band of plus or minus 2 percent. Its instruments include the repo rate, the reverse repo rate, the cash reserve ratio and open market operations. A repo rate cut lowers borrowing costs and stimulates demand, while a hike cools inflation.";
          pageCount = 1;
        },
        {
          title = "Fiscal Policy and the Union Budget";
          kind = #note;
          url = "";
          content = "Fiscal policy is the use of government taxation and spending to influence the economy. Expansionary fiscal policy raises spending or cuts taxes to boost demand, while contractionary fiscal policy reduces spending or raises taxes to control inflation. The Union Budget sets the fiscal deficit target and the Fiscal Responsibility and Budget Management Act guides consolidation.";
          pageCount = 1;
        },
        {
          title = "Inflation — Concepts and Measurement";
          kind = #note;
          url = "";
          content = "Inflation is a sustained rise in the general price level that reduces purchasing power. It is measured by the Consumer Price Index and the Wholesale Price Index. Demand-pull inflation arises when aggregate demand exceeds supply, while cost-push inflation arises from rising input costs. Core inflation excludes volatile food and fuel prices.";
          pageCount = 1;
        },
        {
          title = "Banking in India";
          kind = #note;
          url = "";
          content = "The Indian banking system includes scheduled commercial banks, cooperative banks and regional rural banks, regulated by the Reserve Bank of India. Key concepts include the cash reserve ratio, the statutory liquidity ratio, non-performing assets and priority sector lending. Financial inclusion is advanced through Jan Dhan accounts, mobile banking and the Unified Payments Interface.";
          pageCount = 1;
        },
        {
          title = "National Income Accounting";
          kind = #note;
          url = "";
          content = "National income measures the total value of goods and services produced in a year. Gross Domestic Product is the market value of all final goods and services produced within the domestic territory. Gross National Product adds net factor income from abroad. Net National Product at factor cost is called national income.";
          pageCount = 1;
        },
      ];
      notes = [
        {
          title = "Monetary Policy — Summary";
          kind = #summary;
          difficulty = #beginner;
          content = "## Monetary Policy\n\nThe RBI manages money supply and interest rates to keep inflation near 4 percent and support growth. Its main tools are the repo rate, reverse repo rate, cash reserve ratio and open market operations.";
        },
        {
          title = "Inflation — Detailed Notes";
          kind = #detailedNotes;
          difficulty = #intermediate;
          content = "## Inflation\n\nInflation is a sustained rise in the general price level. Demand-pull inflation arises when aggregate demand exceeds supply; cost-push inflation arises from rising input costs. Core inflation excludes volatile food and fuel prices.";
        },
      ];
      flashcards = [
        { front = "What is monetary policy?"; back = "Central bank management of money supply and interest rates to achieve price stability and growth." },
        { front = "What is the repo rate?"; back = "The rate at which the RBI lends short-term funds to commercial banks." },
        { front = "What is fiscal policy?"; back = "Government use of taxation and spending to influence the economy." },
        { front = "What is demand-pull inflation?"; back = "Inflation caused by aggregate demand exceeding available supply." },
        { front = "What is GDP?"; back = "The market value of all final goods and services produced within a country's domestic territory in a year." },
      ];
      questions = [
        {
          kind = #mcq;
          prompt = "What inflation target does the RBI Monetary Policy Committee aim for?";
          options = ["2 percent", "4 percent with a 2 percent band", "6 percent", "8 percent"];
          correctIndex = 1;
          explanation = "The RBI targets consumer price inflation of 4 percent with a tolerance band of plus or minus 2 percent.";
          topic = "Monetary Policy";
        },
        {
          kind = #trueFalse;
          prompt = "Expansionary fiscal policy involves raising taxes to boost demand.";
          options = ["True", "False"];
          correctIndex = 1;
          explanation = "Expansionary fiscal policy raises spending or cuts taxes; raising taxes is contractionary.";
          topic = "Fiscal Policy";
        },
        {
          kind = #mcq;
          prompt = "Demand-pull inflation occurs when:";
          options = ["Input costs rise", "Aggregate demand exceeds supply", "The RBI raises the repo rate", "Exports fall"];
          correctIndex = 1;
          explanation = "Demand-pull inflation arises when aggregate demand exceeds available supply.";
          topic = "Inflation";
        },
        {
          kind = #mcq;
          prompt = "Which ratio requires banks to hold a minimum share of deposits in liquid assets?";
          options = ["Cash reserve ratio", "Statutory liquidity ratio", "Fiscal deficit", "Repo rate"];
          correctIndex = 1;
          explanation = "The statutory liquidity ratio requires banks to hold a minimum share of deposits in liquid assets.";
          topic = "Banking";
        },
        {
          kind = #mcq;
          prompt = "Net National Product at factor cost is also called:";
          options = ["Gross Domestic Product", "National income", "Per capita income", "Disposable income"];
          correctIndex = 1;
          explanation = "Net National Product at factor cost is called national income.";
          topic = "National Income";
        },
      ];
      quizTitle = "Indian Economy — Practice Quiz";
      quizDifficulty = #easy;
    };
  };

  /// Seed the demo notebook for `owner` if it does not already exist.
  public func seedDemoNotebook(
    state : {
      var nextNotebookId : Nat;
      var nextSourceId : Nat;
      var nextNoteId : Nat;
      var nextFlashcardId : Nat;
      var nextQuizId : Nat;
      var nextQuestionId : Nat;
      var nextChunkId : Nat;
    },
    notebooks : Map.Map<Common.NotebookId, NotebookTypes.Notebook>,
    chapters : Map.Map<Common.NotebookId, [NotebookTypes.Chapter]>,
    sources : Map.Map<Common.SourceId, SourceTypes.Source>,
    chunks : Map.Map<Common.SourceId, [SourceTypes.SourceChunk]>,
    notes : Map.Map<Common.NoteId, StudyTypes.Note>,
    flashcards : Map.Map<Common.FlashcardId, StudyTypes.Flashcard>,
    quizzes : Map.Map<Common.QuizId, StudyTypes.Quiz>,
    questions : Map.Map<Common.QuizId, [StudyTypes.QuizQuestion]>,
    owner : Common.UserId,
  ) : NotebookTypes.Notebook {
    let seed = indianEconomySeed();

    // Idempotent: return the existing demo notebook when already seeded.
    switch (notebooks.values().find(func(n) = n.owner == owner and n.title == seed.notebookTitle)) {
      case (?existing) { return existing };
      case null {};
    };

    let now = Time.now();
    let notebookId = state.nextNotebookId;
    state.nextNotebookId := notebookId + 1;
    let notebook : NotebookTypes.Notebook = {
      id = notebookId;
      owner;
      title = seed.notebookTitle;
      description = seed.notebookDescription;
      createdAt = now;
      updatedAt = now;
    };
    notebooks.add(notebookId, notebook);

    let builtChapters = seed.chapters.map(func(c) = ({
      id = c.order;
      notebookId;
      title = c.title;
      order = c.order;
    } : NotebookTypes.Chapter));
    chapters.add(notebookId, builtChapters);

    for (s in seed.sources.values()) {
      let sourceId = state.nextSourceId;
      state.nextSourceId := sourceId + 1;
      let source : SourceTypes.Source = {
        id = sourceId;
        notebookId;
        owner;
        title = s.title;
        kind = s.kind;
        url = s.url;
        content = s.content;
        storageKey = "";
        sizeBytes = 0;
        status = #ready;
        pageCount = s.pageCount;
        errorMessage = "";
        createdAt = now;
        updatedAt = now;
      };
      sources.add(sourceId, source);
      let chunk : SourceTypes.SourceChunk = {
        id = state.nextChunkId;
        sourceId;
        notebookId;
        owner;
        ordinal = 0;
        text = s.content;
      };
      state.nextChunkId := state.nextChunkId + 1;
      chunks.add(sourceId, [chunk]);
    };

    for (n in seed.notes.values()) {
      let noteId = state.nextNoteId;
      state.nextNoteId := noteId + 1;
      let note : StudyTypes.Note = {
        id = noteId;
        notebookId;
        owner;
        title = n.title;
        kind = n.kind;
        difficulty = n.difficulty;
        content = n.content;
        createdAt = now;
        updatedAt = now;
      };
      notes.add(noteId, note);
    };

    for (f in seed.flashcards.values()) {
      let cardId = state.nextFlashcardId;
      state.nextFlashcardId := cardId + 1;
      let card : StudyTypes.Flashcard = {
        id = cardId;
        notebookId;
        owner;
        front = f.front;
        back = f.back;
        knownCount = 0;
        reviewCount = 0;
        lastReviewedAt = null;
        createdAt = now;
      };
      flashcards.add(cardId, card);
    };

    let quizId = state.nextQuizId;
    state.nextQuizId := quizId + 1;
    let quiz : StudyTypes.Quiz = {
      id = quizId;
      notebookId;
      owner;
      title = seed.quizTitle;
      difficulty = seed.quizDifficulty;
      createdAt = now;
    };
    quizzes.add(quizId, quiz);
    let builtQuestions = List.empty<StudyTypes.QuizQuestion>();
    for (q in seed.questions.values()) {
      let question : StudyTypes.QuizQuestion = {
        id = state.nextQuestionId;
        quizId;
        owner;
        kind = q.kind;
        prompt = q.prompt;
        options = q.options;
        correctIndex = q.correctIndex;
        explanation = q.explanation;
        topic = q.topic;
      };
      state.nextQuestionId := state.nextQuestionId + 1;
      builtQuestions.add(question);
    };
    questions.add(quizId, builtQuestions.toArray());

    notebook;
  };
};
