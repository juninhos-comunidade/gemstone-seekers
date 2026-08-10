"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  AddressFormData,
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
import { MapPin, Save, Loader2 } from "lucide-react";
import { useUpdateAddressMutation } from "@/lib/api/candidate/userProfileMutations";

interface CandidateAddressProps {
  initialData?: CandidateProfileResponse | null;
}

export function CandidateAddress({ initialData }: CandidateAddressProps) {
  const address = initialData?.address;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: address?.street || "",
      number: address?.number || "",
      neighborhood: address?.neighborhood || "",
      complement: address?.complement || "",
      zipCode: address?.zipCode || "",
      cityName: address?.city?.name || "",
      stateCode: "SP",
    },
  });

  useEffect(() => {
    if (initialData) {
      const addr = initialData.address;
      reset({
        street: addr?.street || "",
        number: addr?.number || "",
        neighborhood: addr?.neighborhood || "",
        complement: addr?.complement || "",
        zipCode: addr?.zipCode || "",
        cityName: addr?.city?.name || "",
        stateCode: "SP",
      });
    }
  }, [initialData, reset]);

  const updateAddressMutation = useUpdateAddressMutation();

  const onSave = (data: AddressFormData) => {
    updateAddressMutation.mutate(
      {
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        complement: data.complement,
        zipCode: data.zipCode,
        location: {
          city: data.cityName,
          state: data.stateCode,
          country: "Brasil",
        },
      },
      {
        onSuccess: (updatedProfile) => {
          if (updatedProfile) {
            const addr = updatedProfile.address;
            reset({
              street: addr?.street || data.street,
              number: addr?.number || data.number,
              neighborhood: addr?.neighborhood || data.neighborhood,
              complement: addr?.complement || data.complement,
              zipCode: addr?.zipCode || data.zipCode,
              cityName: addr?.city?.name || data.cityName,
              stateCode: data.stateCode || "SP",
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
              <MapPin className="text-primary size-4" />
              Endereço Residencial
            </CardTitle>
            <CardDescription>
              Dados de localização para oportunidades locais ou híbridas.
            </CardDescription>
          </div>
          <Button
            type="submit"
            disabled={updateAddressMutation.isPending}
            className="gap-2 shadow-sm"
            size="sm"
          >
            {updateAddressMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Salvar Endereço
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="street">Logradouro / Rua</Label>
              <Input
                id="street"
                {...register("street")}
                placeholder="Ex: Avenida Paulista"
              />
              {errors.street && (
                <p className="text-destructive text-xs">
                  {errors.street.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                {...register("number")}
                placeholder="Ex: 1000"
              />
              {errors.number && (
                <p className="text-destructive text-xs">
                  {errors.number.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                {...register("neighborhood")}
                placeholder="Ex: Bela Vista"
              />
              {errors.neighborhood && (
                <p className="text-destructive text-xs">
                  {errors.neighborhood.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="complement">Complemento (opcional)</Label>
              <Input
                id="complement"
                {...register("complement")}
                placeholder="Ex: Apto 1204 / Bloco B"
              />
              {errors.complement && (
                <p className="text-destructive text-xs">
                  {errors.complement.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                {...register("zipCode")}
                placeholder="Ex: 01310-100"
              />
              {errors.zipCode && (
                <p className="text-destructive text-xs">
                  {errors.zipCode.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="cityName">Cidade</Label>
              <Input
                id="cityName"
                {...register("cityName")}
                placeholder="Ex: São Paulo"
              />
              {errors.cityName && (
                <p className="text-destructive text-xs">
                  {errors.cityName.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="stateCode">UF / Estado</Label>
              <Input
                id="stateCode"
                maxLength={2}
                {...register("stateCode")}
                placeholder="Ex: SP"
              />
              {errors.stateCode && (
                <p className="text-destructive text-xs">
                  {errors.stateCode.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
