"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { QuizNotFound } from "@/components/quiz/QuizNotFound";
import { QuizResult } from "@/components/quiz/QuizResult";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import {
  startAssessment,
  answerQuestion,
  submitAssessment,
  getAssessmentResult,
  cancelAssessment,
} from "@/lib/api/assessments";
import type {
  AssessmentStartResponse,
  AssessmentResultResponse,
  AssessmentDifficulty,
} from "@/lib/types/assessment";

export default function TestPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<AssessmentStartResponse | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<AssessmentResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // The id from URL is actually the technology name, not assessmentId
    // We need to start a new assessment with this technology
    const initializeAssessment = async () => {
      try {
        setLoading(true);
        setError(null);
        const technology = id;
        if (!technology) {
          throw new Error("Technology not provided");
        }

        // Get difficulty from URL query params
        const searchParams = new URLSearchParams(window.location.search);
        const difficultyParam = searchParams.get("difficulty") as
          AssessmentDifficulty | undefined;

        const assessmentData = await startAssessment(
          technology,
          difficultyParam,
        );
        setAssessment(assessmentData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to start assessment",
        );
      } finally {
        setLoading(false);
      }
    };

    initializeAssessment();
  }, [id]);

  const currentQuestion = assessment?.questions[currentIndex];
  const totalQuestions = assessment?.questions.length ?? 0;
  const progressPercent =
    totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const handleSetAnswer = async (optionId: number) => {
    if (!currentQuestion || !assessment) return;

    // Update local state
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));

    // Send answer to API
    try {
      await answerQuestion(assessment.id, currentQuestion.id, optionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer");
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = async () => {
    if (!assessment) return;

    if (isLastQuestion) {
      // Submit the assessment
      try {
        setSubmitting(true);
        await submitAssessment(assessment.id);
        const resultData = await getAssessmentResult(assessment.id);
        setResult(resultData);
        setFinished(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to submit assessment",
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const handleCancel = async () => {
    if (!assessment) return;
    try {
      await cancelAssessment(assessment.id);
      router.push("/candidate/dashboard/tests");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel assessment",
      );
    }
  };

  const selectedOptionId = currentQuestion
    ? (answers[currentQuestion.id] ?? 0)
    : 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
        <div className="bg-card rounded-2xl border p-6 text-center shadow-lg md:p-8">
          <h2 className="text-xl font-semibold">Carregando teste...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
        <div className="bg-card rounded-2xl border p-6 text-center shadow-lg md:p-8">
          <h2 className="text-destructive text-xl font-semibold">Erro</h2>
          <p className="text-muted-foreground mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return <QuizNotFound />;
  }

  if (finished && result) {
    return (
      <QuizResult
        score={result.correctAnswers}
        totalQuestions={result.totalQuestions}
        assessmentId={result.assessmentId}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
        <div className="bg-card rounded-2xl border p-6 text-center shadow-lg md:p-8">
          <h2 className="text-xl font-semibold">Questão não encontrada</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Não foi possível carregar a questão.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="container mx-auto py-8 md:py-12">
        {/* Header da página */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            {assessment.technologyResponse.name}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Avaliação de conhecimento
          </p>
        </div>

        <QuizQuestion
          progressPercent={progressPercent}
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          selectedOptionId={selectedOptionId.toString()}
          handleSetAnswer={(id) => handleSetAnswer(parseInt(id))}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          isLastQuestion={isLastQuestion}
          onCancel={handleCancel}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
