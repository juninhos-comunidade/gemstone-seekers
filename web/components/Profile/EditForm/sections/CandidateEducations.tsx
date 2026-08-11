"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  educationSchema,
  EducationFormData,
} from "@/lib/schemas/forms/candidateProfileSchema";
import { CandidateProfileResponse } from "@/lib/types/candidate";
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
import { GraduationCap, Plus, Trash2, Loader2 } from "lucide-react";
import {
  useAddEducationMutation,
  useDeleteEducationMutation,
} from "@/lib/api/candidate/userProfileMutations";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog/ConfirmDeleteDialog";

interface CandidateEducationsProps {
  initialData?: CandidateProfileResponse | null;
}

export function CandidateEducations({ initialData }: CandidateEducationsProps) {
  const educations = initialData?.candidate?.educations || [];

  const addForm = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      fieldOfStudy: "",
      degree: "",
      startDate: "",
      completionDate: "",
    },
  });

  const addEducationMutation = useAddEducationMutation();
  const deleteEducationMutation = useDeleteEducationMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const handleAddEducation = (data: EducationFormData) => {
    addEducationMutation.mutate(
      {
        institution: data.institution.trim(),
        fieldOfStudy: data.fieldOfStudy.trim(),
        degree: data.degree?.trim() || undefined,
        startDate: data.startDate || undefined,
        completionDate: data.completionDate || undefined,
      },
      {
        onSuccess: () => {
          addForm.reset({
            institution: "",
            fieldOfStudy: "",
            degree: "",
            startDate: "",
            completionDate: "",
          });
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;

    if (deleteTargetId.id) {
      deleteEducationMutation.mutate(deleteTargetId.id, {
        onSuccess: () => {
          setDeleteTargetId(null);
        },
        onError: () => {
          setDeleteTargetId(null);
        },
      });
    } else {
      setDeleteTargetId(null);
    }
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GraduationCap className="text-primary size-4" />
          Educação & Formação Acadêmica
        </CardTitle>
        <CardDescription>
          Graduação, pós-graduação e cursos superiores.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addForm.handleSubmit(handleAddEducation)}>
          <div className="border-border/40 bg-muted/20 space-y-3 rounded-lg border p-4">
            <span className="text-foreground text-xs font-semibold">
              Adicionar Nova Formação
            </span>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Instituição de Ensino *</Label>
                <Input
                  {...addForm.register("institution")}
                  placeholder="Ex: Universidade de São Paulo (USP)"
                />
                {addForm.formState.errors.institution && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.institution.message}
                  </p>
                )}
              </div>
              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs">Grau / Titulação</Label>
                <Input
                  {...addForm.register("degree")}
                  placeholder="Ex: Bacharelado, Tecnólogo"
                />
                {addForm.formState.errors.degree && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.degree.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs">Curso / Área de Estudo *</Label>
                <Input
                  {...addForm.register("fieldOfStudy")}
                  placeholder="Ex: Ciência da Computação"
                />
                {addForm.formState.errors.fieldOfStudy && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.fieldOfStudy.message}
                  </p>
                )}
              </div>
              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs">Data de Início</Label>
                <Input type="date" {...addForm.register("startDate")} />
                {addForm.formState.errors.startDate && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs">Data de Conclusão / Previsão</Label>
                <Input type="date" {...addForm.register("completionDate")} />
                {addForm.formState.errors.completionDate && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.completionDate.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={addEducationMutation.isPending}
              className="gap-1 text-xs"
            >
              {addEducationMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              Adicionar Formação
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <span className="text-foreground text-xs font-semibold">
            Formações Cadastradas
          </span>
          {educations.length === 0 ? (
            <p className="text-muted-foreground/70 py-2 text-xs italic">
              Nenhuma formação acadêmica cadastrada.
            </p>
          ) : (
            educations.map((item, index) => (
              <div
                key={item.id || index}
                className="border-border/40 bg-card flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="text-xs">
                  <h4 className="text-foreground font-bold">
                    {item.institution} {item.degree ? `(${item.degree})` : ""}
                  </h4>
                  <p className="text-muted-foreground">{item.fieldOfStudy}</p>
                  {(item.startDate || item.completionDate) && (
                    <p className="text-muted-foreground/80 font-mono text-[11px]">
                      {item.startDate ? item.startDate : ""}{" "}
                      {item.completionDate ? `a ${item.completionDate}` : ""}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() =>
                    setDeleteTargetId({
                      id: item.id || "",
                      index,
                    })
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <ConfirmDeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Remover Formação Acadêmica"
        description="Tem certeza que deseja remover esta formação acadêmica? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        isLoading={deleteEducationMutation.isPending}
      />
    </Card>
  );
}
