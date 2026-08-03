"use client";

import React from "react";
import { RecruiterJobDashboard } from "@/components/Jobs/RecruiterJobDashboard/RecruiterJobDashboard";
import { useJobsQuery } from "@/lib/api/jobs/getJobs";
import { Loader2 } from "lucide-react";

export default function RecruiterJobsPage() {
  const { data: jobs, isLoading, error } = useJobsQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
          <Loader2 className="text-primary size-5 animate-spin" />
          <span>Carregando vagas do recrutador...</span>
        </div>
      </div>
    );
  }

  if (error || !jobs) {
    return (
      <div className="text-destructive flex min-h-[60vh] items-center justify-center pt-20 text-sm font-medium">
        Erro ao carregar painel de vagas.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <RecruiterJobDashboard jobs={jobs} />
    </div>
  );
}
