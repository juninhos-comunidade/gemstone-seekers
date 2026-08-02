"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Job } from "@/lib/types/job";
import { RecruiterJobMetrics } from "./RecruiterJobMetrics";
import { RecruiterJobCard } from "./RecruiterJobCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecruiterJobDashboardProps {
  jobs: Job[];
}

export function RecruiterJobDashboard({ jobs }: RecruiterJobDashboardProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.technologies.some((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()),
      );

    if (statusFilter === "ALL") return matchesSearch;
    return matchesSearch && job.status === statusFilter;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Briefcase className="text-primary size-6" />
            Gestão de Vagas & Oportunidades
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Cadastre novas vagas, gerencie o status das oportunidades e
            acompanhe requisitos técnicos.
          </p>
        </div>

        <Link
          href="/recruiter/dashboard/jobs/new"
          className={cn(
            buttonVariants({ variant: "default" }),
            "shrink-0 gap-2 shadow-sm",
          )}
        >
          <Plus className="size-4" />
          Cadastrar Nova Vaga
        </Link>
      </div>

      <RecruiterJobMetrics jobs={jobs} />

      <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
        <Tabs
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            <TabsTrigger value="ALL" className="text-xs">
              Todas ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="OPEN" className="text-xs">
              Abertas ({jobs.filter((j) => j.status === "OPEN").length})
            </TabsTrigger>
            <TabsTrigger value="PAUSED" className="text-xs">
              Pausadas ({jobs.filter((j) => j.status === "PAUSED").length})
            </TabsTrigger>
            <TabsTrigger value="CLOSED" className="text-xs">
              Canceladas (
              {
                jobs.filter(
                  (j) => j.status === "CLOSED" || j.status === "CANCELLED",
                ).length
              }
              )
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por título ou tecnologia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="border-dashed p-8 text-center">
          <CardContent className="space-y-3 pt-6">
            <p className="text-muted-foreground text-sm">
              Nenhuma vaga encontrada para os filtros selecionados.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            >
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredJobs.map((job) => (
            <RecruiterJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
