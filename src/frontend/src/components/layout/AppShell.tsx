import { MobileNav } from "@/components/layout/MobileNav";
import { type NavItem, TopNav } from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSearch } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  BrainCircuit,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Library,
  ListChecks,
  NotebookPen,
  Search,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Notebooks", to: "/notebooks", icon: NotebookPen },
  { label: "Sources", to: "/sources", icon: FileText },
  { label: "AI Study", to: "/study", icon: BrainCircuit },
  { label: "Notes", to: "/notes", icon: BookOpen },
  { label: "Flashcards", to: "/flashcards", icon: Layers },
  { label: "Quizzes", to: "/quizzes", icon: ListChecks },
  { label: "Library", to: "/library", icon: Library },
];

const MOBILE_ITEMS: NavItem[] = [
  { label: "Home", to: "/dashboard", icon: LayoutDashboard },
  { label: "Notebooks", to: "/notebooks", icon: NotebookPen },
  { label: "Study", to: "/study", icon: BrainCircuit },
  { label: "Quizzes", to: "/quizzes", icon: ListChecks },
  { label: "Library", to: "/library", icon: Library },
];

interface AppShellProps {
  children: ReactNode;
}

/** Shared application shell: sidebar spine, sticky header, mobile nav, footer. */
export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const navigate = useNavigate();
  const { data: results = [], isFetching } = useSearch(term);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the mobile sidebar whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleSelect = (notebookId: string) => {
    setSearchOpen(false);
    setTerm("");
    void navigate({
      to: "/notebooks/$notebookId",
      params: { notebookId },
    });
  };

  // The marketing landing page owns its own nav and footer, so it renders
  // without the application sidebar, header and footer.
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav
        items={NAV_ITEMS}
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="flex flex-1">
        <aside
          data-ocid="nav.sidebar"
          className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block"
        >
          <SidebarContent pathname={pathname} />
        </aside>

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
          <footer className="border-t border-border bg-card/60 px-4 py-6 sm:px-6">
            <p className="text-center text-xs text-muted-foreground">
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
          </footer>
        </main>
      </div>

      <MobileNav items={MOBILE_ITEMS} />

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Search notebooks, sources, notes…"
          value={term}
          onValueChange={setTerm}
          data-ocid="search.input"
        />
        <CommandList data-ocid="search.results">
          {term.trim().length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Type to search across your notebooks, sources, notes, flashcards
              and quizzes.
            </div>
          ) : isFetching ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Searching…
            </div>
          ) : results.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading="Results">
              {results.map((hit) => (
                <CommandItem
                  key={`${hit.kind}-${hit.id}`}
                  value={`${hit.title} ${hit.kind}`}
                  onSelect={() => handleSelect(hit.notebookId.toString())}
                  data-ocid="search.result_item"
                  className="flex flex-col items-start gap-1"
                >
                  <span className="flex w-full items-center gap-2">
                    <span className="truncate font-medium">{hit.title}</span>
                    <span className="ml-auto shrink-0 rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                      {hit.kind}
                    </span>
                  </span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {hit.snippet}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="flex size-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
          <GraduationCap className="size-5" aria-hidden="true" />
        </span>
        <span className="font-display text-base font-semibold tracking-tight text-sidebar-foreground">
          EduMind <span className="text-primary">AI</span>
        </span>
      </div>

      <nav aria-label="Sections" className="flex-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-3 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Study workspace
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  data-ocid={`nav.sidebar.${item.to.replace(/^\//, "").replace(/\//g, ".")}`}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-smooth focus-ring",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full justify-start rounded-lg"
        >
          <Link to="/search" data-ocid="nav.sidebar.search_link">
            <Search className="size-4" aria-hidden="true" />
            Global search
          </Link>
        </Button>
      </div>
    </div>
  );
}
