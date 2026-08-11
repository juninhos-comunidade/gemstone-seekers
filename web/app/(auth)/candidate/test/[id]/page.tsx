"use client";
import { useParams } from "next/navigation";
import { quizMock } from "@/lib/mocks/quizMock";
import { useState } from "react";
import { QuizNotFound } from "@/components/quiz/QuizNotFound";
import { QuizResult } from "@/components/quiz/QuizResult";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";

export default function TestPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const { id } = useParams<{ id: string }>();

  const test = quizMock.find((t) => t.id === id);
  const currentQuestion = test?.questions[currentIndex];
  const totalQuestions = test?.questions.length ?? 0;
  const progressPercent =
    totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  if (!test) {
    return <QuizNotFound />;
  }

  if (finished) {
    const score = test.questions.reduce((acc, question) => {
      const chosenId = answers[question.id];
      const chosenOption = question.options.find((o) => o.id === chosenId);
      return acc + (chosenOption?.isCorrect ? 1 : 0);
    }, 0);

    return <QuizResult score={score} totalQuestions={totalQuestions} />;
  }

  if (!currentQuestion) {
    return (
      <div className="mx-auto w-full max-w-2xl p-6">
        <div className="bg-card rounded-xl border p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold">Questão não encontrada</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Não foi possível carregar a questão.
          </p>
        </div>
      </div>
    );
  }

  function handleSetAnswer(optionId: string) {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  }

  function handlePrevious() {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }

  function handleNext() {
    if (!selectedOptionId) return;

    if (isLastQuestion) {
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  }

  const selectedOptionId = answers[currentQuestion.id] ?? "";
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div>
      <QuizQuestion
        progressPercent={progressPercent}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestion}
        selectedOptionId={selectedOptionId}
        handleSetAnswer={handleSetAnswer}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        isLastQuestion={isLastQuestion}
      />
    </div>
  );
}
