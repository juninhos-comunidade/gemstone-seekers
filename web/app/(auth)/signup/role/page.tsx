"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const route = useRouter();

  const handleChoseCandidate = () => {
    // Adicionada a barra "/" no início
    route.push("/signup/role/candidate");
  };

  const handleChoseRecruiter = () => {
    // Adicionada a barra "/" no início
    route.push("/signup/role/recruiter");
  };
  return (
    <div className="flex min-h-screen items-center justify-center gap-10 p-8">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Recrutador</h2>
        <p className="mb-4 text-muted-foreground">Você é um recrutador?</p>
        <Button onClick={handleChoseRecruiter}>Entrar</Button>
      </div>

      {/* Linha divisória */}
      <div className="h-48 w-px bg-border" />

      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Candidato</h2>
        <p className="mb-4 text-muted-foreground">Você é um candidato?</p>
        <Button onClick={handleChoseCandidate}>Entrar</Button>
      </div>
    </div>
  );
}
