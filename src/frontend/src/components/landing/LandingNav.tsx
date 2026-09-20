import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface LandingSection {
  id: string;
  label: string;
}

export const LANDING_SECTIONS: LandingSection[] = [
  { id: "how-it-works", label: "How it works" },
  { id: "sources", label: "Sources" },
  { id: "ask", label: "Ask your AI" },
  { id: "generate", label: "Study material" },
  { id: "practice", label: "Quizzes" },
  { id: "progress", label: "Progress" },
];

/** Sticky marketing header: brand, section anchors, theme toggle, sign-in. */
export function LandingNav() {
  const { isAuthenticated, login } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-ocid="landing.nav"
      className={cn(
        "sticky top-0 z-50 border-b transition-smooth",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          data-ocid="landing.logo_link"
          className="flex shrink-0 items-center gap-2.5 rounded-md focus-ring"
        >
          <span className="flex size-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-subtle">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            EduMind <span className="text-primary">AI</span>
          </span>
        </Link>

        <nav
          aria-label="Landing sections"
          className="ml-6 hidden min-w-0 flex-1 items-center gap-0.5 lg:flex"
        >
          {LANDING_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-ocid={`landing.nav_link.${section.id}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-secondary/60 hover:text-foreground focus-ring"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button
              asChild
              size="sm"
              className="hidden rounded-full sm:inline-flex"
            >
              <Link to="/dashboard" data-ocid="landing.nav_dashboard_button">
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={login}
              className="hidden rounded-full sm:inline-flex"
              data-ocid="landing.nav_signin_button"
            >
              Sign in
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-ocid="landing.nav_menu_button"
            className="lg:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {open ? (
        <div
          data-ocid="landing.nav_mobile_panel"
          className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <nav
            aria-label="Landing sections"
            className="mx-auto grid w-full max-w-7xl gap-1 px-4 py-4 sm:px-6"
          >
            {LANDING_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setOpen(false)}
                data-ocid={`landing.nav_mobile_link.${section.id}`}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground focus-ring"
              >
                {section.label}
              </a>
            ))}
            <div className="mt-2 border-t border-border pt-3">
              {isAuthenticated ? (
                <Button asChild className="w-full rounded-full">
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    data-ocid="landing.nav_mobile_dashboard_button"
                  >
                    Go to dashboard
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    login();
                  }}
                  className="w-full rounded-full"
                  data-ocid="landing.nav_mobile_signin_button"
                >
                  Sign in
                </Button>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
