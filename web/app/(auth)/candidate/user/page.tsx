"use client";

import React from "react";
import { CandidateProfileView } from "@/components/Profile/CandidateProfileView";
import { useCandidateQuery } from "@/lib/api/candidate/getCandidateProfile";
import { Loader2 } from "lucide-react";

export default function CandidateUserPage() {
  const { data: profile, isLoading, error } = useCandidateQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
          <Loader2 className="text-primary size-5 animate-spin" />
          <span>Carregando dados do candidato...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive flex min-h-[60vh] items-center justify-center pt-20 text-sm">
        Erro ao carregar dados do candidato.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <CandidateProfileView initialData={profile || null} />
    </div>
  );
}
