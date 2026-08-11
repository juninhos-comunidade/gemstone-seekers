export type QuizResultProps = {
  score: number;
  totalQuestions: number;
};

export function QuizResult({ score, totalQuestions }: QuizResultProps) {
  return (
    <div>
      <div className="mx-auto w-full max-w-2xl p-6">
        <div className="bg-card rounded-xl border p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold">Teste concluído!</h2>
          <p className="text-muted-foreground mt-2">
            Você acertou {score} de {totalQuestions} questões.
          </p>
        </div>
      </div>
    </div>
  );
}
