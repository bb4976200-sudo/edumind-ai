import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Notebooks", to: "/notebooks" },
  { label: "Sources", to: "/sources" },
  { label: "AI Study", to: "/study" },
  { label: "Flashcards", to: "/flashcards" },
  { label: "Quizzes", to: "/quizzes" },
  { label: "Library", to: "/library" },
] as const;

const SECTION_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Upload your sources", href: "#sources" },
  { label: "Ask your AI", href: "#ask" },
  { label: "Generate study material", href: "#generate" },
  { label: "Practice with quizzes", href: "#practice" },
  { label: "Track your progress", href: "#progress" },
] as const;

/** Marketing footer with product and section links plus attribution. */
export function LandingFooter() {
  return (
    <footer
      data-ocid="landing.footer"
      className="border-t border-border bg-card/60"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-foreground">
                EduMind <span className="text-primary">AI</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A grounded study workspace that turns your own course material
              into notes, flashcards and quizzes — with every answer traced back
              to the source.
            </p>
          </div>

          <nav aria-label="Product">
            <h2 className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Product
            </h2>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    data-ocid={`landing.footer_link.${item.to.replace(/^\//, "")}`}
                    className="text-sm text-muted-foreground transition-smooth hover:text-foreground focus-ring rounded-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore">
            <h2 className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SECTION_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    data-ocid={`landing.footer_section_link.${item.href.replace("#", "")}`}
                    className="text-sm text-muted-foreground transition-smooth hover:text-foreground focus-ring rounded-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Internet Identity · Your data stays yours
          </p>
        </div>
      </div>
    </footer>
  );
}
