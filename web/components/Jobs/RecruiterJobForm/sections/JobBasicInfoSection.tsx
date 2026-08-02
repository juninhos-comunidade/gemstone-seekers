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
import { Briefcase } from "lucide-react";

export function JobBasicInfoSection() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<JobFormData>();

  const seniorityLevel =
    useWatch({ control, name: "seniorityLevel" }) || "Pleno";
  const status = useWatch({ control, name: "status" }) || "OPEN";

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Briefcase className="text-primary size-4" />
          Informações Básicas da Vaga
        </CardTitle>
        <CardDescription>
          Título, empresa, nível de senioridade e localização.
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
            <Label htmlFor="companyName">Nome da Empresa *</Label>
            <Input
              id="companyName"
              {...register("companyName")}
              placeholder="Ex: Gemstone Tech Solutions"
            />
            {errors.companyName && (
              <p className="text-destructive text-xs">
                {errors.companyName.message}
              </p>
            )}
          </div>

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
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="seniorityLevel">Nível de Senioridade *</Label>
            <Select
              value={seniorityLevel}
              onValueChange={(val) =>
                setValue("seniorityLevel", val as JobFormData["seniorityLevel"])
              }
            >
              <SelectTrigger id="seniorityLevel">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Pleno">Pleno</SelectItem>
                <SelectItem value="Sênior">Sênior</SelectItem>
                <SelectItem value="Especialista">Especialista</SelectItem>
                <SelectItem value="Tech Lead">Tech Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="location">Localização / Regime *</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Ex: Remoto (Brasil), São Paulo (Híbrido)"
            />
            {errors.location && (
              <p className="text-destructive text-xs">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="status">Status da Vaga</Label>
            <Select
              value={status}
              onValueChange={(val) =>
                setValue("status", val as JobFormData["status"])
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Aberta (Publicada)</SelectItem>
                <SelectItem value="PAUSED">Pausada</SelectItem>
                <SelectItem value="CLOSED">Encerrada / Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
