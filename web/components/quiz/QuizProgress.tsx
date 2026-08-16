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
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">
          Questão {currentIndex + 1} de {totalQuestions}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-primary text-sm font-bold">
            {Math.round(progressPercent)}%
          </span>
          <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
        </div>
      </div>
      <Progress value={progressPercent} className="h-3" />
    </div>
  );
}
