"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CandidateProfileFormData } from "@/lib/schemas/forms/candidateProfileSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

export function CandidateEducationsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="text-primary size-4" />
            Educação & Formação Acadêmica
          </CardTitle>
          <CardDescription>
            Graduação, pós-graduação e cursos superiores.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() =>
            append({
              institution: "",
              fieldOfStudy: "",
              degree: "",
              startDate: "",
              completionDate: "",
            })
          }
        >
          <Plus className="size-3.5" />
          Adicionar Formação
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-muted-foreground/70 py-2 text-xs italic">
            Nenhuma formação acadêmica adicionada. Clique acima para incluir sua
            formação.
          </p>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="border-border/40 bg-muted/20 space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-mono text-xs font-semibold">
                  Formação #{index + 1}
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1 sm:col-span-2">
                  <Label
                    htmlFor={`educations.${index}.institution`}
                    className="text-xs"
                  >
                    Instituição de Ensino *
                  </Label>
                  <Input
                    id={`educations.${index}.institution`}
                    {...register(`educations.${index}.institution`)}
                    placeholder="Ex: Universidade de São Paulo (USP)"
                  />
                  {errors.educations?.[index]?.institution && (
                    <p className="text-destructive text-[11px]">
                      {errors.educations[index]?.institution?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <Label
                    htmlFor={`educations.${index}.degree`}
                    className="text-xs"
                  >
                    Grau / Titulação
                  </Label>
                  <Input
                    id={`educations.${index}.degree`}
                    {...register(`educations.${index}.degree`)}
                    placeholder="Ex: Bacharelado, Tecnólogo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1 sm:col-span-1">
                  <Label
                    htmlFor={`educations.${index}.fieldOfStudy`}
                    className="text-xs"
                  >
                    Curso / Área de Estudo *
                  </Label>
                  <Input
                    id={`educations.${index}.fieldOfStudy`}
                    {...register(`educations.${index}.fieldOfStudy`)}
                    placeholder="Ex: Ciência da Computação"
                  />
                  {errors.educations?.[index]?.fieldOfStudy && (
                    <p className="text-destructive text-[11px]">
                      {errors.educations[index]?.fieldOfStudy?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <Label
                    htmlFor={`educations.${index}.startDate`}
                    className="text-xs"
                  >
                    Data de Início
                  </Label>
                  <Input
                    id={`educations.${index}.startDate`}
                    type="date"
                    {...register(`educations.${index}.startDate`)}
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <Label
                    htmlFor={`educations.${index}.completionDate`}
                    className="text-xs"
                  >
                    Data de Conclusão / Previsão
                  </Label>
                  <Input
                    id={`educations.${index}.completionDate`}
                    type="date"
                    {...register(`educations.${index}.completionDate`)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
