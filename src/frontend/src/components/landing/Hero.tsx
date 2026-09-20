import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Layers,
  ListChecks,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const HERO_IMAGE = "/assets/generated/hero-study-workspace.dim_1536x1024.png";

const PROOF_POINTS = [
  { icon: BookOpen, label: "Notes" },
  { icon: Layers, label: "Flashcards" },
  { icon: ListChecks, label: "Quizzes" },
  { icon: ShieldCheck, label: "Private" },
];

/** Landing hero: headline, dual CTAs and the product visual. */
export function Hero() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handleStart = () => {
    if (isAuthenticated) {
      void navigate({ to: "/dashboard" });
      return;
    }
    login();
  };

  // The demo is a public, read-only surface, so it is explorable without an
  // account and never calls the guarded seedDemoData mutation.
  const handleExploreDemo = () => {
    void navigate({ to: "/demo" });
  };

  const rise = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      data-ocid="landing.hero"
      className="relative overflow-hidden border-b border-border gradient-subtle"
    >
      <div
        className="pointer-events-none absolute -right-32 -top-40 size-[28rem] rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-24 size-[26rem] rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-28">
        <div className="min-w-0">
          <motion.span
            {...rise}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-primary"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            Grounded academic AI
          </motion.span>

          <motion.h1
            {...rise}
            transition={{
              duration: 0.55,
              delay: 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Your Study Material.{" "}
            <span className="text-gradient-primary">Your AI Classroom.</span>
          </motion.h1>

          <motion.p
            {...rise}
            transition={{
              duration: 0.55,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Connect your lecture notes, textbooks and articles, then turn that
            material into notes, quizzes, flashcards and revision material — all
            grounded in the sources you choose.
          </motion.p>

          <motion.div
            {...rise}
            transition={{
              duration: 0.55,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              type="button"
              size="lg"
              onClick={handleStart}
              className="rounded-full"
              data-ocid="landing.primary_button"
            >
              Start Studying
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleExploreDemo}
              className="rounded-full"
              data-ocid="landing.secondary_button"
            >
              Explore Demo
            </Button>
          </motion.div>

          <motion.p
            {...rise}
            transition={{
              duration: 0.55,
              delay: 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 font-mono text-xs text-muted-foreground"
          >
            No credit card · Internet Identity sign-in · Indian Economy demo
            notebook included
          </motion.p>

          <motion.ul
            {...rise}
            transition={{
              duration: 0.55,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {PROOF_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <li
                  key={point.label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Icon className="size-4 text-accent" aria-hidden="true" />
                  {point.label}
                </li>
              );
            })}
          </motion.ul>
        </div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-w-0"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-floating">
            <img
              src={HERO_IMAGE}
              alt="Layered study cards and source documents connected into a knowledge workspace"
              width={1536}
              height={1024}
              loading="eager"
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 hidden items-center gap-3 rounded-xl border border-border bg-card/90 px-4 py-3 shadow-elevated backdrop-blur-md sm:flex">
            <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
              <BookOpen className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">
                Indian Economy
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                Demo notebook · ready to explore
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
