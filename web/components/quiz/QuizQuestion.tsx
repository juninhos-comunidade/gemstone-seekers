"use client";
import React from "react";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type Question } from "@/lib/types/quiz";
import { QuizCloseModal } from "./QuizCloseModal";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

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
  onCancel,
  submitting,
}: {
  progressPercent: number;
  currentIndex: number;
  totalQuestions: number;
  currentQuestion: Question;
  selectedOptionId: string;
  handleSetAnswer: (_optionId: string) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  isLastQuestion: boolean;
  onCancel?: () => void;
  submitting?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <div className="bg-card rounded-2xl border p-6 shadow-lg md:p-8">
        {/* Header com progresso e botão de fechar */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <QuizProgress
                progressPercent={progressPercent}
                currentIndex={currentIndex}
                totalQuestions={totalQuestions}
              />
            </div>
            <QuizCloseModal onCancel={onCancel} />
          </div>
        </div>

        {/* Questão */}
        <div className="mb-8">
          <div className="mb-4 flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
              {currentIndex + 1}
            </div>
            <h2 className="text-lg leading-relaxed font-semibold md:text-xl">
              {currentQuestion.statement}
            </h2>
          </div>
        </div>

        {/* Opções de resposta */}
        <RadioGroup
          value={selectedOptionId}
          onValueChange={handleSetAnswer}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, _index) => {
            const isSelected = selectedOptionId === option.id.toString();
            return (
              <div
                key={option.id}
                onClick={() => handleSetAnswer(option.id.toString())}
                className={`group relative flex cursor-pointer items-center rounded-xl border-2 p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors md:h-7 md:w-7">
                  {isSelected ? (
                    <div className="bg-primary h-3 w-3 rounded-full md:h-4 md:w-4" />
                  ) : (
                    <div className="bg-muted-foreground/20 h-3 w-3 rounded-full md:h-4 md:w-4" />
                  )}
                </div>
                <Label
                  htmlFor={option.id.toString()}
                  className="ml-4 flex-1 cursor-pointer text-base font-medium"
                >
                  {option.text || option.optionText}
                </Label>
                {isSelected && (
                  <CheckCircle2 className="text-primary h-5 w-5 md:h-6 md:w-6" />
                )}
              </div>
            );
          })}
        </RadioGroup>

        {/* Botões de navegação */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedOptionId || submitting}
            className="w-full sm:w-auto"
          >
            {isLastQuestion ? (
              <>
                Finalizar
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Próxima
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
