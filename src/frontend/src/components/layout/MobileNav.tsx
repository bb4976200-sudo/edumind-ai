import type { NavItem } from "@/components/layout/TopNav";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";

interface MobileNavProps {
  items: NavItem[];
}

/** Fixed bottom navigation for small screens. */
export function MobileNav({ items }: MobileNavProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav
      aria-label="Mobile"
      data-ocid="nav.mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="flex items-stretch justify-around">
        {items.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                data-ocid={`nav.mobile.${item.to.replace(/^\//, "").replace(/\//g, ".") || "home"}`}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium transition-smooth focus-ring",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
