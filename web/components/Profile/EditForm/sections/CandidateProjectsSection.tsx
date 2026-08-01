"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CandidateProfileFormData } from "@/lib/schemas/forms/candidateProfileSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FolderGit2, Plus, Trash2 } from "lucide-react";

export function CandidateProjectsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FolderGit2 className="text-primary size-4" />
            Projetos Relevantes & Portfólio
          </CardTitle>
          <CardDescription>
            Projetos pessoais, de código aberto ou cases desenvolvidos.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() =>
            append({
              name: "",
              description: "",
              projectUrl: "",
              startDate: "",
              endDate: "",
            })
          }
        >
          <Plus className="size-3.5" />
          Adicionar Projeto
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-muted-foreground/70 py-2 text-xs italic">
            Nenhum projeto adicionado. Clique acima para incluir seus projetos.
          </p>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="border-border/40 bg-muted/20 space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-mono text-xs font-semibold">
                  Projeto #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-7 w-7"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor={`projects.${index}.name`} className="text-xs">
                    Nome do Projeto *
                  </Label>
                  <Input
                    id={`projects.${index}.name`}
                    {...register(`projects.${index}.name`)}
                    placeholder="Ex: Gemstone Seekers Platform"
                  />
                  {errors.projects?.[index]?.name && (
                    <p className="text-destructive text-[11px]">
                      {errors.projects[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor={`projects.${index}.projectUrl`}
                    className="text-xs"
                  >
                    URL do Projeto / Repositório
                  </Label>
                  <Input
                    id={`projects.${index}.projectUrl`}
                    {...register(`projects.${index}.projectUrl`)}
                    placeholder="Ex: https://github.com/usuario/projeto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label
                    htmlFor={`projects.${index}.startDate`}
                    className="text-xs"
                  >
                    Data de Início
                  </Label>
                  <Input
                    id={`projects.${index}.startDate`}
                    type="date"
                    {...register(`projects.${index}.startDate`)}
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor={`projects.${index}.endDate`}
                    className="text-xs"
                  >
                    Data de Término (se concluído)
                  </Label>
                  <Input
                    id={`projects.${index}.endDate`}
                    type="date"
                    {...register(`projects.${index}.endDate`)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor={`projects.${index}.description`}
                  className="text-xs"
                >
                  Descrição do Projeto
                </Label>
                <Textarea
                  id={`projects.${index}.description`}
                  rows={3}
                  {...register(`projects.${index}.description`)}
                  placeholder="Descreva o propósito do projeto, a arquitetura e as soluções técnicas aplicadas..."
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
