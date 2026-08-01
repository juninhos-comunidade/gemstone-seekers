"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateProfile } from "@/lib/types/candidate";
import { useUpdateCandidateMutation } from "@/lib/api/candidate/updateCandidateProfile";
import {
  candidateProfileSchema,
  CandidateProfileFormData,
} from "@/lib/schemas/forms/candidateProfileSchema";
import { CandidatePersonalInfoSection } from "./sections/CandidatePersonalInfoSection";
import { CandidateAddressSection } from "./sections/CandidateAddressSection";
import { CandidateLinksSection } from "./sections/CandidateLinksSection";
import { CandidateLanguagesSection } from "./sections/CandidateLanguagesSection";
import { CandidateExperiencesSection } from "./sections/CandidateExperiencesSection";
import { CandidateEducationsSection } from "./sections/CandidateEducationsSection";
import { CandidateCertificationsSection } from "./sections/CandidateCertificationsSection";
import { CandidateProjectsSection } from "./sections/CandidateProjectsSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  MapPin,
  Link2,
  Languages,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CandidateProfileFormProps {
  initialData?: CandidateProfile | null;
}

export function CandidateProfileForm({
  initialData,
}: CandidateProfileFormProps) {
  const router = useRouter();
  const updateMutation = useUpdateCandidateMutation();

  const methods = useForm<CandidateProfileFormData>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      documentType: "CPF",
      documentNumber: "",
      summary: "",
      address: {
        street: "",
        number: "",
        neighborhood: "",
        complement: "",
        zipCode: "",
        cityName: "",
        stateCode: "SP",
      },
      links: [],
      languages: [],
      experiences: [],
      educations: [],
      certifications: [],
      projects: [],
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.user.name || "",
        phone: initialData.phone || "",
        documentType: initialData.user.documentType || "CPF",
        documentNumber: initialData.user.documentNumber || "",
        summary: initialData.summary || "",
        address: {
          street: initialData.address?.street || "",
          number: initialData.address?.number || "",
          neighborhood: initialData.address?.neighborhood || "",
          complement: initialData.address?.complement || "",
          zipCode: initialData.address?.zipCode || "",
          cityName: initialData.address?.cityName || "",
          stateCode: initialData.address?.stateCode || "SP",
        },
        links: initialData.links || [],
        languages: initialData.languages || [],
        experiences: initialData.experiences || [],
        educations: initialData.educations || [],
        certifications: initialData.certifications || [],
        projects: initialData.projects || [],
      });
    }
  }, [initialData, reset]);

  const onSubmit = (values: CandidateProfileFormData) => {
    updateMutation.mutate(
      {
        name: values.name,
        phone: values.phone || "",
        documentType: values.documentType,
        documentNumber: values.documentNumber || "",
        summary: values.summary || "",
        address: {
          street: values.address.street || "",
          number: values.address.number || "",
          neighborhood: values.address.neighborhood || "",
          complement: values.address.complement || "",
          zipCode: values.address.zipCode || "",
          cityName: values.address.cityName || "",
          stateCode: values.address.stateCode || "SP",
        },
        links: values.links || [],
        languages: values.languages || [],
        experiences: values.experiences || [],
        educations: values.educations || [],
        certifications: values.certifications || [],
        projects: values.projects || [],
      },
      {
        onSuccess: () => {
          toast.success("Perfil atualizado com sucesso!");
          router.push("/candidate/user");
        },
        onError: () => {
          toast.error("Erro ao salvar alterações do perfil.");
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 pt-20 pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/candidate/user"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-muted-foreground hover:text-foreground gap-2",
          )}
        >
          <ArrowLeft className="size-4" />
          Voltar para o Perfil
        </Link>
        <span className="text-muted-foreground font-mono text-xs">
          Edição Completa do Perfil
        </span>
      </div>

      <div className="border-border/40 space-y-1 border-b pb-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Editar Perfil do Candidato
        </h1>
        <p className="text-muted-foreground text-sm">
          Navegue pelas abas na lateral para atualizar cada seção do seu
          currículo.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs
            defaultValue="personal"
            orientation="vertical"
            className="flex flex-col items-start gap-8 pt-2 md:flex-row"
          >
            <div className="w-full shrink-0 space-y-4 md:w-64">
              <TabsList className="bg-card/90 border-border/60 flex h-auto w-full flex-col gap-1.5 rounded-xl border p-2 shadow-sm backdrop-blur">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full justify-start gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all"
                >
                  <User className="size-4 shrink-0" />
                  <span>Dados Pessoais</span>
                </TabsTrigger>

                <TabsTrigger
                  value="address"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full justify-start gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all"
                >
                  <MapPin className="size-4 shrink-0" />
                  <span>Endereço</span>
                </TabsTrigger>

                <TabsTrigger
                  value="links"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full justify-start gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all"
                >
                  <Link2 className="size-4 shrink-0" />
                  <span>Links & Redes</span>
                </TabsTrigger>

                <TabsTrigger
                  value="languages"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full justify-start gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all"
                >
                  <Languages className="size-4 shrink-0" />
                  <span>Idiomas</span>
                </TabsTrigger>

                <TabsTrigger
                  value="experiences"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full justify-start gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all"
                >
                  <Briefcase className="size-4 shrink-0" />
                  <span>Experiência</span>
                </TabsTrigger>

                <TabsTrigger
                  value="educations"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full justify-start gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all"
                >
                  <GraduationCap className="size-4 shrink-0" />
                  <span>Educação</span>
                </TabsTrigger>

                <TabsTrigger
                  value="certifications"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full justify-start gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all"
                >
                  <Award className="size-4 shrink-0" />
                  <span>Certificações</span>
                </TabsTrigger>

                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full justify-start gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all"
                >
                  <FolderGit2 className="size-4 shrink-0" />
                  <span>Projetos</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full gap-2 shadow-sm"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Link
                  href="/candidate/user"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-center",
                  )}
                >
                  Cancelar
                </Link>
              </div>
            </div>

            <div className="w-full flex-1 space-y-6">
              <TabsContent
                value="personal"
                className="mt-0 space-y-6 focus-visible:outline-none"
              >
                <CandidatePersonalInfoSection />
              </TabsContent>

              <TabsContent
                value="address"
                className="mt-0 space-y-6 focus-visible:outline-none"
              >
                <CandidateAddressSection />
              </TabsContent>

              <TabsContent
                value="links"
                className="mt-0 space-y-6 focus-visible:outline-none"
              >
                <CandidateLinksSection />
              </TabsContent>

              <TabsContent
                value="languages"
                className="mt-0 space-y-6 focus-visible:outline-none"
              >
                <CandidateLanguagesSection />
              </TabsContent>

              <TabsContent
                value="experiences"
                className="mt-0 space-y-6 focus-visible:outline-none"
              >
                <CandidateExperiencesSection />
              </TabsContent>

              <TabsContent
                value="educations"
                className="mt-0 space-y-6 focus-visible:outline-none"
              >
                <CandidateEducationsSection />
              </TabsContent>

              <TabsContent
                value="certifications"
                className="mt-0 space-y-6 focus-visible:outline-none"
              >
                <CandidateCertificationsSection />
              </TabsContent>

              <TabsContent
                value="projects"
                className="mt-0 space-y-6 focus-visible:outline-none"
              >
                <CandidateProjectsSection />
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}
