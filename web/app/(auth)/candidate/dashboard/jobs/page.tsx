"use client";

import React from "react";
import { JobList } from "@/components/Jobs/JobList";
import { useJobsQuery } from "@/lib/api/jobs/getJobs";
import { Loader2 } from "lucide-react";

export default function CandidateJobsPage() {
  const { data: jobs, isLoading, error } = useJobsQuery();

  if (isLoading || !jobs) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
          <Loader2 className="text-primary size-5 animate-spin" />
          <span>Buscando oportunidades disponíveis...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive flex min-h-[60vh] items-center justify-center text-sm font-medium">
        Erro ao carregar lista de vagas.
      </div>
    );
  }

  return <JobList jobs={jobs} />;
}
