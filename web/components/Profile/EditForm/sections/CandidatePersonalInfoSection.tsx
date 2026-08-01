"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CandidateProfileFormData } from "@/lib/schemas/forms/candidateProfileSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { User } from "lucide-react";

export function CandidatePersonalInfoSection() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();

  const documentType = useWatch({ control, name: "documentType" }) || "CPF";

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="text-primary size-4" />
          Informações Pessoais & Documento
        </CardTitle>
        <CardDescription>
          Insira seu nome completo e identificação oficial.
        </CardDescription>
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
            <Select
              value={documentType}
              onValueChange={(val) => setValue("documentType", val || "CPF")}
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
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="documentNumber">Número do Documento</Label>
            <Input
              id="documentNumber"
              {...register("documentNumber")}
              placeholder="Ex: 123.456.789-00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone / WhatsApp</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Ex: (11) 98765-4321"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Resumo Profissional / Apresentação</Label>
          <Textarea
            id="summary"
            rows={4}
            {...register("summary")}
            placeholder="Escreva um breve resumo sobre seus objetivos, principais competências e experiência..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
