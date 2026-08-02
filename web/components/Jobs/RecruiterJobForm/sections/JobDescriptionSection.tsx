"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { JobFormData } from "@/lib/schemas/forms/jobFormSchema";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export function JobDescriptionSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<JobFormData>();

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="text-primary size-4" />
          Descrição Detalhada & Responsabilidades
        </CardTitle>
        <CardDescription>
          Detalhes sobre as atividades do dia a dia, requisitos da vaga e
          benefícios ofertados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor="description">Descrição da Vaga *</Label>
        <Textarea
          id="description"
          rows={8}
          {...register("description")}
          placeholder="Escreva a descrição completa da vaga, tarefas diárias, responsabilidades e diferenciais..."
        />
        {errors.description && (
          <p className="text-destructive text-xs">
            {errors.description.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
