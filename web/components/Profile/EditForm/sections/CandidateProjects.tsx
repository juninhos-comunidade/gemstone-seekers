"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectSchema,
  ProjectFormData,
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
import { FolderGit2, Plus, Trash2, Loader2 } from "lucide-react";
import {
  useAddProjectMutation,
  useDeleteProjectMutation,
} from "@/lib/api/candidate/userProfileMutations";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog/ConfirmDeleteDialog";

interface CandidateProjectsProps {
  initialData?: CandidateProfileResponse | null;
}

export function CandidateProjects({ initialData }: CandidateProjectsProps) {
  const projects = initialData?.candidate?.projects || [];

  const addForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      projectUrl: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const addProjectMutation = useAddProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const handleAddProject = (data: ProjectFormData) => {
    addProjectMutation.mutate(
      {
        name: data.name.trim(),
        projectUrl: data.projectUrl?.trim() || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        description: data.description?.trim() || undefined,
      },
      {
        onSuccess: () => {
          addForm.reset({
            name: "",
            projectUrl: "",
            startDate: "",
            endDate: "",
            description: "",
          });
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;

    if (deleteTargetId.id) {
      deleteProjectMutation.mutate(deleteTargetId.id, {
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
          <FolderGit2 className="text-primary size-4" />
          Projetos Relevantes & Portfólio
        </CardTitle>
        <CardDescription>
          Projetos pessoais, de código aberto ou cases desenvolvidos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addForm.handleSubmit(handleAddProject)}>
          <div className="border-border/40 bg-muted/20 space-y-3 rounded-lg border p-4">
            <span className="text-foreground text-xs font-semibold">
              Adicionar Novo Projeto
            </span>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Nome do Projeto *</Label>
                <Input
                  {...addForm.register("name")}
                  placeholder="Ex: Gemstone Seekers Platform"
                />
                {addForm.formState.errors.name && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL do Projeto / Repositório</Label>
                <Input
                  {...addForm.register("projectUrl")}
                  placeholder="Ex: https://github.com/usuario/projeto"
                />
                {addForm.formState.errors.projectUrl && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.projectUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Data de Início</Label>
                <Input type="date" {...addForm.register("startDate")} />
                {addForm.formState.errors.startDate && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Data de Término</Label>
                <Input type="date" {...addForm.register("endDate")} />
                {addForm.formState.errors.endDate && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Descrição do Projeto</Label>
              <Textarea
                rows={3}
                {...addForm.register("description")}
                placeholder="Descreva o propósito do projeto e principais conquistas..."
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
              disabled={addProjectMutation.isPending}
              className="gap-1 text-xs"
            >
              {addProjectMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              Adicionar Projeto
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <span className="text-foreground text-xs font-semibold">
            Projetos Cadastrados
          </span>
          {projects.length === 0 ? (
            <p className="text-muted-foreground/70 py-2 text-xs italic">
              Nenhum projeto cadastrado.
            </p>
          ) : (
            projects.map((item, index) => (
              <div
                key={item.id || index}
                className="border-border/40 bg-card flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="text-xs">
                  <h4 className="text-foreground font-bold">{item.name}</h4>
                  {item.projectUrl && (
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {item.projectUrl}
                    </a>
                  )}
                  {item.description && (
                    <p className="text-muted-foreground mt-1 text-[11px]">
                      {item.description}
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
        title="Remover Projeto"
        description="Tem certeza que deseja remover este projeto? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        isLoading={deleteProjectMutation.isPending}
      />
    </Card>
  );
}
