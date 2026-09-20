import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap, Menu, Search } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TopNavProps {
  items: NavItem[];
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
}

/** Sticky application header with brand, primary nav, search and account. */
export function TopNav({ items, onOpenSidebar, onOpenSearch }: TopNavProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          data-ocid="nav.sidebar_button"
          className="lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>

        <Link
          to="/"
          data-ocid="nav.logo_link"
          className="flex shrink-0 items-center gap-2.5 rounded-md focus-ring"
        >
          <span className="flex size-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-subtle">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="hidden font-display text-lg font-semibold tracking-tight text-foreground sm:block">
            EduMind <span className="text-primary">AI</span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-4 hidden min-w-0 flex-1 items-center gap-1 lg:flex"
        >
          {items.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={`nav.link.${item.to.replace(/^\//, "").replace(/\//g, ".") || "home"}`}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-smooth focus-ring",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenSearch}
            data-ocid="search.open_button"
            className="hidden rounded-full text-muted-foreground sm:inline-flex"
          >
            <Search className="size-4" aria-hidden="true" />
            <span>Search</span>
            <kbd className="ml-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onOpenSearch}
            aria-label="Search"
            data-ocid="search.open_icon_button"
            className="sm:hidden"
          >
            <Search className="size-5" aria-hidden="true" />
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
