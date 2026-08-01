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
import { Award, Plus, Trash2 } from "lucide-react";

export function CandidateCertificationsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="text-primary size-4" />
            Certificações & Licenças
          </CardTitle>
          <CardDescription>
            Certificados técnicos, licenças de tecnologia e badges conquistadas.
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
              issuingOrganization: "",
              issueDate: "",
              expirationDate: "",
              credentialUrl: "",
            })
          }
        >
          <Plus className="size-3.5" />
          Adicionar Certificação
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-muted-foreground/70 py-2 text-xs italic">
            Nenhuma certificação adicionada. Clique acima para incluir suas
            certificações.
          </p>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="border-border/40 bg-muted/20 space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-mono text-xs font-semibold">
                  Certificação #{index + 1}
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
                    htmlFor={`certifications.${index}.name`}
                    className="text-xs"
                  >
                    Nome da Certificação *
                  </Label>
                  <Input
                    id={`certifications.${index}.name`}
                    {...register(`certifications.${index}.name`)}
                    placeholder="Ex: AWS Certified Solutions Architect"
                  />
                  {errors.certifications?.[index]?.name && (
                    <p className="text-destructive text-[11px]">
                      {errors.certifications[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor={`certifications.${index}.issuingOrganization`}
                    className="text-xs"
                  >
                    Organização Emissora *
                  </Label>
                  <Input
                    id={`certifications.${index}.issuingOrganization`}
                    {...register(`certifications.${index}.issuingOrganization`)}
                    placeholder="Ex: Amazon Web Services, Google, Rocketseat"
                  />
                  {errors.certifications?.[index]?.issuingOrganization && (
                    <p className="text-destructive text-[11px]">
                      {
                        errors.certifications[index]?.issuingOrganization
                          ?.message
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label
                    htmlFor={`certifications.${index}.issueDate`}
                    className="text-xs"
                  >
                    Data de Emissão
                  </Label>
                  <Input
                    id={`certifications.${index}.issueDate`}
                    type="date"
                    {...register(`certifications.${index}.issueDate`)}
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor={`certifications.${index}.expirationDate`}
                    className="text-xs"
                  >
                    Data de Expiração (se houver)
                  </Label>
                  <Input
                    id={`certifications.${index}.expirationDate`}
                    type="date"
                    {...register(`certifications.${index}.expirationDate`)}
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor={`certifications.${index}.credentialUrl`}
                    className="text-xs"
                  >
                    URL de Validação / Credencial
                  </Label>
                  <Input
                    id={`certifications.${index}.credentialUrl`}
                    {...register(`certifications.${index}.credentialUrl`)}
                    placeholder="Ex: https://credly.com/org/..."
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
