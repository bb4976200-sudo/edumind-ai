import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

/** Navbar dark/light toggle. Persists the choice via next-themes. */
export function ThemeToggle() {
  const { resolvedTheme, mounted, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-ocid="theme.toggle"
      className="text-muted-foreground hover:text-foreground"
    >
      {mounted && isDark ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </Button>
  );
}
