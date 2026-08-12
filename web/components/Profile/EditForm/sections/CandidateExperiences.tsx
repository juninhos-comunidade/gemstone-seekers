"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  experienceSchema,
  ExperienceFormData,
} from "@/lib/schemas/forms/candidateProfileSchema";
import { CandidateProfileResponse } from "@/lib/types/candidate";
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
import { Briefcase, Plus, Trash2, Loader2 } from "lucide-react";
import {
  useAddExperienceMutation,
  useDeleteExperienceMutation,
} from "@/lib/api/candidate/userProfileMutations";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog/ConfirmDeleteDialog";

interface CandidateExperiencesProps {
  initialData?: CandidateProfileResponse | null;
}

export function CandidateExperiences({
  initialData,
}: CandidateExperiencesProps) {
  const experiences = initialData?.candidate?.experiences || [];

  const addForm = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      companyName: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    },
  });

  const isCurrent = useWatch({
    control: addForm.control,
    name: "isCurrent",
  });

  const addExperienceMutation = useAddExperienceMutation();
  const deleteExperienceMutation = useDeleteExperienceMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const handleAddExperience = (data: ExperienceFormData) => {
    addExperienceMutation.mutate(
      {
        title: data.title.trim(),
        companyName: data.companyName.trim(),
        startDate: data.startDate,
        endDate: data.isCurrent ? undefined : data.endDate || undefined,
        isCurrent: data.isCurrent,
        description: data.description?.trim() || undefined,
      },
      {
        onSuccess: () => {
          addForm.reset({
            title: "",
            companyName: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            description: "",
          });
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;

    if (deleteTargetId.id) {
      deleteExperienceMutation.mutate(deleteTargetId.id, {
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
          <Briefcase className="text-primary size-4" />
          Experiência Profissional
        </CardTitle>
        <CardDescription>
          Histórico profissional, empresas e principais atribuições.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addForm.handleSubmit(handleAddExperience)}>
          <div className="border-border/40 bg-muted/20 space-y-3 rounded-lg border p-4">
            <span className="text-foreground text-xs font-semibold">
              Adicionar Nova Experiência
            </span>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Cargo / Título *</Label>
                <Input
                  {...addForm.register("title")}
                  placeholder="Ex: Desenvolvedor Front-end Senior"
                />
                {addForm.formState.errors.title && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Empresa *</Label>
                <Input
                  {...addForm.register("companyName")}
                  placeholder="Ex: TechLab Studio"
                />
                {addForm.formState.errors.companyName && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.companyName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Data de Início *</Label>
                <Input type="date" {...addForm.register("startDate")} />
                {addForm.formState.errors.startDate && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Data de Término</Label>
                <Input
                  type="date"
                  disabled={isCurrent}
                  {...addForm.register("endDate")}
                />
                {addForm.formState.errors.endDate && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.endDate.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  id="isCurrentExp"
                  {...addForm.register("isCurrent")}
                  className="border-input size-4 rounded"
                />
                <Label
                  htmlFor="isCurrentExp"
                  className="cursor-pointer text-xs"
                >
                  Trabalho atualmente aqui
                </Label>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">
                Descrição das Atividades / Conquistas
              </Label>
              <Textarea
                rows={3}
                {...addForm.register("description")}
                placeholder="Descreva suas principais responsabilidades..."
              />
              {addForm.formState.errors.description && (
                <p className="text-destructive text-xs">
                  {addForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={addExperienceMutation.isPending}
              className="gap-1 text-xs"
            >
              {addExperienceMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              Adicionar Experiência
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <span className="text-foreground text-xs font-semibold">
            Experiências Cadastradas
          </span>
          {experiences.length === 0 ? (
            <p className="text-muted-foreground/70 py-2 text-xs italic">
              Nenhuma experiência cadastrada.
            </p>
          ) : (
            experiences.map((item, index) => (
              <div
                key={item.id || index}
                className="border-border/40 bg-card relative space-y-2 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-foreground text-xs font-bold">
                    {item.title} —{" "}
                    <span className="text-muted-foreground font-normal">
                      {item.companyName}
                    </span>
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-7 w-7"
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
                <p className="text-muted-foreground font-mono text-[11px]">
                  {item.startDate}{" "}
                  {item.isCurrent
                    ? " - Presente"
                    : item.endDate
                      ? ` - ${item.endDate}`
                      : ""}
                </p>
                {item.description && (
                  <p className="text-muted-foreground/90 text-xs">
                    {item.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>

      <ConfirmDeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Remover Experiência"
        description="Tem certeza que deseja remover esta experiência profissional? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        isLoading={deleteExperienceMutation.isPending}
      />
    </Card>
  );
}
