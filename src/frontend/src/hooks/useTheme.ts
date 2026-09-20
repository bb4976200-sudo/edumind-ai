import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export type ThemeChoice = "light" | "dark" | "system";

export interface ThemeState {
  theme: ThemeChoice;
  resolvedTheme: "light" | "dark";
  mounted: boolean;
  setTheme: (theme: ThemeChoice) => void;
  toggleTheme: () => void;
}

/** Theme state with a hydration-safe mounted flag and a one-click toggle. */
export function useTheme(): ThemeState {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active: ThemeChoice =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";
  const resolved: "light" | "dark" =
    resolvedTheme === "dark" ? "dark" : "light";

  return {
    theme: active,
    resolvedTheme: resolved,
    mounted,
    setTheme: (next) => setTheme(next),
    toggleTheme: () => setTheme(resolved === "dark" ? "light" : "dark"),
  };
}
