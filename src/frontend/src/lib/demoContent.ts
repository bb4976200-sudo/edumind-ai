/**
 * Static, read-only mirror of the backend Indian Economy demo seed
 * (`src/backend/lib/demo.mo`). The backend `seedDemoData` method is a guarded
 * shared mutation that requires a signed caller, so an unauthenticated visitor
 * cannot seed or read it. This fixture lets the public `/demo` surface render
 * the same demo notebook without an account, without weakening per-user data
 * isolation for signed-in users' own data.
 */

export interface DemoChapter {
  title: string;
}

export interface DemoSource {
  title: string;
  kind: string;
  content: string;
}

export interface DemoNote {
  title: string;
  kind: string;
  difficulty: string;
  content: string;
}

export interface DemoFlashcard {
  front: string;
  back: string;
}

export interface DemoQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface DemoNotebook {
  title: string;
  description: string;
  chapters: DemoChapter[];
  sources: DemoSource[];
  notes: DemoNote[];
  flashcards: DemoFlashcard[];
  quizTitle: string;
  questions: DemoQuestion[];
}

export const DEMO_NOTEBOOK: DemoNotebook = {
  title: "Indian Economy",
  description:
    "Demo notebook covering monetary policy, fiscal policy, inflation, banking and national income.",
  chapters: [
    { title: "Monetary Policy" },
    { title: "Fiscal Policy" },
    { title: "Inflation" },
    { title: "Banking" },
    { title: "National Income" },
  ],
  sources: [
    {
      title: "Monetary Policy — RBI Framework",
      kind: "note",
      content:
        "Monetary policy is conducted by the Reserve Bank of India through the Monetary Policy Committee. The committee targets consumer price inflation of 4 percent with a tolerance band of plus or minus 2 percent. Its instruments include the repo rate, the reverse repo rate, the cash reserve ratio and open market operations. A repo rate cut lowers borrowing costs and stimulates demand, while a hike cools inflation.",
    },
    {
      title: "Fiscal Policy and the Union Budget",
      kind: "note",
      content:
        "Fiscal policy is the use of government taxation and spending to influence the economy. Expansionary fiscal policy raises spending or cuts taxes to boost demand, while contractionary fiscal policy reduces spending or raises taxes to control inflation. The Union Budget sets the fiscal deficit target and the Fiscal Responsibility and Budget Management Act guides consolidation.",
    },
    {
      title: "Inflation — Concepts and Measurement",
      kind: "note",
      content:
        "Inflation is a sustained rise in the general price level that reduces purchasing power. It is measured by the Consumer Price Index and the Wholesale Price Index. Demand-pull inflation arises when aggregate demand exceeds supply, while cost-push inflation arises from rising input costs. Core inflation excludes volatile food and fuel prices.",
    },
    {
      title: "Banking in India",
      kind: "note",
      content:
        "The Indian banking system includes scheduled commercial banks, cooperative banks and regional rural banks, regulated by the Reserve Bank of India. Key concepts include the cash reserve ratio, the statutory liquidity ratio, non-performing assets and priority sector lending. Financial inclusion is advanced through Jan Dhan accounts, mobile banking and the Unified Payments Interface.",
    },
    {
      title: "National Income Accounting",
      kind: "note",
      content:
        "National income measures the total value of goods and services produced in a year. Gross Domestic Product is the market value of all final goods and services produced within the domestic territory. Gross National Product adds net factor income from abroad. Net National Product at factor cost is called national income.",
    },
  ],
  notes: [
    {
      title: "Monetary Policy — Summary",
      kind: "summary",
      difficulty: "beginner",
      content:
        "## Monetary Policy\n\nThe RBI manages money supply and interest rates to keep inflation near 4 percent and support growth. Its main tools are the repo rate, reverse repo rate, cash reserve ratio and open market operations.",
    },
    {
      title: "Inflation — Detailed Notes",
      kind: "detailedNotes",
      difficulty: "intermediate",
      content:
        "## Inflation\n\nInflation is a sustained rise in the general price level. Demand-pull inflation arises when aggregate demand exceeds supply; cost-push inflation arises from rising input costs. Core inflation excludes volatile food and fuel prices.",
    },
  ],
  flashcards: [
    {
      front: "What is monetary policy?",
      back: "Central bank management of money supply and interest rates to achieve price stability and growth.",
    },
    {
      front: "What is the repo rate?",
      back: "The rate at which the RBI lends short-term funds to commercial banks.",
    },
    {
      front: "What is fiscal policy?",
      back: "Government use of taxation and spending to influence the economy.",
    },
    {
      front: "What is demand-pull inflation?",
      back: "Inflation caused by aggregate demand exceeding available supply.",
    },
    {
      front: "What is GDP?",
      back: "The market value of all final goods and services produced within a country's domestic territory in a year.",
    },
  ],
  quizTitle: "Indian Economy — Practice Quiz",
  questions: [
    {
      prompt:
        "What inflation target does the RBI Monetary Policy Committee aim for?",
      options: [
        "2 percent",
        "4 percent with a 2 percent band",
        "6 percent",
        "8 percent",
      ],
      correctIndex: 1,
      explanation:
        "The RBI targets consumer price inflation of 4 percent with a tolerance band of plus or minus 2 percent.",
      topic: "Monetary Policy",
    },
    {
      prompt:
        "Expansionary fiscal policy involves raising taxes to boost demand.",
      options: ["True", "False"],
      correctIndex: 1,
      explanation:
        "Expansionary fiscal policy raises spending or cuts taxes; raising taxes is contractionary.",
      topic: "Fiscal Policy",
    },
    {
      prompt: "Demand-pull inflation occurs when:",
      options: [
        "Input costs rise",
        "Aggregate demand exceeds supply",
        "The RBI raises the repo rate",
        "Exports fall",
      ],
      correctIndex: 1,
      explanation:
        "Demand-pull inflation arises when aggregate demand exceeds available supply.",
      topic: "Inflation",
    },
    {
      prompt:
        "Which ratio requires banks to hold a minimum share of deposits in liquid assets?",
      options: [
        "Cash reserve ratio",
        "Statutory liquidity ratio",
        "Fiscal deficit",
        "Repo rate",
      ],
      correctIndex: 1,
      explanation:
        "The statutory liquidity ratio requires banks to hold a minimum share of deposits in liquid assets.",
      topic: "Banking",
    },
    {
      prompt: "Net National Product at factor cost is also called:",
      options: [
        "Gross Domestic Product",
        "National income",
        "Per capita income",
        "Disposable income",
      ],
      correctIndex: 1,
      explanation:
        "Net National Product at factor cost is called national income.",
      topic: "National Income",
    },
  ],
};
