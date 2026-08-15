"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateLanguageSchema,
  CandidateLanguageFormData,
} from "@/lib/schemas/forms/candidateProfileSchema";
import {
  CandidateProfileResponse,
  ProficiencyLevel,
} from "@/lib/types/candidate";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { Languages, Plus, Trash2, Loader2 } from "lucide-react";
import {
  useAddLanguageMutation,
  useDeleteLanguageMutation,
} from "@/lib/api/candidate/userProfileMutations";
import { useLanguagesQuery } from "@/lib/api/languages/languages";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog/ConfirmDeleteDialog";

import {
  proficiencyLevels,
  getLanguageLabel,
  getProficiencyLabel,
} from "@/lib/utils/languages";

interface CandidateLanguagesProps {
  initialData?: CandidateProfileResponse | null;
}

export function CandidateLanguages({ initialData }: CandidateLanguagesProps) {
  const languages = initialData?.candidate?.languages || [];

  const { data: catalogLanguages = [], isLoading: isLoadingLanguages } =
    useLanguagesQuery();

  const addForm = useForm<CandidateLanguageFormData>({
    resolver: zodResolver(candidateLanguageSchema),
    defaultValues: {
      languageName: "",
      proficiency: "INTERMEDIATE",
    },
  });

  const addLanguageMutation = useAddLanguageMutation();
  const deleteLanguageMutation = useDeleteLanguageMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<{
    languageId?: number;
    index: number;
  } | null>(null);

  const handleAddLanguage = (data: CandidateLanguageFormData) => {
    addLanguageMutation.mutate(
      { languageName: data.languageName.trim(), proficiency: data.proficiency },
      {
        onSuccess: () => {
          addForm.reset({ languageName: "", proficiency: "INTERMEDIATE" });
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;

    if (deleteTargetId.languageId) {
      deleteLanguageMutation.mutate(deleteTargetId.languageId, {
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
          <Languages className="text-primary size-4" />
          Idiomas & Proficiência
        </CardTitle>
        <CardDescription>
          Idiomas que você domina e seus respectivos níveis de conhecimento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addForm.handleSubmit(handleAddLanguage)}>
          <div className="border-border/40 bg-muted/20 space-y-3 rounded-lg border p-4">
            <span className="text-foreground text-xs font-semibold">
              Adicionar Idioma
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs" htmlFor="languageNameSelect">
                  Idioma
                </Label>
                <Controller
                  control={addForm.control}
                  name="languageName"
                  render={({ field }) => (
                    <Select
                      value={field.value ? getLanguageLabel(field.value) : ""}
                      onValueChange={(val) => field.onChange(val)}
                      disabled={isLoadingLanguages}
                    >
                      <SelectTrigger id="languageNameSelect" className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingLanguages
                              ? "Carregando idiomas..."
                              : "Selecione o Idioma"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {catalogLanguages.map((lang) => (
                          <SelectItem key={lang.id} value={lang.name}>
                            {getLanguageLabel(lang.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {addForm.formState.errors.languageName && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.languageName.message}
                  </p>
                )}
              </div>

              {/* Nível de Proficiência via Shadcn UI Select */}
              <div className="space-y-1">
                <Label className="text-xs">Nível de Proficiência</Label>
                <Controller
                  control={addForm.control}
                  name="proficiency"
                  render={({ field }) => (
                    <Select
                      value={
                        field.value ? getProficiencyLabel(field.value) : ""
                      }
                      onValueChange={(val) =>
                        field.onChange(val as ProficiencyLevel)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {proficiencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {addForm.formState.errors.proficiency && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.proficiency.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={addLanguageMutation.isPending || isLoadingLanguages}
              className="gap-1 text-xs"
            >
              {addLanguageMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              Adicionar Idioma
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <span className="text-foreground text-xs font-semibold">
            Idiomas Cadastrados
          </span>
          {languages.length === 0 ? (
            <p className="text-muted-foreground/70 py-2 text-xs italic">
              Nenhum idioma cadastrado.
            </p>
          ) : (
            languages.map((item, index) => (
              <div
                key={item.languageId || index}
                className="border-border/40 bg-card flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="text-xs">
                  <span className="text-foreground font-semibold">
                    {getLanguageLabel(item.languageName)}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {getProficiencyLabel(item.proficiency)}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() =>
                    setDeleteTargetId({
                      languageId: item.languageId,
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
        title="Remover Idioma"
        description="Tem certeza que deseja remover este idioma? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        isLoading={deleteLanguageMutation.isPending}
      />
    </Card>
  );
}
