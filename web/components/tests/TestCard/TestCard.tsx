import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { techIcons, defaultIcon } from "@/lib/icons/techIcons";
import Link from "next/link";

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
        <Link href={`/candidate/test/${id}?difficulty=${difficulty}`}>
          <Button className="w-full">Começar</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
