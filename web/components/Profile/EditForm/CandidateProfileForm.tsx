"use client";

import React from "react";
import Link from "next/link";
import { CandidateProfileResponse } from "@/lib/types/candidate";
import { CandidatePersonalInfo } from "./sections/CandidatePersonalInfo";
import { CandidateAddress } from "./sections/CandidateAddress";
import { CandidateLinks } from "./sections/CandidateLinks";
import { CandidateLanguages } from "./sections/CandidateLanguages";
import { CandidateExperiences } from "./sections/CandidateExperiences";
import { CandidateEducations } from "./sections/CandidateEducations";
import { CandidateCertifications } from "./sections/CandidateCertifications";
import { CandidateProjects } from "./sections/CandidateProjects";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  MapPin,
  Link2,
  Languages,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateProfileFormProps {
  initialData?: CandidateProfileResponse | null;
}

export function CandidateProfileForm({
  initialData,
}: CandidateProfileFormProps) {
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
          Edição Granular do Perfil
        </span>
      </div>

      <div className="border-border/40 space-y-1 border-b pb-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Editar Perfil do Candidato
        </h1>
        <p className="text-muted-foreground text-sm">
          Navegue pelas abas para atualizar cada seção individualmente.
        </p>
      </div>

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
            <Link
              href="/candidate/user"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-center",
              )}
            >
              Concluir Edição
            </Link>
          </div>
        </div>

        <div className="w-full flex-1 space-y-6">
          <TabsContent
            value="personal"
            className="mt-0 space-y-6 focus-visible:outline-none"
          >
            <CandidatePersonalInfo initialData={initialData} />
          </TabsContent>

          <TabsContent
            value="address"
            className="mt-0 space-y-6 focus-visible:outline-none"
          >
            <CandidateAddress initialData={initialData} />
          </TabsContent>

          <TabsContent
            value="links"
            className="mt-0 space-y-6 focus-visible:outline-none"
          >
            <CandidateLinks initialData={initialData} />
          </TabsContent>

          <TabsContent
            value="languages"
            className="mt-0 space-y-6 focus-visible:outline-none"
          >
            <CandidateLanguages initialData={initialData} />
          </TabsContent>

          <TabsContent
            value="experiences"
            className="mt-0 space-y-6 focus-visible:outline-none"
          >
            <CandidateExperiences initialData={initialData} />
          </TabsContent>

          <TabsContent
            value="educations"
            className="mt-0 space-y-6 focus-visible:outline-none"
          >
            <CandidateEducations initialData={initialData} />
          </TabsContent>

          <TabsContent
            value="certifications"
            className="mt-0 space-y-6 focus-visible:outline-none"
          >
            <CandidateCertifications initialData={initialData} />
          </TabsContent>

          <TabsContent
            value="projects"
            className="mt-0 space-y-6 focus-visible:outline-none"
          >
            <CandidateProjects initialData={initialData} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
