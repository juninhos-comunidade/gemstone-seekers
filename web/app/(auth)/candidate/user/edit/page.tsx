"use client";

import React from "react";
import { CandidateProfileForm } from "@/components/Profile/EditForm/CandidateProfileForm";
import { useCandidateQuery } from "@/lib/api/candidate/getCandidateProfile";
import { Loader2 } from "lucide-react";

export default function CandidateProfileEditPage() {
  const { data: profile, isLoading } = useCandidateQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
          <Loader2 className="text-primary size-5 animate-spin" />
          <span>Carregando formulário de edição...</span>
        </div>
      </div>
    );
  }

  return <CandidateProfileForm initialData={profile} />;
}
