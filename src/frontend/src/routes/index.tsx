import { FeatureSections } from "@/components/landing/FeatureSections";
import { Hero } from "@/components/landing/Hero";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { Route as rootRoute } from "@/routes/__root";
import { createRoute } from "@tanstack/react-router";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

function LandingPage() {
  return (
    <div data-ocid="landing.page" className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <FeatureSections />
      </main>
      <LandingFooter />
    </div>
  );
}
