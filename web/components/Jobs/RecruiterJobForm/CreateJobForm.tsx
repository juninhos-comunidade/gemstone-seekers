"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateJobMutation } from "@/lib/api/jobs/createJob";
import { useAddJobTechnologiesMutation } from "@/lib/api/jobs/jobTechnologies/addJobTechnologies";
import { jobFormSchema, JobFormData } from "@/lib/schemas/forms/jobFormSchema";
import { JobBasicInfoSection } from "./sections/JobBasicInfoSection";
import { JobCompensationSection } from "./sections/JobCompensationSection";
import { JobDescriptionSection } from "./sections/JobDescriptionSection";
import { JobTechnologiesSection } from "./sections/JobTechnologiesSection";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CreateJobForm() {
  const router = useRouter();
  const createMutation = useCreateJobMutation();
  const addTechnologiesMutation = useAddJobTechnologiesMutation();

  const methods = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      companyId: "",
      recruiterId: "",
      department: "Engenharia de Software",
      seniorityLevel: "Pleno",
      status: "OPEN",
      salaryMin: undefined,
      salaryMax: undefined,
      description: "",
      technologies: [],
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (values: JobFormData) => {
    try {
      const createdJob = await createMutation.mutateAsync({
        title: values.title,
        description: values.description,
        seniorityLevel: values.seniorityLevel,
        department: values.department,
        salaryMin: values.salaryMin,
        salaryMax: values.salaryMax,
        companyId: values.companyId,
        recruiterId: values.recruiterId,
      });

      if (values.technologies && values.technologies.length > 0) {
        await addTechnologiesMutation.mutateAsync({
          jobId: createdJob.id,
          technologies: values.technologies,
        });
      }

      toast.success("Vaga cadastrada e publicada com sucesso!");
      router.push("/recruiter/dashboard/jobs");
    } catch {
      toast.error("Erro ao cadastrar a vaga.");
    }
  };

  const isPending =
    createMutation.isPending || addTechnologiesMutation.isPending;

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
          Nova Vaga
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Cadastrar Nova Oportunidade
        </h1>
        <p className="text-muted-foreground text-sm">
          Preencha os detalhes da vaga, empresa, recrutador, nível de
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
                  Cadastrar e Publicar Vaga
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
