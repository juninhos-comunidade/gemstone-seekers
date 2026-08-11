import React from "react";

export function QuizNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="bg-card rounded-xl border p-6 text-center shadow-sm">
        <h2 className="text-xl font-semibold">Teste não encontrado</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          O questionário solicitado não existe ou foi removido.
        </p>
      </div>
    </div>
  );
}
