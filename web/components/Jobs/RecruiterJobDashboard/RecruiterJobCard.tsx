"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Job, JobStatus } from "@/lib/types/job";
import { useDeleteJobMutation } from "@/lib/api/jobs/deleteJob";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  Banknote,
  FilePenLine,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RecruiterJobCardProps {
  job: Job;
}

export function RecruiterJobCard({ job }: RecruiterJobCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteJobMutation();

  const formatSalary = (val?: number) => {
    if (!val) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(job.id, {
      onSuccess: () => {
        toast.success("Vaga excluída com sucesso!");
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        toast.error("Erro ao excluir a vaga.");
      },
    });
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
      case "CLOSED":
        return (
          <Badge
            variant="outline"
            className="text-muted-foreground gap-1 text-[11px]"
          >
            <XCircle className="size-3" /> Encerrada
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="text-muted-foreground gap-1 text-[11px]"
          >
            <XCircle className="size-3" /> Cancelada
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-muted-foreground gap-1 text-[11px]"
          >
            <XCircle className="size-3" /> Cancelada / Encerrada
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
              {job.seniorityLevel && (
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary text-[11px] font-medium"
                >
                  {job.seniorityLevel}
                </Badge>
              )}
            </div>
            <CardTitle className="pt-1 text-lg font-bold">
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

      <CardFooter className="border-border/40 bg-muted/20 flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 pt-3">
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive h-7 gap-1 px-2 text-xs"
              >
                <Trash2 className="size-3.5" /> Excluir Vaga
              </Button>
            }
          />
          <DialogContent showCloseButton={false} className="sm:max-w-md">
            <DialogHeader className="space-y-3">
              <div className="bg-destructive/10 text-destructive mx-auto flex size-12 items-center justify-center rounded-full">
                <AlertTriangle className="size-6" />
              </div>
              <DialogTitle className="text-center text-lg font-bold">
                Excluir Oportunidade
              </DialogTitle>
              <DialogDescription className="text-center text-xs">
                Tem certeza que deseja excluir permanentemente a vaga{" "}
                <strong className="text-foreground">{job.title}</strong>? Esta
                ação não poderá ser desfeita.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="gap-2"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3.5" /> Confirmar Exclusão
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-2">
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
