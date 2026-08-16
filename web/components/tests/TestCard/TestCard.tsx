"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { techIcons, defaultIcon } from "@/lib/icons/techIcons";
import { useRouter } from "next/navigation";
import { useStartAssessmentMutation } from "@/lib/api/assessments";
import type { AssessmentDifficulty } from "@/lib/types/assessment";

type TestCardProps = {
  id: string;
  Tech: string;
  Titulo: string;
  Descricao: string;
  NumQuestoes: number;
  Nivel: string;
  difficulty?: string;
};

export function TestCard({
  id,
  Tech,
  Titulo,
  Descricao,
  NumQuestoes,
  Nivel,
  difficulty = "BEGINNER",
}: TestCardProps) {
  const icon = techIcons[Tech] || defaultIcon;
  const router = useRouter();

  const { mutate: startTest, isPending, error } = useStartAssessmentMutation();

  const handleStartTest = () => {
    startTest(
      { technology: Tech, difficulty: difficulty as AssessmentDifficulty },
      {
        onSuccess: () => {
          router.push(`/candidate/test/${id}?difficulty=${difficulty}`);
        },
      },
    );
  };

  return (
    <Card className="max-w-sm">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-4">
          <Icon icon={icon} className="h-10 w-10" />

          <h2 className="text-2xl font-semibold">{Titulo}</h2>
        </div>

        <p className="text-muted-foreground text-sm">{Descricao}</p>

        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <span>{NumQuestoes} questões</span>
          <span>•</span>
          <span>{Nivel}</span>
        </div>

        {error && (
          <p className="text-destructive text-sm">
            Esta tecnologia não possui testes disponíveis no momento.
          </p>
        )}

        <Button
          className="w-full"
          onClick={handleStartTest}
          disabled={isPending}
        >
          {isPending ? "Verificando..." : "Começar"}
        </Button>
      </CardContent>
    </Card>
  );
}
