"use client";

import React, { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Save, Loader2 } from "lucide-react";
import { useUpdateAddressMutation } from "@/lib/api/candidate/userProfileMutations";
import {
  useCountriesQuery,
  useStatesQuery,
  useStatesByCountryQuery,
  useCitiesByStateQuery,
} from "@/lib/api/location/location";

const EMPTY_ARRAY: never[] = [];

interface CandidateAddressProps {
  initialData?: CandidateProfileResponse | null;
}

// Resolve country/state/city ids and display names from the backend profile.
// Pure function: no side effects, easy to unit test in isolation.
function resolveInitialLocation(
  address: CandidateProfileResponse["address"] | undefined | null,
  allStates: ReturnType<typeof useStatesQuery>["data"],
  countries: ReturnType<typeof useCountriesQuery>["data"],
): AddressFormData | null {
  if (!address) return null;

  const initialCity = address.city;
  const matchedStateId = initialCity?.stateId;
  let matchedStateName = initialCity?.stateName || initialCity?.stateCode || "";
  let matchedCountryId: number | undefined = undefined;
  let matchedCountryName = initialCity?.countryName || "Brazil";

  if (matchedStateId && allStates && allStates.length > 0) {
    const foundState = allStates.find((s) => s.id === matchedStateId);
    if (foundState) {
      matchedStateName = foundState.name;
      matchedCountryId = foundState.countryId;
    }
  }

  if (matchedCountryId && countries && countries.length > 0) {
    const foundCountry = countries.find((c) => c.id === matchedCountryId);
    if (foundCountry) matchedCountryName = foundCountry.name;
  } else if (countries && countries.length > 0) {
    const foundCountry =
      countries.find(
        (c) => c.name.toLowerCase() === matchedCountryName.toLowerCase(),
      ) || countries.find((c) => c.name.toLowerCase().includes("bra"));
    if (foundCountry) {
      matchedCountryId = foundCountry.id;
      matchedCountryName = foundCountry.name;
    }
  }

  return {
    street: address.street || "",
    number: address.number || "",
    neighborhood: address.neighborhood || "",
    complement: address.complement || "",
    zipCode: address.zipCode || "",
    countryId: matchedCountryId,
    stateId: matchedStateId,
    cityId: initialCity?.id,
    countryName: matchedCountryName,
    stateName: matchedStateName,
    cityName: initialCity?.name || "",
  };
}

function matchCity(
  targetCityId: number | undefined,
  targetCityName: string | undefined,
  cities: { id: number; name: string }[],
) {
  if (!targetCityId || cities.length === 0) return undefined;
  return (
    cities.find((c) => c.id === targetCityId) ||
    cities.find(
      (c) => c.name.toLowerCase() === (targetCityName || "").toLowerCase(),
    )
  );
}

export function CandidateAddress({ initialData }: CandidateAddressProps) {
  const { data: countries = EMPTY_ARRAY, isLoading: isLoadingCountries } =
    useCountriesQuery();
  const { data: allStates = EMPTY_ARRAY } = useStatesQuery();

  // Resolved once per (initialData, countries, allStates) change — feeds `values`.
  const resolvedInitialValues = React.useMemo(
    () => resolveInitialLocation(initialData?.address, allStates, countries),
    [initialData, allStates, countries],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      number: "",
      neighborhood: "",
      complement: "",
      zipCode: "",
      countryId: undefined,
      stateId: undefined,
      cityId: undefined,
      countryName: "Brazil",
      stateName: "",
      cityName: "",
    },
    values: resolvedInitialValues ?? undefined,
  });

  const selectedCountryId = useWatch({ control, name: "countryId" });
  const selectedStateId = useWatch({ control, name: "stateId" });

  const { data: states = EMPTY_ARRAY, isLoading: isLoadingStates } =
    useStatesByCountryQuery(
      selectedCountryId ? Number(selectedCountryId) : null,
    );
  const { data: cities = EMPTY_ARRAY, isLoading: isLoadingCities } =
    useCitiesByStateQuery(selectedStateId ? Number(selectedStateId) : null);

  const countryItems = React.useMemo(
    () => countries.map((c) => ({ value: String(c.id), label: c.name })),
    [countries],
  );
  const stateItems = React.useMemo(
    () => states.map((s) => ({ value: String(s.id), label: s.name })),
    [states],
  );
  const cityItems = React.useMemo(
    () => cities.map((c) => ({ value: String(c.id), label: c.name })),
    [cities],
  );

  const updateAddressMutation = useUpdateAddressMutation();

  const matchedCityRef = React.useRef<number | null>(null);
  useEffect(() => {
    const target = resolvedInitialValues;
    if (!target?.cityId || cities.length === 0) return;
    if (matchedCityRef.current === target.cityId) return;

    const matched = matchCity(target.cityId, target.cityName, cities);
    if (matched) {
      matchedCityRef.current = target.cityId;
      setValue("cityId", matched.id);
      setValue("cityName", matched.name);
    }
  }, [cities, resolvedInitialValues, setValue]);

  const handleCountryChange = (val?: number) => {
    const country = countries.find((c) => c.id === val);
    setValue("countryId", val);
    setValue("countryName", country?.name || "");
    setValue("stateId", undefined);
    setValue("stateName", "");
    setValue("cityId", undefined);
    setValue("cityName", "");
  };

  const handleStateChange = (val?: number) => {
    const stateItem = states.find((s) => s.id === val);
    setValue("stateId", val);
    setValue("stateName", stateItem?.name || "");
    setValue("cityId", undefined);
    setValue("cityName", "");
  };

  const handleCityChange = (val?: number) => {
    const cityItem = cities.find((c) => c.id === val);
    setValue("cityId", val);
    setValue("cityName", cityItem?.name || "");
  };

  const onSave = (data: AddressFormData) => {
    const matchedCountry = countries.find(
      (c) => c.id === Number(data.countryId),
    );
    const matchedState = states.find((s) => s.id === Number(data.stateId));
    const matchedCity = cities.find((c) => c.id === Number(data.cityId));

    const countryStr = matchedCountry?.name || data.countryName || "Brazil";
    const stateStr = matchedState?.name || data.stateName || "";
    const cityStr = matchedCity?.name || data.cityName || "";

    updateAddressMutation.mutate({
      street: data.street,
      number: data.number,
      neighborhood: data.neighborhood,
      complement: data.complement,
      zipCode: data.zipCode,
      location: {
        city: cityStr,
        state: stateStr,
        country: countryStr,
      },
    });
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
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
              <Label htmlFor="countrySelect">País</Label>
              <Controller
                control={control}
                name="countryId"
                render={({ field }) => (
                  <Select
                    items={countryItems}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) =>
                      handleCountryChange(val ? Number(val) : undefined)
                    }
                    disabled={isLoadingCountries}
                  >
                    <SelectTrigger id="countrySelect" className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingCountries
                            ? "Carregando..."
                            : "Selecione o País"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="stateSelect">Estado</Label>
              <Controller
                control={control}
                name="stateId"
                render={({ field }) => (
                  <Select
                    items={stateItems}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) =>
                      handleStateChange(val ? Number(val) : undefined)
                    }
                    disabled={
                      !selectedCountryId ||
                      isLoadingStates ||
                      states.length === 0
                    }
                  >
                    <SelectTrigger id="stateSelect" className="w-full">
                      <SelectValue
                        placeholder={
                          !selectedCountryId
                            ? "Selecione o País primeiro"
                            : isLoadingStates
                              ? "Carregando estados..."
                              : states.length === 0
                                ? "Nenhum estado disponível"
                                : "Selecione o Estado"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {selectedCountryId && states.length === 0 && !isLoadingStates && (
                <p className="text-muted-foreground text-xs">
                  Nenhum estado disponível para este país.
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="citySelect">Cidade</Label>
              <Controller
                control={control}
                name="cityId"
                render={({ field }) => (
                  <Select
                    items={cityItems}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) =>
                      handleCityChange(val ? Number(val) : undefined)
                    }
                    disabled={
                      !selectedStateId || isLoadingCities || cities.length === 0
                    }
                  >
                    <SelectTrigger id="citySelect" className="w-full">
                      <SelectValue
                        placeholder={
                          !selectedStateId
                            ? "Selecione o Estado primeiro"
                            : isLoadingCities
                              ? "Carregando cidades..."
                              : cities.length === 0
                                ? "Nenhuma cidade disponível"
                                : "Selecione a Cidade"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {selectedStateId && cities.length === 0 && !isLoadingCities && (
                <p className="text-muted-foreground text-xs">
                  Nenhuma cidade disponível para este estado.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
