import type { QuizAnswer } from "@/backend";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import {
  QuizGeneratorForm,
  type QuizGeneratorValues,
} from "@/components/study/QuizGeneratorForm";
import { QuizResults } from "@/components/study/QuizResults";
import { QuizRunner } from "@/components/study/QuizRunner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequireAuth } from "@/hooks/useAuth";
import { errorMessage } from "@/lib/api";
import {
  useGenerateQuiz,
  useNotebooks,
  useQuiz,
  useQuizzes,
  useSubmitQuiz,
} from "@/lib/queries";
import { Route as rootRoute } from "@/routes/__root";
import { formatRelative, humanize } from "@/types/view";
import { Link, createRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quizzes",
  component: QuizzesPage,
});

function QuizzesPage() {
  const authenticated = useRequireAuth();
  const { data: notebooks = [] } = useNotebooks();
  const [selectedNotebook, setSelectedNotebook] = useState<string | undefined>(
    undefined,
  );
  const activeNotebookId =
    selectedNotebook ?? notebooks[0]?.notebook.id.toString();

  const {
    data: quizzes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuizzes(activeNotebookId);
  const generate = useGenerateQuiz();

  const [activeQuizId, setActiveQuizId] = useState<string | undefined>(
    undefined,
  );

  const handleGenerate = (values: QuizGeneratorValues) => {
    if (!activeNotebookId) return;
    generate.mutate(
      {
        notebookId: BigInt(activeNotebookId),
        difficulty: values.difficulty,
        count: BigInt(values.count),
        kinds: values.kinds,
      },
      {
        onSuccess: (quiz) => {
          setActiveQuizId(quiz.id.toString());
          toast.success("Quiz generated");
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  if (!authenticated) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (activeQuizId) {
    return (
      <QuizSession
        quizId={activeQuizId}
        onExit={() => setActiveQuizId(undefined)}
      />
    );
  }

  return (
    <div className="space-y-8" data-ocid="quizzes.page">
      <PageHeader
        eyebrow="Quizzes"
        title="Practice quizzes"
        description="Test your recall with graded quizzes that surface weak topics and recommend what to revise."
      />

      {notebooks.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <Label
            htmlFor="quizzes-notebook"
            className="text-sm text-muted-foreground"
          >
            Notebook
          </Label>
          <Select
            value={activeNotebookId}
            onValueChange={(value) => setSelectedNotebook(value)}
          >
            <SelectTrigger
              id="quizzes-notebook"
              className="w-full sm:w-72"
              data-ocid="quizzes.notebook_select"
            >
              <SelectValue placeholder="Select a notebook" />
            </SelectTrigger>
            <SelectContent>
              {notebooks.map((item) => (
                <SelectItem
                  key={item.notebook.id.toString()}
                  value={item.notebook.id.toString()}
                >
                  {item.notebook.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {isError ? (
        <ErrorState
          message={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : null}

      {notebooks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Create a notebook first"
          description="Quizzes are generated from a notebook's sources. Create one to get started."
          action={
            <Button asChild className="rounded-full">
              <Link to="/notebooks" data-ocid="quizzes.create_notebook_button">
                Create a notebook
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <QuizGeneratorForm
            isPending={generate.isPending}
            onSubmit={handleGenerate}
          />

          {isLoading ? (
            <LoadingSkeleton variant="list" count={4} />
          ) : quizzes.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title="No quizzes yet"
              description="Generate a practice quiz to test your recall and find the topics that need more work."
            />
          ) : (
            <ul className="space-y-3" data-ocid="quizzes.list">
              {quizzes.map((quiz, index) => (
                <li
                  key={quiz.id.toString()}
                  data-ocid={`quizzes.item.${index + 1}`}
                >
                  <Card className="shadow-subtle">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {quiz.title}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-[11px]">
                            {humanize(quiz.difficulty)}
                          </Badge>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {formatRelative(quiz.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setActiveQuizId(quiz.id.toString())}
                        data-ocid={`quizzes.start_button.${index + 1}`}
                        className="shrink-0 rounded-full"
                      >
                        Start quiz
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

interface QuizSessionProps {
  quizId: string;
  onExit: () => void;
}

/** Loads a quiz, runs it, then renders the graded result. */
function QuizSession({ quizId, onExit }: QuizSessionProps) {
  const { data, isLoading, isError, error, refetch } = useQuiz(quizId);
  const submit = useSubmitQuiz();

  if (isLoading) return <LoadingSkeleton variant="detail" />;

  if (isError) {
    return (
      <ErrorState
        message={errorMessage(error)}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Quiz not found"
        description="This quiz may have been deleted, or it belongs to another account."
        action={
          <Button
            type="button"
            onClick={onExit}
            className="rounded-full"
            data-ocid="quizzes.exit_button"
          >
            Back to quizzes
          </Button>
        }
      />
    );
  }

  const [quiz, questions] = data;

  if (submit.data) {
    return (
      <QuizResults
        result={submit.data}
        onRetake={() => submit.reset()}
        onExit={onExit}
      />
    );
  }

  const handleSubmit = (answers: QuizAnswer[]) => {
    submit.mutate(
      { quizId, answers },
      {
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  return (
    <QuizRunner
      quiz={quiz}
      questions={questions}
      isSubmitting={submit.isPending}
      onSubmit={handleSubmit}
      onExit={onExit}
    />
  );
}
