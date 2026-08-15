"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userSchema,
  UserFormData,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Save, Loader2 } from "lucide-react";
import { useUpdateUserMutation } from "@/lib/api/candidate/userProfileMutations";

interface CandidatePersonalInfoProps {
  initialData?: CandidateProfileResponse | null;
}

export function CandidatePersonalInfo({
  initialData,
}: CandidatePersonalInfoProps) {
  const candidate = initialData?.candidate;
  const user = candidate?.user;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      phone: candidate?.phone || "",
      documentType: user?.documentType || "CPF",
      documentNumber: user?.documentNumber || "",
      summary: candidate?.summary || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: user?.name || "",
        phone: candidate?.phone || "",
        documentType: user?.documentType || "CPF",
        documentNumber: user?.documentNumber || "",
        summary: candidate?.summary || "",
      });
    }
  }, [initialData, user, candidate, reset]);

  const updateUserMutation = useUpdateUserMutation();

  const onSave = (data: UserFormData) => {
    updateUserMutation.mutate(
      {
        name: data.name,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        phone: data.phone,
        summary: data.summary,
      },
      {
        onSuccess: (updatedProfile) => {
          if (updatedProfile) {
            const updatedUser = updatedProfile.candidate?.user;
            const updatedCand = updatedProfile.candidate;
            reset({
              name: updatedUser?.name || data.name,
              phone: updatedCand?.phone || data.phone,
              documentType: updatedUser?.documentType || data.documentType,
              documentNumber:
                updatedUser?.documentNumber || data.documentNumber,
              summary: updatedCand?.summary || data.summary,
            });
          }
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="text-primary size-4" />
              Informações Pessoais & Documento
            </CardTitle>
            <CardDescription>
              Insira seu nome completo e identificação oficial.
            </CardDescription>
          </div>
          <Button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="gap-2 shadow-sm"
            size="sm"
          >
            {updateUserMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Salvar Dados Pessoais
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: Thiago Silva"
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Controller
                control={control}
                name="documentType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val || "CPF")}
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPF">CPF</SelectItem>
                      <SelectItem value="CNPJ">CNPJ</SelectItem>
                      <SelectItem value="PASSAPORTE">Passaporte</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.documentType && (
                <p className="text-destructive text-xs">
                  {errors.documentType.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="documentNumber">Número do Documento</Label>
              <Input
                id="documentNumber"
                {...register("documentNumber")}
                placeholder="Ex: 123.456.789-00"
              />
              {errors.documentNumber && (
                <p className="text-destructive text-xs">
                  {errors.documentNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone / WhatsApp</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Ex: (11) 98765-4321"
            />
            {errors.phone && (
              <p className="text-destructive text-xs">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Resumo Profissional / Apresentação</Label>
            <Textarea
              id="summary"
              rows={4}
              {...register("summary")}
              placeholder="Escreva um breve resumo sobre seus objetivos, principais competências e experiência..."
            />
            {errors.summary && (
              <p className="text-destructive text-xs">
                {errors.summary.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
