"use client";

import React from "react";
import Link from "next/link";
import { Job } from "@/lib/types/job";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Banknote,
  Calendar,
  CheckCircle2,
  Info,
  Code2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  const formatSalary = (val?: number) => {
    if (!val) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const mandatoryTechs = job.technologies.filter((t) => t.isMandatory);
  const optionalTechs = job.technologies.filter((t) => !t.isMandatory);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      <div>
        <Link
          href="/candidate/dashboard/jobs"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-muted-foreground hover:text-foreground gap-2",
          )}
        >
          <ArrowLeft className="size-4" />
          Voltar para lista de vagas
        </Link>
      </div>

      <Card className="border-border/60 bg-card/80 overflow-hidden backdrop-blur">
        <div className="from-primary h-2 border-b bg-gradient-to-r via-indigo-500 to-purple-500" />
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs font-semibold">
                Vaga Aberta
              </Badge>
              <Badge
                variant="outline"
                className="border-primary/30 text-primary text-xs font-medium"
              >
                {job.seniorityLevel}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {job.department}
              </Badge>
            </div>
            <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
              <Calendar className="size-3" />
              Publicada em {new Date(job.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {job.title}
            </CardTitle>
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm">
              <span className="text-foreground flex items-center gap-1.5 font-semibold">
                <Building2 className="text-primary size-4" />
                {job.companyName}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="text-primary size-4" />
                {job.location}
              </span>
              {job.companyCnpj && (
                <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                  <Shield className="text-muted-foreground size-3" />
                  CNPJ: {job.companyCnpj}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        {(job.salaryMin || job.salaryMax) && (
          <CardContent className="px-6 py-0">
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-emerald-500/20">
                  <Banknote className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider text-emerald-800 uppercase dark:text-emerald-400">
                    Faixa Salarial Prevista
                  </p>
                  <p className="text-lg font-bold">
                    {formatSalary(job.salaryMin)}
                    {job.salaryMin && job.salaryMax ? " a " : ""}
                    {formatSalary(job.salaryMax)}
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      / mensal
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Descrição da Vaga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert text-muted-foreground max-w-none text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 text-xs text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
            <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
            <div>
              <p className="mb-0.5 font-semibold">
                Modo de Visualização (Roadmap)
              </p>
              <p className="text-muted-foreground">
                O botão de candidatura e o fluxo de testes de seleção serão
                habilitados na próxima fase do projeto.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Code2 className="text-primary size-4" />
                Tecnologias & Requisitos
              </CardTitle>
              <CardDescription className="text-xs">
                Competências avaliadas no processo seletivo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mandatoryTechs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    Requisitos Obrigatórios
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {mandatoryTechs.map((tech) => (
                      <Badge
                        key={tech.technologyId}
                        className="px-2.5 py-1 text-xs font-medium"
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {optionalTechs.length > 0 && (
                <div className="border-border/50 space-y-2 border-t pt-2">
                  <p className="text-muted-foreground text-xs font-semibold">
                    Diferenciais / Desejáveis
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {optionalTechs.map((tech) => (
                      <Badge
                        key={tech.technologyId}
                        variant="secondary"
                        className="px-2.5 py-1 text-xs"
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
