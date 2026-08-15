"use client";

import React, { use } from "react";
import Link from "next/link";
import { JobDetail } from "@/components/Jobs/JobDetail";
import { useJobDetailQuery } from "@/lib/api/jobs/getJobDetail";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { data: job, isLoading } = useJobDetailQuery(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
          <Loader2 className="text-primary size-5 animate-spin" />
          <span>Carregando detalhes da vaga...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-xl py-12">
        <Card className="border-dashed p-8 text-center">
          <CardContent className="space-y-4 pt-6">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-amber-500/10 text-amber-500">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Vaga não encontrada</h2>
              <p className="text-muted-foreground text-sm">
                A vaga solicitada não existe ou foi desativada.
              </p>
            </div>
            <Link
              href="/candidate/dashboard/jobs"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <ArrowLeft className="size-4" />
              Voltar para lista de vagas
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <JobDetail job={job} />;
}
