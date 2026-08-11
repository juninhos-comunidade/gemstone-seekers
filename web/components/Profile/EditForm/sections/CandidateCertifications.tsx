"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  certificationSchema,
  CertificationFormData,
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
import { Award, Plus, Trash2, Loader2 } from "lucide-react";
import {
  useAddCertificationMutation,
  useDeleteCertificationMutation,
} from "@/lib/api/candidate/userProfileMutations";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog/ConfirmDeleteDialog";

interface CandidateCertificationsProps {
  initialData?: CandidateProfileResponse | null;
}

export function CandidateCertifications({
  initialData,
}: CandidateCertificationsProps) {
  const certifications = initialData?.candidate?.certifications || [];

  const addForm = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialUrl: "",
    },
  });

  const addCertificationMutation = useAddCertificationMutation();
  const deleteCertificationMutation = useDeleteCertificationMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const handleAddCertification = (data: CertificationFormData) => {
    addCertificationMutation.mutate(
      {
        name: data.name.trim(),
        issuingOrganization: data.issuingOrganization.trim(),
        issueDate: data.issueDate || undefined,
        expirationDate: data.expirationDate || undefined,
        credentialUrl: data.credentialUrl?.trim() || undefined,
      },
      {
        onSuccess: () => {
          addForm.reset({
            name: "",
            issuingOrganization: "",
            issueDate: "",
            expirationDate: "",
            credentialUrl: "",
          });
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;

    if (deleteTargetId.id) {
      deleteCertificationMutation.mutate(deleteTargetId.id, {
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
          <Award className="text-primary size-4" />
          Certificações & Licenças
        </CardTitle>
        <CardDescription>
          Certificados técnicos, licenças de tecnologia e badges conquistadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addForm.handleSubmit(handleAddCertification)}>
          <div className="border-border/40 bg-muted/20 space-y-3 rounded-lg border p-4">
            <span className="text-foreground text-xs font-semibold">
              Adicionar Nova Certificação
            </span>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Nome da Certificação *</Label>
                <Input
                  {...addForm.register("name")}
                  placeholder="Ex: AWS Certified Solutions Architect"
                />
                {addForm.formState.errors.name && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Organização Emissora *</Label>
                <Input
                  {...addForm.register("issuingOrganization")}
                  placeholder="Ex: Amazon Web Services, Google"
                />
                {addForm.formState.errors.issuingOrganization && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.issuingOrganization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Data de Emissão</Label>
                <Input type="date" {...addForm.register("issueDate")} />
                {addForm.formState.errors.issueDate && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.issueDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Data de Expiração</Label>
                <Input type="date" {...addForm.register("expirationDate")} />
                {addForm.formState.errors.expirationDate && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.expirationDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL de Credencial</Label>
                <Input
                  {...addForm.register("credentialUrl")}
                  placeholder="Ex: https://credly.com/org/..."
                />
                {addForm.formState.errors.credentialUrl && (
                  <p className="text-destructive text-xs">
                    {addForm.formState.errors.credentialUrl.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={addCertificationMutation.isPending}
              className="gap-1 text-xs"
            >
              {addCertificationMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              Adicionar Certificação
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <span className="text-foreground text-xs font-semibold">
            Certificações Cadastradas
          </span>
          {certifications.length === 0 ? (
            <p className="text-muted-foreground/70 py-2 text-xs italic">
              Nenhuma certificação cadastrada.
            </p>
          ) : (
            certifications.map((item, index) => (
              <div
                key={item.id || index}
                className="border-border/40 bg-card flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="text-xs">
                  <h4 className="text-foreground font-bold">{item.name}</h4>
                  <p className="text-muted-foreground">
                    Emissor: {item.issuingOrganization}
                  </p>
                  {item.issueDate && (
                    <p className="text-muted-foreground/80 font-mono text-[11px]">
                      Emitido em {item.issueDate}
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
        title="Remover Certificação"
        description="Tem certeza que deseja remover esta certificação? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        isLoading={deleteCertificationMutation.isPending}
      />
    </Card>
  );
}
