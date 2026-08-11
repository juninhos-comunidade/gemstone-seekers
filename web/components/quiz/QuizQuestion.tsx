"use client";
import React from "react";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type Question } from "@/lib/types/quiz";
export function QuizQuestion({
  progressPercent,
  currentIndex,
  totalQuestions,
  currentQuestion,
  selectedOptionId,
  handleSetAnswer,
  handlePrevious,
  handleNext,
  isLastQuestion,
}: {
  progressPercent: number;
  currentIndex: number;
  totalQuestions: number;
  currentQuestion: Question;
  selectedOptionId: string;
  handleSetAnswer: (_optionId: string) => void; // renamed to satisfy no-unused-vars
  handlePrevious: () => void;
  handleNext: () => void;
  isLastQuestion: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <QuizProgress progressPercent={progressPercent} />
        <span className="text-muted-foreground text-sm font-medium">
          Questão {currentIndex + 1} de {totalQuestions}
        </span>

        <h2 className="mt-2 text-xl font-semibold">
          {currentQuestion.statement}
        </h2>

        <RadioGroup
          value={selectedOptionId}
          onValueChange={handleSetAnswer}
          className="mt-6 space-y-3"
        >
          {currentQuestion.options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSetAnswer(option.id)}
              className="hover:bg-muted flex items-center rounded-lg border p-4 transition-colors"
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="ml-3 w-full cursor-pointer">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Anterior
          </Button>
          <Button onClick={handleNext} disabled={!selectedOptionId}>
            {isLastQuestion ? "Finalizar" : "Próxima"}
          </Button>
        </div>
      </div>
    </div>
  );
}
