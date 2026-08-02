"use client";

import React from "react";
import Link from "next/link";
import { Job, JobStatus } from "@/lib/types/job";
import { useDeleteJobMutation } from "@/lib/api/jobs/deleteJob";
import { useUpdateJobMutation } from "@/lib/api/jobs/updateJob";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Banknote,
  FilePenLine,
  Trash2,
  Code2,
  Eye,
  CheckCircle2,
  PauseCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RecruiterJobCardProps {
  job: Job;
}

export function RecruiterJobCard({ job }: RecruiterJobCardProps) {
  const deleteMutation = useDeleteJobMutation();
  const updateMutation = useUpdateJobMutation();

  const formatSalary = (val?: number) => {
    if (!val) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDelete = () => {
    deleteMutation.mutate(job.id, {
      onSuccess: () => {
        toast.success("Vaga excluída com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao excluir a vaga.");
      },
    });
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    updateMutation.mutate(
      {
        id: job.id,
        title: job.title,
        companyName: job.companyName,
        department: job.department,
        seniorityLevel: job.seniorityLevel,
        location: job.location,
        status: newStatus,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        description: job.description,
        technologies: job.technologies,
      },
      {
        onSuccess: () => {
          toast.success(`Status da vaga alterado para ${newStatus}!`);
        },
        onError: () => {
          toast.error("Erro ao atualizar o status da vaga.");
        },
      },
    );
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge
            variant="default"
            className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-[11px] text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="size-3" /> Aberta
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/30 text-[11px] text-amber-600"
          >
            <PauseCircle className="size-3" /> Pausada
          </Badge>
        );
      case "CLOSED":
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="text-muted-foreground gap-1 text-[11px]"
          >
            <XCircle className="size-3" /> Cancelada
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border/60 hover:border-primary/50 bg-card/80 flex flex-col justify-between shadow-sm backdrop-blur transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getStatusBadge(job.status)}
              <Badge
                variant="outline"
                className="border-primary/30 text-primary text-[11px] font-medium"
              >
                {job.seniorityLevel}
              </Badge>
            </div>
            <CardTitle className="pt-1 text-lg font-bold">
              {job.title}
            </CardTitle>
          </div>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs">
          <span className="text-foreground/80 flex items-center gap-1.5 font-medium">
            <Building2 className="text-primary/70 size-3" />
            {job.companyName}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="text-primary/70 size-3" />
            {job.location}
          </span>
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

        {job.technologies.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase">
              <Code2 className="size-3" /> Tecnologias Requeridas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {job.technologies.slice(0, 4).map((tech) => (
                <Badge
                  key={tech.technologyId}
                  variant={tech.isMandatory ? "default" : "secondary"}
                  className="px-2 py-0.5 text-[10px] font-normal"
                >
                  {tech.name}
                </Badge>
              ))}
              {job.technologies.length > 4 && (
                <Badge variant="outline" className="px-1.5 py-0.5 text-[10px]">
                  +{job.technologies.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-border/40 bg-muted/20 flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 pt-0">
        <div className="flex items-center gap-1">
          {job.status === "OPEN" ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => handleStatusChange("CLOSED")}
            >
              Encerrar
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => handleStatusChange("OPEN")}
            >
              Publicar
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-7 w-7"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/candidate/dashboard/jobs/${job.id}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-7 gap-1 px-2.5 text-xs",
            )}
          >
            <Eye className="size-3.5" /> Visualizar
          </Link>
          <Link
            href={`/recruiter/dashboard/jobs/${job.id}/edit`}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "h-7 gap-1 px-2.5 text-xs shadow-sm",
            )}
          >
            <FilePenLine className="size-3.5" /> Editar
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
