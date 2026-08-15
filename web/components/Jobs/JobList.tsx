"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Job } from "@/lib/types/job";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Banknote, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs }: JobListProps) {
  const [search, setSearch] = useState("");

  const filteredJobs = (jobs || []).filter((job) => {
    const term = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.department.toLowerCase().includes(term)
    );
  });

  const formatSalary = (val?: number) => {
    if (!val) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Briefcase className="text-primary size-6" />
            Vagas Disponíveis
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Explore as oportunidades em aberto e encontre sua próxima posição.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por título, tech ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="border-dashed p-8 text-center">
          <CardContent className="space-y-2 pt-6">
            <p className="text-muted-foreground text-sm">
              Nenhuma vaga encontrada para &quot;{search}&quot;.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSearch("")}>
              Limpar busca
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="group border-border/60 hover:border-primary/50 bg-card/80 flex flex-col justify-between backdrop-blur transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-primary/30 text-primary text-[11px] font-medium"
                      >
                        {job.seniorityLevel}
                      </Badge>
                      <Badge variant="secondary" className="text-[11px]">
                        {job.department}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary text-lg font-bold transition-colors">
                      {job.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pb-4">
                <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  {job.description}
                </p>

                {(job.salaryMin || job.salaryMax) && (
                  <div className="flex w-fit items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Banknote className="size-3.5" />
                    <span>
                      {formatSalary(job.salaryMin)}
                      {job.salaryMin && job.salaryMax ? " - " : ""}
                      {formatSalary(job.salaryMax)} / mês
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-border/40 bg-muted/20 flex items-center justify-between border-t px-6 py-3 pt-0">
                <Link
                  href={`/candidate/dashboard/jobs/${job.id}`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "hover:text-primary gap-1.5 text-xs font-semibold",
                  )}
                >
                  Ver detalhe
                  <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
