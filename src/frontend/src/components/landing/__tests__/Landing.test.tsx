import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FeatureSections } from "@/components/landing/FeatureSections";
import { Hero } from "@/components/landing/Hero";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";

const navigate = vi.fn();
const login = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    to?: string;
  }) => <a href={props.to}>{children}</a>,
  useNavigate: () => navigate,
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isInitializing: false,
    isLoggingIn: false,
    principal: null,
    login,
    logout: vi.fn(),
  }),
}));

vi.mock("@/components/layout/ThemeToggle", () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}));

describe("landing page", () => {
  it("renders the hero with both CTAs", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        name: /Your Study Material\. Your AI Classroom\./i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Start Studying/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Explore Demo/i }),
    ).toBeInTheDocument();
  });

  it("renders all six explanatory sections", () => {
    render(<FeatureSections />);
    for (const id of [
      "how-it-works",
      "sources",
      "ask",
      "generate",
      "practice",
      "progress",
    ]) {
      expect(
        document.querySelector(`[data-ocid="landing.section.${id}"]`),
      ).not.toBeNull();
    }
  });

  it("renders the navbar with section anchors and the footer", () => {
    render(<LandingNav />);
    expect(screen.getByRole("link", { name: /EduMind/i })).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /Landing sections/i }),
    ).toBeInTheDocument();

    render(<LandingFooter />);
    expect(
      screen.getByRole("navigation", { name: /Product/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /Explore/i }),
    ).toBeInTheDocument();
  });
});
