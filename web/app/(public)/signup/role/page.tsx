"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const route = useRouter();

  const handleChoseCandidate = () => {
    route.push("/signup/role/candidate");
  };

  const handleChoseRecruiter = () => {
    route.push("/signup/role/recruiter");
  };
  return (
    <div className="flex min-h-screen items-center justify-center gap-10 p-8">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Recrutador</h2>
        <p className="text-muted-foreground mb-4">Você é um recrutador?</p>
        <Button onClick={handleChoseRecruiter}>Selecionar</Button>
      </div>

      <div className="bg-border h-48 w-px" />

      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Candidato(a)</h2>
        <p className="text-muted-foreground mb-4">Você é um candidato?</p>
        <Button onClick={handleChoseCandidate}>Selecionar</Button>
      </div>
    </div>
  );
}
