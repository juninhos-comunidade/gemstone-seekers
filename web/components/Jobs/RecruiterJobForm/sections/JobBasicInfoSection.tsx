"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { JobFormData } from "@/lib/schemas/forms/jobFormSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Building2, UserCheck, Loader2 } from "lucide-react";
import { useCompaniesQuery } from "@/lib/api/companies/getCompanies";
import { useCompanyRecruitersQuery } from "@/lib/api/companies/getCompanyRecruiters";

export function JobBasicInfoSection() {
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<JobFormData>();

  const watchedCompanyId = useWatch({ control, name: "companyId" });
  const companyId = watchedCompanyId ?? getValues("companyId") ?? "";

  const watchedRecruiterId = useWatch({ control, name: "recruiterId" });
  const recruiterId = watchedRecruiterId ?? getValues("recruiterId") ?? "";

  const watchedSeniority = useWatch({ control, name: "seniorityLevel" });
  const seniorityLevel =
    watchedSeniority ?? getValues("seniorityLevel") ?? "Pleno";

  const { data: companies = [], isLoading: isLoadingCompanies } =
    useCompaniesQuery();

  const { data: recruiters = [], isLoading: isLoadingRecruiters } =
    useCompanyRecruitersQuery(companyId);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Briefcase className="text-primary size-4" />
          Informações Básicas da Vaga
        </CardTitle>
        <CardDescription>
          Título, empresa contratante, recrutador responsável e senioridade.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título da Vaga *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Ex: Desenvolvedor Front-end React / Next.js"
          />
          {errors.title && (
            <p className="text-destructive text-xs">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyId" className="flex items-center gap-1.5">
              <Building2 className="text-muted-foreground size-3.5" />
              Empresa Contratante *
            </Label>
            <Select
              value={companyId}
              onValueChange={(val) => {
                setValue("companyId", val ?? "");
                setValue("recruiterId", "");
              }}
              disabled={isLoadingCompanies}
            >
              <SelectTrigger id="companyId">
                <SelectValue
                  placeholder={
                    isLoadingCompanies
                      ? "Carregando empresas..."
                      : "Selecione a empresa..."
                  }
                />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {isLoadingCompanies ? (
                  <div className="text-muted-foreground flex items-center gap-2 p-2 text-xs">
                    <Loader2 className="size-3 animate-spin" /> Carregando
                    empresas...
                  </div>
                ) : (
                  companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.companyId && (
              <p className="text-destructive text-xs">
                {errors.companyId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recruiterId" className="flex items-center gap-1.5">
              <UserCheck className="text-muted-foreground size-3.5" />
              Recrutador Responsável *
            </Label>
            <Select
              value={recruiterId}
              onValueChange={(val) => setValue("recruiterId", val ?? "")}
              disabled={!companyId || isLoadingRecruiters}
            >
              <SelectTrigger id="recruiterId">
                <SelectValue
                  placeholder={
                    isLoadingRecruiters
                      ? "Carregando recrutadores..."
                      : !companyId
                        ? "Selecione uma empresa primeiro..."
                        : "Selecione o recrutador..."
                  }
                />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {isLoadingRecruiters ? (
                  <div className="text-muted-foreground flex items-center gap-2 p-2 text-xs">
                    <Loader2 className="size-3 animate-spin" /> Carregando
                    recrutadores...
                  </div>
                ) : recruiters.length === 0 ? (
                  <div className="text-muted-foreground p-2 text-xs">
                    Nenhum recrutador encontrado para esta empresa.
                  </div>
                ) : (
                  recruiters.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name ||
                        r.email ||
                        `Recrutador ${r.id.substring(0, 8)}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.recruiterId && (
              <p className="text-destructive text-xs">
                {errors.recruiterId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="department">Departamento / Área *</Label>
            <Input
              id="department"
              {...register("department")}
              placeholder="Ex: Engenharia de Software"
            />
            {errors.department && (
              <p className="text-destructive text-xs">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seniorityLevel">Nível de Senioridade *</Label>
            <Select
              value={seniorityLevel}
              onValueChange={(val) => {
                if (val) {
                  setValue(
                    "seniorityLevel",
                    val as JobFormData["seniorityLevel"],
                  );
                }
              }}
            >
              <SelectTrigger id="seniorityLevel">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Pleno">Pleno</SelectItem>
                <SelectItem value="Sênior">Sênior</SelectItem>
                <SelectItem value="Especialista">Especialista</SelectItem>
                <SelectItem value="Tech Lead">Tech Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
