"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateLinkSchema,
  CandidateLinkFormData,
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
import { Link2, Plus, Trash2, Loader2 } from "lucide-react";
import {
  useAddLinkMutation,
  useDeleteLinkMutation,
} from "@/lib/api/candidate/userProfileMutations";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog/ConfirmDeleteDialog";

interface CandidateLinksProps {
  initialData?: CandidateProfileResponse | null;
}

export function CandidateLinks({ initialData }: CandidateLinksProps) {
  const links = initialData?.candidate?.links || [];

  const addForm = useForm<CandidateLinkFormData>({
    resolver: zodResolver(candidateLinkSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const addLinkMutation = useAddLinkMutation();
  const deleteLinkMutation = useDeleteLinkMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const handleAddLink = (data: CandidateLinkFormData) => {
    addLinkMutation.mutate(
      { name: data.name.trim(), url: data.url.trim() },
      {
        onSuccess: () => {
          addForm.reset({ name: "", url: "" });
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;

    if (deleteTargetId.id) {
      deleteLinkMutation.mutate(deleteTargetId.id, {
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
          <Link2 className="text-primary size-4" />
          Links & Redes Sociais
        </CardTitle>
        <CardDescription>
          Portfólio, GitHub, LinkedIn e outros links relevantes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addForm.handleSubmit(handleAddLink)}>
          <div className="border-border/40 bg-muted/20 space-y-3 rounded-lg border p-4">
            <span className="text-foreground text-xs font-semibold">
              Adicionar Novo Link
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Nome do Link / Plataforma</Label>
                <Input
                  {...addForm.register("name")}
                  placeholder="Ex: GitHub, LinkedIn"
                />
                {addForm.formState.errors.name && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL / Endereço Web</Label>
                <Input
                  {...addForm.register("url")}
                  placeholder="Ex: https://github.com/usuario"
                />
                {addForm.formState.errors.url && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.url.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={addLinkMutation.isPending}
              className="gap-1 text-xs"
            >
              {addLinkMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              Adicionar Link
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <span className="text-foreground text-xs font-semibold">
            Links Cadastrados
          </span>
          {links.length === 0 ? (
            <p className="text-muted-foreground/70 py-2 text-xs italic">
              Nenhum link cadastrado.
            </p>
          ) : (
            links.map((item, index) => (
              <div
                key={item.id || index}
                className="border-border/40 bg-card flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="truncate text-xs">
                  <span className="text-foreground font-semibold">
                    {item.name}:{" "}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {item.url}
                  </a>
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
        title="Remover Link"
        description="Tem certeza que deseja remover este link? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        isLoading={deleteLinkMutation.isPending}
      />
    </Card>
  );
}
