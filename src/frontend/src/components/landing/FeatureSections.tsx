import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Layers,
  LineChart,
  ListChecks,
  NotebookPen,
  Sparkles,
  Upload,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentType, ReactNode } from "react";

interface SectionShellProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  tone?: "default" | "muted";
}

function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = "default",
}: SectionShellProps) {
  const reduceMotion = useReducedMotion();
  return (
    <section
      id={id}
      data-ocid={`landing.section.${id}`}
      className={
        tone === "muted"
          ? "scroll-mt-20 border-y border-border bg-card/40"
          : "scroll-mt-20"
      }
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </motion.div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const STEPS: {
  step: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}[] = [
  {
    step: "01",
    icon: NotebookPen,
    title: "Create a notebook",
    description:
      "Set up a workspace for a course, subject or exam and keep every chapter in one place.",
  },
  {
    step: "02",
    icon: Upload,
    title: "Connect your sources",
    description:
      "Add lecture notes, textbook chapters, articles or transcripts. EduMind indexes them into a searchable knowledge base.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Study with AI",
    description:
      "Ask questions, generate notes, drill flashcards and take quizzes — every answer grounded in your own material.",
  },
];

const SOURCE_KINDS = [
  { icon: FileText, label: "Lecture PDFs", detail: "Slides and handouts" },
  { icon: NotebookPen, label: "Class notes", detail: "Typed or pasted" },
  { icon: FileText, label: "Articles", detail: "Reading lists" },
  { icon: Layers, label: "Transcripts", detail: "Recorded lectures" },
];

const ASK_EXCHANGE = [
  {
    question: "Why did the 1991 reforms change India's trade policy?",
    answer:
      "The balance-of-payments crisis left foreign reserves covering only a few weeks of imports, so the government liberalised licensing and reduced tariffs to restore external confidence.",
    citation: "Chapter 4 · Economic Reforms Since 1991",
  },
  {
    question: "How is the poverty line measured in the source?",
    answer:
      "The chapter defines it through a consumption-expenditure threshold, then distinguishes absolute poverty from relative deprivation.",
    citation: "Chapter 6 · Poverty as a Challenge",
  },
];

const MATERIALS = [
  {
    icon: NotebookPen,
    title: "Structured notes",
    description:
      "Turn dense chapters into clean summaries and detailed notes you can edit and revisit.",
  },
  {
    icon: Layers,
    title: "Flashcards",
    description:
      "Generate review cards from your sources and track what you know versus what still needs work.",
  },
  {
    icon: ListChecks,
    title: "Practice quizzes",
    description:
      "Test yourself with graded quizzes that surface weak topics and recommend what to revise next.",
  },
];

const QUIZ_OPTIONS = [
  { label: "Primary sector", correct: false },
  { label: "Secondary sector", correct: false },
  { label: "Tertiary sector", correct: true },
  { label: "Quaternary sector", correct: false },
];

const PROGRESS_STATS = [
  { label: "Sources indexed", value: "12" },
  { label: "Cards mastered", value: "148" },
  { label: "Quiz accuracy", value: "82%" },
];

const PROGRESS_TOPICS = [
  { topic: "Economic Reforms", mastery: 88 },
  { topic: "Poverty & Employment", mastery: 64 },
  { topic: "Human Capital", mastery: 41 },
];

/** The six explanatory landing sections. */
export function FeatureSections() {
  const { isAuthenticated, login } = useAuth();

  return (
    <>
      <SectionShell
        id="how-it-works"
        eyebrow="How it works"
        title="From raw material to confident recall"
        description="EduMind AI follows the way you actually revise: gather the material, interrogate it, then prove you know it."
      >
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.step} delay={index * 0.08}>
                <li className="h-full rounded-2xl border border-border bg-card p-6 shadow-subtle transition-smooth hover:shadow-elevated">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-2xl font-semibold text-primary/25">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </SectionShell>

      <SectionShell
        id="sources"
        eyebrow="Upload your sources"
        title="One knowledge base for every chapter"
        description="Bring the material you already study from. EduMind keeps each source attached to its notebook so answers never drift away from the syllabus."
        tone="muted"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {SOURCE_KINDS.map((kind) => {
                const Icon = kind.icon;
                return (
                  <div
                    key={kind.label}
                    className="rounded-xl border border-border bg-card p-5 shadow-subtle"
                  >
                    <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-accent">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <p className="mt-4 font-display text-sm font-semibold text-foreground">
                      {kind.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {kind.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="flex size-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <FileText className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-foreground">
                    Indian Economy — Class XII
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    12 sources · indexed
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-3">
                {[
                  "Ch. 1 · Indian Economy on the Eve of Independence",
                  "Ch. 4 · Economic Reforms Since 1991",
                  "Ch. 6 · Poverty as a Challenge",
                  "Ch. 7 · Employment: Growth and Informalisation",
                ].map((chapter) => (
                  <li
                    key={chapter}
                    className="flex items-center gap-3 rounded-lg bg-secondary/60 px-3 py-2.5"
                  >
                    <CheckCircle2
                      className="size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    <span className="truncate text-sm text-foreground">
                      {chapter}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        id="ask"
        eyebrow="Ask your AI"
        title="Answers that cite the passage behind them"
        description="Ask a question in plain language and get a grounded response with the exact chapter it came from — so you can verify as you learn."
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <Reveal>
            <div className="space-y-4">
              {ASK_EXCHANGE.map((exchange) => (
                <div
                  key={exchange.question}
                  className="rounded-2xl border border-border bg-card p-5 shadow-subtle"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-semibold text-muted-foreground">
                      You
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      {exchange.question}
                    </p>
                  </div>
                  <div className="mt-4 flex items-start gap-3 border-t border-border pt-4">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full gradient-primary text-primary-foreground">
                      <BrainCircuit className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {exchange.answer}
                      </p>
                      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                        <FileText className="size-3" aria-hidden="true" />
                        {exchange.citation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border gradient-subtle p-6">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Built to keep you honest
              </h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Every response is anchored to a source you added.",
                  "Citations point to the chapter, not a vague summary.",
                  "Ask follow-ups without losing the thread of the topic.",
                  "Your notebooks stay isolated to your account.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        id="generate"
        eyebrow="Generate study material"
        title="Turn a chapter into something you can revise"
        description="Generate notes, flashcards and quizzes directly from your sources, then edit them until they match how you study."
        tone="muted"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {MATERIALS.map((material, index) => {
            const Icon = material.icon;
            return (
              <Reveal key={material.title} delay={index * 0.08}>
                <Card className="h-full shadow-subtle transition-smooth hover:shadow-elevated">
                  <CardContent className="p-6">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                      {material.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {material.description}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell
        id="practice"
        eyebrow="Practice with quizzes"
        title="Test yourself before the exam does"
        description="Quizzes are generated from your own material and graded instantly, so weak topics surface while there is still time to fix them."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Question 3 of 10
                </p>
                <span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                  Medium
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                Which sector contributes the largest share of India&apos;s GDP?
              </h3>
              <ul className="mt-5 space-y-2.5">
                {QUIZ_OPTIONS.map((option) => (
                  <li
                    key={option.label}
                    className={
                      option.correct
                        ? "flex items-center justify-between rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm font-medium text-foreground"
                        : "flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground"
                    }
                  >
                    {option.label}
                    {option.correct ? (
                      <CheckCircle2
                        className="size-4 text-success"
                        aria-hidden="true"
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                Correct. The tertiary sector accounts for over half of
                India&apos;s gross domestic product — see Chapter 2.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                Practice that adapts to what you missed
              </h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Quizzes are drawn from the chapters in your notebook.",
                  "Instant grading with an explanation for every answer.",
                  "Weak topics are flagged so your next session targets them.",
                  "Retake any quiz as many times as you need.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        id="progress"
        eyebrow="Track your progress"
        title="See what you have actually learned"
        description="Every source, card and quiz feeds a running picture of your preparation, so revision time goes where it is needed."
        tone="muted"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {PROGRESS_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card p-5 text-center shadow-subtle"
                >
                  <p className="font-display text-3xl font-semibold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-accent">
                  <LineChart className="size-4" aria-hidden="true" />
                </span>
                <p className="font-display text-sm font-semibold text-foreground">
                  Topic mastery
                </p>
              </div>
              <ul className="mt-6 space-y-5">
                {PROGRESS_TOPICS.map((topic) => (
                  <li key={topic.topic}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{topic.topic}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {topic.mastery}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full gradient-primary"
                        style={{ width: `${topic.mastery}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <section
        data-ocid="landing.cta_section"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl gradient-primary px-6 py-14 text-center sm:px-12">
            <div
              className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary-foreground/10 blur-3xl"
              aria-hidden="true"
            />
            <h2 className="relative font-display text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to study smarter?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
              Create your first notebook and let EduMind AI turn your sources
              into notes, flashcards and quizzes.
            </p>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {isAuthenticated ? (
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-full"
                >
                  <Link to="/dashboard" data-ocid="landing.cta_button">
                    Go to dashboard
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={login}
                  className="rounded-full"
                  data-ocid="landing.cta_button"
                >
                  Start Studying
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              )}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/library" data-ocid="landing.cta_demo_button">
                  Explore Demo
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
