"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

export function QuizNotFound() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
      <div className="bg-card rounded-2xl border p-6 text-center shadow-lg md:p-8">
        {/* Ícone de erro */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" />
            <AlertCircle className="relative h-16 w-16 text-red-500 md:h-20 md:w-20" />
          </div>
        </div>

        {/* Mensagens */}
        <h2 className="mb-2 text-2xl font-bold md:text-3xl">
          Teste não encontrado
        </h2>
        <p className="text-muted-foreground mb-8 text-sm md:text-base">
          O questionário solicitado não existe ou foi removido.
        </p>

        {/* Botão de ação */}
        <Button
          onClick={() => router.push("/dashboard/tests")}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar aos testes
        </Button>
      </div>
    </div>
  );
}
