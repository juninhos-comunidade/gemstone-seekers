"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CandidateProfileFormData } from "@/lib/schemas/forms/candidateProfileSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function CandidateAddressSection() {
  const { register } = useFormContext<CandidateProfileFormData>();

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="text-primary size-4" />
          Endereço Residencial
        </CardTitle>
        <CardDescription>
          Dados de localização para oportunidades locais ou híbridas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="street">Logradouro / Rua</Label>
            <Input
              id="street"
              {...register("address.street")}
              placeholder="Ex: Avenida Paulista"
            />
          </div>

          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              {...register("address.number")}
              placeholder="Ex: 1000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              {...register("address.neighborhood")}
              placeholder="Ex: Bela Vista"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complement">Complemento (opcional)</Label>
            <Input
              id="complement"
              {...register("address.complement")}
              placeholder="Ex: Apto 1204 / Bloco B"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              {...register("address.zipCode")}
              placeholder="Ex: 01310-100"
            />
          </div>

          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="cityName">Cidade</Label>
            <Input
              id="cityName"
              {...register("address.cityName")}
              placeholder="Ex: São Paulo"
            />
          </div>

          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="stateCode">UF / Estado</Label>
            <Input
              id="stateCode"
              maxLength={2}
              {...register("address.stateCode")}
              placeholder="Ex: SP"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
