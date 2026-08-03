"use client";

import React from "react";
import { Job } from "@/lib/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CheckCircle2, XCircle } from "lucide-react";

interface RecruiterJobMetricsProps {
  jobs: Job[];
}

export function RecruiterJobMetrics({ jobs }: RecruiterJobMetricsProps) {
  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.status === "OPEN").length;
  const closedJobs = jobs.filter(
    (j) => j.status === "CLOSED" || j.status === "CANCELLED",
  ).length;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
        <CardContent className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Total de Vagas
            </p>
            <p className="text-2xl font-bold">{totalJobs}</p>
          </div>
          <div className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
            <Briefcase className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
        <CardContent className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              Vagas Abertas
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {openJobs}
            </p>
          </div>
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
        <CardContent className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider text-rose-600 uppercase dark:text-rose-400">
              Vagas Canceladas
            </p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {closedJobs}
            </p>
          </div>
          <div className="grid size-10 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
            <XCircle className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
