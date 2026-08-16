"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trophy, Target, TrendingUp, ArrowRight } from "lucide-react";

export type QuizResultProps = {
  score: number;
  totalQuestions: number;
  assessmentId?: string;
};

export function QuizResult({
  score,
  totalQuestions,
  assessmentId: _assessmentId,
}: QuizResultProps) {
  const router = useRouter();
  const percentage = Math.round((score / totalQuestions) * 100);

  const getPerformanceLevel = () => {
    if (percentage >= 80)
      return {
        level: "Excelente",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      };
    if (percentage >= 60)
      return {
        level: "Bom",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      };
    if (percentage >= 40)
      return {
        level: "Regular",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      };
    return {
      level: "Precisa melhorar",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    };
  };

  const performance = getPerformanceLevel();

  return (
    <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
      <div className="bg-card rounded-2xl border p-6 text-center shadow-lg md:p-8">
        {/* Ícone de troféu animado */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-400/20 blur-xl" />
            <Trophy className="relative h-16 w-16 text-yellow-500 md:h-20 md:w-20" />
          </div>
        </div>

        {/* Título principal */}
        <h2 className="mb-2 text-2xl font-bold md:text-3xl">
          Teste concluído!
        </h2>
        <p className="text-muted-foreground mb-8 text-sm md:text-base">
          Parabéns por completar o questionário
        </p>

        {/* Card de resultado */}
        <div
          className={`mb-8 rounded-xl border-2 p-6 ${performance.bgColor} ${performance.color}`}
        >
          <div className="mb-4">
            <p className="text-sm font-medium tracking-wider uppercase opacity-70">
              Seu desempenho
            </p>
            <p
              className={`text-3xl font-bold md:text-4xl ${performance.color}`}
            >
              {performance.level}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 rounded-lg p-4">
              <div className="mb-1 flex items-center justify-center gap-2">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Acertos</span>
              </div>
              <p className="text-2xl font-bold">{score}</p>
              <p className="text-muted-foreground text-xs">
                de {totalQuestions}
              </p>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <div className="mb-1 flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Percentual</span>
              </div>
              <p className="text-2xl font-bold">{percentage}%</p>
              <p className="text-muted-foreground text-xs">de acertos</p>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => router.push("/candidate/dashboard/tests")}
            className="w-full sm:w-auto"
          >
            Voltar aos testes
          </Button>
          <Button
            onClick={() => router.push("/candidate/dashboard")}
            className="w-full sm:w-auto"
          >
            Ir para dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
