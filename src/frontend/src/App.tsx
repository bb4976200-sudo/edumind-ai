import { Toaster } from "@/components/ui/sonner";
import { Route as rootRoute } from "@/routes/__root";
import { Route as dashboardRoute } from "@/routes/dashboard";
import { Route as demoRoute } from "@/routes/demo";
import { Route as flashcardsRoute } from "@/routes/flashcards";
import { Route as indexRoute } from "@/routes/index";
import { Route as libraryRoute } from "@/routes/library";
import { Route as notebooksRoute } from "@/routes/notebooks";
import { Route as notebookWorkspaceRoute } from "@/routes/notebooks.$notebookId";
import { Route as notesRoute } from "@/routes/notes";
import { Route as quizzesRoute } from "@/routes/quizzes";
import { Route as searchRoute } from "@/routes/search";
import { Route as sourcesRoute } from "@/routes/sources";
import { Route as studyRoute } from "@/routes/study";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  demoRoute,
  notebooksRoute,
  notebookWorkspaceRoute,
  sourcesRoute,
  studyRoute,
  notesRoute,
  flashcardsRoute,
  quizzesRoute,
  libraryRoute,
  searchRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>
  );
}
