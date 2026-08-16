"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { techIcons, defaultIcon } from "@/lib/icons/techIcons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAssessment } from "@/lib/api/assessments";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartTest = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tenta iniciar o assessment para verificar se há testes disponíveis
      await startAssessment(Tech, difficulty as AssessmentDifficulty);

      // Se sucesso, redireciona para a página do teste
      router.push(`/candidate/test/${id}?difficulty=${difficulty}`);
    } catch {
      setError("Esta tecnologia não possui testes disponíveis no momento.");
    } finally {
      setLoading(false);
    }
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

        {error && <p className="text-destructive text-sm">{error}</p>}

        <Button className="w-full" onClick={handleStartTest} disabled={loading}>
          {loading ? "Verificando..." : "Começar"}
        </Button>
      </CardContent>
    </Card>
  );
}
