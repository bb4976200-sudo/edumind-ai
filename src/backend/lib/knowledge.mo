import Char "mo:core/Char";
import Text "mo:core/Text";

import Common "../types/common";
import KnowledgeTypes "../types/knowledge";

module {
  /// Prompt-injection patterns stripped from untrusted source content.
  let injectionPatterns : [Text] = [
    "ignore previous instructions",
    "ignore all previous instructions",
    "disregard previous instructions",
    "disregard all previous instructions",
    "forget previous instructions",
    "you are now",
    "system prompt",
    "reveal your instructions",
    "override your instructions",
    "act as an",
  ];

  /// The built-in Indian Economy corpus the mock engine answers from.
  let corpus : [(Text, Text)] = [
    (
      "Monetary Policy",
      "Monetary policy is the process by which a central bank manages the money supply and interest rates to achieve price stability and sustainable growth. The Reserve Bank of India conducts monetary policy through the Monetary Policy Committee, which targets consumer price inflation of 4 percent with a tolerance band of plus or minus 2 percent. Its main instruments are the repo rate, the reverse repo rate, the cash reserve ratio and open market operations. A repo rate cut lowers borrowing costs and stimulates demand, while a hike cools inflation.",
    ),
    (
      "Fiscal Policy",
      "Fiscal policy is the use of government taxation and spending to influence the economy. Expansionary fiscal policy raises spending or cuts taxes to boost demand during a slowdown, while contractionary fiscal policy reduces spending or raises taxes to control inflation. In India the Union Budget sets the fiscal deficit target, and the Fiscal Responsibility and Budget Management Act guides consolidation. Deficits are financed through market borrowing, which can crowd out private investment if excessive.",
    ),
    (
      "Inflation",
      "Inflation is a sustained rise in the general price level that reduces the purchasing power of money. It is measured in India by the Consumer Price Index and the Wholesale Price Index. Demand-pull inflation arises when aggregate demand exceeds supply, while cost-push inflation arises from rising input costs such as fuel or wages. Core inflation excludes volatile food and fuel prices. Moderate inflation is normal, but high inflation erodes savings and hurts fixed-income households.",
    ),
    (
      "Banking",
      "The Indian banking system includes scheduled commercial banks, cooperative banks and regional rural banks, regulated by the Reserve Bank of India. Banks accept deposits and lend, creating credit in the economy. Key concepts include the cash reserve ratio, the statutory liquidity ratio, non-performing assets, and priority sector lending. Financial inclusion is advanced through Jan Dhan accounts, mobile banking and the Unified Payments Interface. A sound banking system is essential for transmitting monetary policy.",
    ),
    (
      "National Income",
      "National income measures the total value of goods and services produced by a country in a year. Gross Domestic Product is the market value of all final goods and services produced within the domestic territory. Gross National Product adds net factor income from abroad. Net National Product at factor cost is called national income. India estimates these aggregates through the National Statistical Office using the production, income and expenditure methods.",
    ),
  ];

  /// The active knowledge engine. Swapping this binding for a real connector
  /// is the only change needed to replace the mock.
  public func activeEngine() : KnowledgeTypes.KnowledgeEngine {
    mockEngine();
  };

  /// A deterministic, source-grounded mock engine backed by the Indian Economy
  /// demo data. No network access.
  public func mockEngine() : KnowledgeTypes.KnowledgeEngine {
    {
      createNotebook = func(_owner : Common.UserId, _title : Text, _description : Text) : async Common.NotebookId {
        0;
      };
      addSource = func(_owner : Common.UserId, source : KnowledgeTypes.EngineSource) : async Common.SourceId {
        source.id;
      };
      processSource = func(_owner : Common.UserId, _sourceId : Common.SourceId) : async KnowledgeTypes.SourceStatusResult {
        { status = #ready; pageCount = 1; errorMessage = "" };
      };
      askQuestion = func(_owner : Common.UserId, request : KnowledgeTypes.AskRequest) : async KnowledgeTypes.EngineAnswer {
        answerFromCorpus(request.question);
      };
      generateSummary = func(_owner : Common.UserId, request : KnowledgeTypes.NotesRequest) : async Text {
        summaryFor(request);
      };
      generateNotes = func(_owner : Common.UserId, request : KnowledgeTypes.NotesRequest) : async Text {
        notesFor(request);
      };
      generateQuiz = func(_owner : Common.UserId, request : KnowledgeTypes.QuizGenRequest) : async [KnowledgeTypes.EngineQuestion] {
        quizFor(request);
      };
      generateFlashcards = func(_owner : Common.UserId, request : KnowledgeTypes.FlashcardsRequest) : async [KnowledgeTypes.EngineFlashcard] {
        flashcardsFor(request);
      };
      getSources = func(_owner : Common.UserId, _notebookId : Common.NotebookId) : async [KnowledgeTypes.EngineSource] {
        [];
      };
      searchNotebook = func(_owner : Common.UserId, _notebookId : Common.NotebookId, term : Text) : async [KnowledgeTypes.EngineSearchHit] {
        searchCorpus(term);
      };
    };
  };

  /// Inert NotebookLM connector stub implementing the same interface. It never
  /// performs network calls and reports `#engineUnavailable` until a real,
  /// officially supported integration is configured.
  public func notebookLMConnector() : KnowledgeTypes.KnowledgeEngine {
    {
      createNotebook = func(_owner : Common.UserId, _title : Text, _description : Text) : async Common.NotebookId {
        0;
      };
      addSource = func(_owner : Common.UserId, source : KnowledgeTypes.EngineSource) : async Common.SourceId {
        source.id;
      };
      processSource = func(_owner : Common.UserId, _sourceId : Common.SourceId) : async KnowledgeTypes.SourceStatusResult {
        { status = #failed; pageCount = 0; errorMessage = "NotebookLM connector is not configured" };
      };
      askQuestion = func(_owner : Common.UserId, _request : KnowledgeTypes.AskRequest) : async KnowledgeTypes.EngineAnswer {
        { text = "NotebookLM connector is not configured."; citations = [] };
      };
      generateSummary = func(_owner : Common.UserId, _request : KnowledgeTypes.NotesRequest) : async Text {
        "NotebookLM connector is not configured.";
      };
      generateNotes = func(_owner : Common.UserId, _request : KnowledgeTypes.NotesRequest) : async Text {
        "NotebookLM connector is not configured.";
      };
      generateQuiz = func(_owner : Common.UserId, _request : KnowledgeTypes.QuizGenRequest) : async [KnowledgeTypes.EngineQuestion] {
        [];
      };
      generateFlashcards = func(_owner : Common.UserId, _request : KnowledgeTypes.FlashcardsRequest) : async [KnowledgeTypes.EngineFlashcard] {
        [];
      };
      getSources = func(_owner : Common.UserId, _notebookId : Common.NotebookId) : async [KnowledgeTypes.EngineSource] {
        [];
      };
      searchNotebook = func(_owner : Common.UserId, _notebookId : Common.NotebookId, _term : Text) : async [KnowledgeTypes.EngineSearchHit] {
        [];
      };
    };
  };

  /// Strip prompt-injection patterns from untrusted source content before it
  /// reaches the engine.
  public func sanitizeSourceContent(content : Text) : Text {
    var cleaned = content;
    for (pattern in injectionPatterns.values()) {
      cleaned := cleaned.replace(#text pattern, "[redacted]");
    };
    cleaned;
  };

  /// Wrap untrusted source content in a delimited, instruction-free block.
  public func wrapUntrusted(content : Text) : Text {
    "<source-material>\n" # sanitizeSourceContent(content) # "\n</source-material>";
  };

  // --- Internal helpers ---------------------------------------------------

  func corpusEntry(question : Text) : ?(Text, Text) {
    let q = question.toLower();
    var best : ?(Text, Text) = null;
    var bestScore = 0;
    for (entry in corpus.values()) {
      let (topic, body) = (entry.0, entry.1);
      var score = 0;
      for (word in q.split(#predicate(func(c : Char) : Bool { c == ' ' or c == '?' or c == ',' or c == '.' }))) {
        let w = word.trim(#char ' ');
        if (w.size() > 3 and (topic.toLower().contains(#text w) or body.toLower().contains(#text w))) {
          score += 1;
        };
      };
      if (score > bestScore) {
        bestScore := score;
        best := ?entry;
      };
    };
    if (bestScore == 0) { null } else { best };
  };

  func answerFromCorpus(question : Text) : KnowledgeTypes.EngineAnswer {
    switch (corpusEntry(question)) {
      case (?(topic, body)) {
        {
          text = "**" # topic # "**\n\n" # body;
          citations = [{ sourceId = 0; sourceTitle = topic; snippet = snippetOf(body) }];
        };
      };
      case null {
        {
          text = "I could not find this in the selected notebook sources. Try rephrasing the question or adding a source that covers this topic.";
          citations = [];
        };
      };
    };
  };

  func snippetOf(body : Text) : Text {
    let chars = body.toArray();
    let limit = if (chars.size() > 160) { 160 } else { chars.size() };
    Text.fromIter(chars.sliceToArray(0, limit).values()) # "...";
  };

  func summaryFor(request : KnowledgeTypes.NotesRequest) : Text {
    let topic = request.chapter ?? "the selected material";
    "## Summary: " # topic # "\n\n" # bodyFor(topic);
  };

  func notesFor(request : KnowledgeTypes.NotesRequest) : Text {
    let topic = request.chapter ?? "the selected material";
    let depth = switch (request.difficulty) {
      case (#beginner) { "Beginner" };
      case (#intermediate) { "Intermediate" };
      case (#advanced) { "Advanced" };
      case (#exam) { "Exam Level" };
    };
    "## " # topic # " — " # depth # " Notes\n\n" # bodyFor(topic) # "\n\n### Key Points\n\n- Definition and scope of " # topic # "\n- Main instruments and mechanisms\n- Relevance for policy and exams\n";
  };

  func bodyFor(topic : Text) : Text {
    let t = topic.toLower();
    for (entry in corpus.values()) {
      if (entry.0.toLower().contains(#text t) or t.contains(#text (entry.0.toLower()))) {
        return entry.1;
      };
    };
    "This topic is covered by the sources attached to this notebook. Add a source that discusses " # topic # " to generate grounded material.";
  };

  func quizFor(request : KnowledgeTypes.QuizGenRequest) : [KnowledgeTypes.EngineQuestion] {
    let all = questionBank();
    let filtered = all.filter(func(q) = request.kinds.size() == 0 or request.kinds.any(func(k) = k == q.kind));
    let pool = if (filtered.size() == 0) { all } else { filtered };
    let count = if (request.count == 0) { 5 } else { request.count };
    let take = if (count > pool.size()) { pool.size() } else { count };
    pool.sliceToArray(0, take);
  };

  func flashcardsFor(request : KnowledgeTypes.FlashcardsRequest) : [KnowledgeTypes.EngineFlashcard] {
    let all = flashcardBank();
    let count = if (request.count == 0) { 5 } else { request.count };
    let take = if (count > all.size()) { all.size() } else { count };
    all.sliceToArray(0, take);
  };

  func searchCorpus(term : Text) : [KnowledgeTypes.EngineSearchHit] {
    let t = term.toLower();
    if (t.size() == 0) { return [] };
    corpus.filter(func(entry) = entry.0.toLower().contains(#text t) or entry.1.toLower().contains(#text t))
      .map(func(entry) = { sourceId = 0; title = entry.0; snippet = snippetOf(entry.1) });
  };

  func questionBank() : [KnowledgeTypes.EngineQuestion] {
    [
      {
        kind = #mcq;
        prompt = "What inflation target does the RBI Monetary Policy Committee aim for?";
        options = ["2 percent", "4 percent with a 2 percent band", "6 percent", "8 percent"];
        correctIndex = 1;
        explanation = "The RBI targets consumer price inflation of 4 percent with a tolerance band of plus or minus 2 percent.";
        topic = "Monetary Policy";
      },
      {
        kind = #mcq;
        prompt = "Which instrument is used by the RBI to absorb liquidity from the banking system?";
        options = ["Repo rate", "Reverse repo rate", "Fiscal deficit", "Priority sector lending"];
        correctIndex = 1;
        explanation = "The reverse repo rate is the rate at which the RBI absorbs liquidity from banks.";
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
        kind = #shortAnswer;
        prompt = "Define core inflation.";
        options = [];
        correctIndex = 0;
        explanation = "Core inflation excludes volatile food and fuel prices from the headline index.";
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
        kind = #trueFalse;
        prompt = "Gross National Product adds net factor income from abroad to GDP.";
        options = ["True", "False"];
        correctIndex = 0;
        explanation = "GNP equals GDP plus net factor income from abroad.";
        topic = "National Income";
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
  };

  func flashcardBank() : [KnowledgeTypes.EngineFlashcard] {
    [
      { front = "What is monetary policy?"; back = "Central bank management of money supply and interest rates to achieve price stability and growth." },
      { front = "What is the repo rate?"; back = "The rate at which the RBI lends short-term funds to commercial banks." },
      { front = "What is fiscal policy?"; back = "Government use of taxation and spending to influence the economy." },
      { front = "What is demand-pull inflation?"; back = "Inflation caused by aggregate demand exceeding available supply." },
      { front = "What is the cash reserve ratio?"; back = "The share of deposits banks must hold as cash reserves with the RBI." },
      { front = "What is GDP?"; back = "The market value of all final goods and services produced within a country's domestic territory in a year." },
      { front = "What is core inflation?"; back = "Inflation excluding volatile food and fuel prices." },
      { front = "What is the statutory liquidity ratio?"; back = "The minimum share of deposits banks must hold in liquid assets such as government securities." },
    ];
  };
};
