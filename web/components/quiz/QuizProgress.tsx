import { Progress } from "@/components/ui/progress";

export function QuizProgress({ progressPercent }: { progressPercent: number }) {
  return <Progress value={progressPercent} />;
}
