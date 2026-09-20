import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

describe("ThemeToggle", () => {
  it("switches the document theme class and persists the choice", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole("button", {
      name: /Switch to dark mode/i,
    });
    await user.click(toggle);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });
});
