"use client";

import React from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
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
import { Briefcase, Plus, Trash2 } from "lucide-react";

export function CandidateExperiencesSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  const experiencesWatch = useWatch({ control, name: "experiences" });

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="text-primary size-4" />
            Experiência Profissional
          </CardTitle>
          <CardDescription>
            Histórico profissional, empresas e principais atribuições.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() =>
            append({
              title: "",
              companyName: "",
              startDate: "",
              endDate: "",
              isCurrent: false,
              description: "",
            })
          }
        >
          <Plus className="size-3.5" />
          Adicionar Experiência
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-muted-foreground/70 py-2 text-xs italic">
            Nenhuma experiência profissional adicionada. Clique acima para
            incluir suas experiências.
          </p>
        ) : (
          fields.map((field, index) => {
            const isCurrent = experiencesWatch?.[index]?.isCurrent || false;
            return (
              <div
                key={field.id}
                className="border-border/40 bg-muted/20 relative space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono text-xs font-semibold">
                    Experiência #{index + 1}
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
                    <Label
                      htmlFor={`experiences.${index}.title`}
                      className="text-xs"
                    >
                      Cargo / Título *
                    </Label>
                    <Input
                      id={`experiences.${index}.title`}
                      {...register(`experiences.${index}.title`)}
                      placeholder="Ex: Desenvolvedor Front-end Senior"
                    />
                    {errors.experiences?.[index]?.title && (
                      <p className="text-destructive text-[11px]">
                        {errors.experiences[index]?.title?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor={`experiences.${index}.companyName`}
                      className="text-xs"
                    >
                      Empresa *
                    </Label>
                    <Input
                      id={`experiences.${index}.companyName`}
                      {...register(`experiences.${index}.companyName`)}
                      placeholder="Ex: TechLab Studio"
                    />
                    {errors.experiences?.[index]?.companyName && (
                      <p className="text-destructive text-[11px]">
                        {errors.experiences[index]?.companyName?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label
                      htmlFor={`experiences.${index}.startDate`}
                      className="text-xs"
                    >
                      Data de Início *
                    </Label>
                    <Input
                      id={`experiences.${index}.startDate`}
                      type="date"
                      {...register(`experiences.${index}.startDate`)}
                    />
                    {errors.experiences?.[index]?.startDate && (
                      <p className="text-destructive text-[11px]">
                        {errors.experiences[index]?.startDate?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor={`experiences.${index}.endDate`}
                      className="text-xs"
                    >
                      Data de Término
                    </Label>
                    <Input
                      id={`experiences.${index}.endDate`}
                      type="date"
                      disabled={isCurrent}
                      {...register(`experiences.${index}.endDate`)}
                    />
                  </div>

                  <div className="flex items-center gap-2 pb-2">
                    <input
                      type="checkbox"
                      id={`experiences.${index}.isCurrent`}
                      {...register(`experiences.${index}.isCurrent`)}
                      className="border-input size-4 rounded"
                    />
                    <Label
                      htmlFor={`experiences.${index}.isCurrent`}
                      className="cursor-pointer text-xs"
                    >
                      Trabalho atualmente nesta empresa
                    </Label>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor={`experiences.${index}.description`}
                    className="text-xs"
                  >
                    Descrição das Atividades / Conquistas
                  </Label>
                  <Textarea
                    id={`experiences.${index}.description`}
                    rows={3}
                    {...register(`experiences.${index}.description`)}
                    placeholder="Descreva suas principais responsabilidades, projetos entregues e tecnologias utilizadas..."
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
