"use client";

import React, { use } from "react";
import Link from "next/link";
import { RecruiterJobForm } from "@/components/Jobs/RecruiterJobForm/RecruiterJobForm";
import { useJobDetailQuery } from "@/lib/api/jobs/getJobDetail";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditJobPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { data: job, isLoading } = useJobDetailQuery(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
          <Loader2 className="text-primary size-5 animate-spin" />
          <span>Carregando dados da vaga para edição...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-xl py-20">
        <Card className="border-dashed p-8 text-center">
          <CardContent className="space-y-4 pt-6">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-amber-500/10 text-amber-500">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Vaga não encontrada</h2>
              <p className="text-muted-foreground text-sm">
                A vaga solicitada não existe ou foi removida.
              </p>
            </div>
            <Link
              href="/recruiter/dashboard/jobs"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <ArrowLeft className="size-4" />
              Voltar para Lista de Vagas
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <RecruiterJobForm initialJob={job} />;
}
