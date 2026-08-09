"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@/lib/types/job";
import { useJobTechnologiesQuery } from "@/lib/api/jobs/jobTechnologies/getJobTechnologies";
import { useAddJobTechnologiesMutation } from "@/lib/api/jobs/jobTechnologies/addJobTechnologies";
import { useRemoveJobTechnologiesMutation } from "@/lib/api/jobs/jobTechnologies/deleteJobTechnologies";
import { useUpdateJobMutation } from "@/lib/api/jobs/updateJob";
import { jobFormSchema, JobFormData } from "@/lib/schemas/forms/jobFormSchema";
import { JobBasicInfoSection } from "./sections/JobBasicInfoSection";
import { JobCompensationSection } from "./sections/JobCompensationSection";
import { JobDescriptionSection } from "./sections/JobDescriptionSection";
import { JobTechnologiesSection } from "./sections/JobTechnologiesSection";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EditJobFormProps {
  initialJob: Job;
}

export function EditJobForm({ initialJob }: EditJobFormProps) {
  const router = useRouter();
  const updateMutation = useUpdateJobMutation();
  const addTechnologiesMutation = useAddJobTechnologiesMutation();
  const removeTechnologiesMutation = useRemoveJobTechnologiesMutation();
  const { data: fetchedTechs } = useJobTechnologiesQuery(initialJob.id);

  const methods = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    values: {
      title: initialJob.title || "",
      companyId: initialJob.companyId || "",
      recruiterId: initialJob.recruiterId || "",
      department: initialJob.department || "",
      seniorityLevel: initialJob.seniorityLevel || "Pleno",
      status: initialJob.status || "OPEN",
      salaryMin: initialJob.salaryMin,
      salaryMax: initialJob.salaryMax,
      description: initialJob.description || "",
      technologies: fetchedTechs && fetchedTechs.length > 0 ? fetchedTechs : [],
    },
  });
  const { handleSubmit } = methods;

  const onSubmit = async (values: JobFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: initialJob.id,
        data: {
          title: values.title,
          description: values.description,
          seniorityLevel: values.seniorityLevel,
          department: values.department,
          salaryMin: values.salaryMin,
          salaryMax: values.salaryMax,
          companyId: values.companyId,
          recruiterId: values.recruiterId,
        },
      });

      const initialTechs = fetchedTechs || [];
      const currentTechs = values.technologies || [];

      const initialTechIds = new Set(initialTechs.map((t) => t.technologyId));
      const currentTechIds = new Set(currentTechs.map((t) => t.technologyId));

      const techsToAdd = currentTechs.filter(
        (t) => !initialTechIds.has(t.technologyId),
      );
      const techsToRemove = initialTechs.filter(
        (t) => !currentTechIds.has(t.technologyId),
      );

      if (techsToAdd.length > 0) {
        await addTechnologiesMutation.mutateAsync({
          jobId: initialJob.id,
          technologies: techsToAdd,
        });
      }

      if (techsToRemove.length > 0) {
        await removeTechnologiesMutation.mutateAsync({
          jobId: initialJob.id,
          technologyIds: techsToRemove.map((t) => t.technologyId),
        });
      }

      toast.success("Vaga e requisitos atualizados com sucesso!");
      router.push("/recruiter/dashboard/jobs");
    } catch {
      toast.error("Erro ao atualizar a vaga.");
    }
  };

  const isPending =
    updateMutation.isPending ||
    addTechnologiesMutation.isPending ||
    removeTechnologiesMutation.isPending;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 pt-20 pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/recruiter/dashboard/jobs"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-muted-foreground hover:text-foreground gap-2",
          )}
        >
          <ArrowLeft className="size-4" />
          Voltar para Vagas
        </Link>
        <span className="text-muted-foreground font-mono text-xs">
          Edição de Vaga
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Editar Oportunidade de Trabalho
        </h1>
        <p className="text-muted-foreground text-sm">
          Atualize os detalhes da vaga, empresa, recrutador, nível de
          senioridade e requisitos.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <JobBasicInfoSection />
          <JobCompensationSection />
          <JobDescriptionSection />
          <JobTechnologiesSection />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/recruiter/dashboard/jobs"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cancelar
            </Link>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Salvar Alterações da Vaga
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
