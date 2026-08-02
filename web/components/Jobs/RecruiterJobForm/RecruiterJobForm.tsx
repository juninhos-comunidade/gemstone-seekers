"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@/lib/types/job";
import { useCreateJobMutation } from "@/lib/api/jobs/createJob";
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

interface RecruiterJobFormProps {
  initialJob?: Job | null;
}

export function RecruiterJobForm({ initialJob }: RecruiterJobFormProps) {
  const router = useRouter();
  const createMutation = useCreateJobMutation();
  const updateMutation = useUpdateJobMutation();

  const isEditing = Boolean(initialJob);

  const methods = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      companyName: "Gemstone Tech Solutions",
      department: "Engenharia de Software",
      seniorityLevel: "Pleno",
      location: "Remoto (Brasil)",
      status: "OPEN",
      salaryMin: undefined,
      salaryMax: undefined,
      description: "",
      technologies: [],
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (initialJob) {
      reset({
        title: initialJob.title || "",
        companyName: initialJob.companyName || "Gemstone Tech Solutions",
        department: initialJob.department || "",
        seniorityLevel: initialJob.seniorityLevel || "Pleno",
        location: initialJob.location || "",
        status: initialJob.status || "OPEN",
        salaryMin: initialJob.salaryMin,
        salaryMax: initialJob.salaryMax,
        description: initialJob.description || "",
        technologies: initialJob.technologies || [],
      });
    }
  }, [initialJob, reset]);

  const onSubmit = (values: JobFormData) => {
    if (isEditing && initialJob) {
      updateMutation.mutate(
        {
          id: initialJob.id,
          ...values,
        },
        {
          onSuccess: () => {
            toast.success("Vaga atualizada com sucesso!");
            router.push("/recruiter/dashboard/jobs");
          },
          onError: () => {
            toast.error("Erro ao atualizar a vaga.");
          },
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Vaga cadastrada e publicada com sucesso!");
          router.push("/recruiter/dashboard/jobs");
        },
        onError: () => {
          toast.error("Erro ao cadastrar a vaga.");
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

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
          {isEditing ? "Edição de Vaga" : "Nova Vaga"}
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing
            ? "Editar Oportunidade de Trabalho"
            : "Cadastrar Nova Oportunidade"}
        </h1>
        <p className="text-muted-foreground text-sm">
          Preencha os detalhes da vaga, nível de senioridade, requisitos e
          remuneração.
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
                  {isEditing
                    ? "Salvar Alterações da Vaga"
                    : "Cadastrar e Publicar Vaga"}
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
