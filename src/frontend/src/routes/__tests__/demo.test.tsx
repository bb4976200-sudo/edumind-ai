import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DEMO_NOTEBOOK } from "@/lib/demoContent";
import { Route } from "@/routes/demo";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      to?: string;
    }) => <a href={props.to}>{children}</a>,
    createRoute: (options: unknown) => options,
  };
});

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isInitializing: false,
    isLoggingIn: false,
    principal: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

const DemoPage = (Route as unknown as { component: () => React.ReactElement })
  .component;

describe("demo notebook", () => {
  it("renders the Indian Economy notebook with five chapters", () => {
    render(<DemoPage />);
    expect(
      screen.getByRole("heading", { name: "Indian Economy" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Monetary Policy")).toBeInTheDocument();
    expect(screen.getByText("Fiscal Policy")).toBeInTheDocument();
    expect(screen.getByText("Inflation")).toBeInTheDocument();
    expect(screen.getByText("Banking")).toBeInTheDocument();
    expect(screen.getByText("National Income")).toBeInTheDocument();
    expect(screen.getByText(/Read-only preview/i)).toBeInTheDocument();
  });

  it("shows sources, notes, flashcards and quiz content across tabs", async () => {
    const user = userEvent.setup();
    render(<DemoPage />);

    expect(
      screen.getByText(DEMO_NOTEBOOK.sources[0].title),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Notes/i }));
    expect(screen.getByText(DEMO_NOTEBOOK.notes[0].title)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Flashcards/i }));
    expect(
      screen.getByText(DEMO_NOTEBOOK.flashcards[0].front),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Quiz/i }));
    expect(screen.getByText(DEMO_NOTEBOOK.quizTitle)).toBeInTheDocument();
    expect(
      screen.getByText(DEMO_NOTEBOOK.questions[0].prompt),
    ).toBeInTheDocument();
  });
});
