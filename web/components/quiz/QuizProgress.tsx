import { Progress } from "@/components/ui/progress";

export function QuizProgress({
  progressPercent,
  currentIndex,
  totalQuestions,
}: {
  progressPercent: number;
  currentIndex: number;
  totalQuestions: number;
}) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">
          Questão {currentIndex + 1} de {totalQuestions}
        </span>
        <span className="text-foreground text-sm font-semibold">
          {Math.round(progressPercent)}%
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
    </div>
  );
}
