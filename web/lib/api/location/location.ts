import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";
import {
  CountryResponse,
  StateResponse,
  CityResponse,
} from "@/lib/types/location";

const CATALOG_STALE_TIME = 1000 * 60 * 60; // 1 hour

export async function getCountries(): Promise<CountryResponse[]> {
  const response =
    await httpClient.get<ApiResponse<CountryResponse[]>>("/countries");
  return response.result ?? [];
}

export async function getStatesByCountry(
  countryId: number,
): Promise<StateResponse[]> {
  const response = await httpClient.get<ApiResponse<StateResponse[]>>(
    `/countries/${countryId}/states`,
  );
  return response.result ?? [];
}

export async function getStates(): Promise<StateResponse[]> {
  const response =
    await httpClient.get<ApiResponse<StateResponse[]>>("/states");
  return response.result ?? [];
}

export async function getCitiesByState(
  stateId: number,
): Promise<CityResponse[]> {
  const response = await httpClient.get<ApiResponse<CityResponse[]>>(
    `/states/${stateId}/cities`,
  );
  return response.result ?? [];
}

export async function getCities(): Promise<CityResponse[]> {
  const response = await httpClient.get<ApiResponse<CityResponse[]>>("/cities");
  return response.result ?? [];
}

export function useCountriesQuery() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
    staleTime: CATALOG_STALE_TIME,
  });
}

export function useStatesQuery() {
  return useQuery({
    queryKey: ["all-states"],
    queryFn: () => getStates(),
    staleTime: CATALOG_STALE_TIME,
  });
}

export function useStatesByCountryQuery(countryId?: number | null) {
  return useQuery({
    queryKey: ["states", countryId],
    queryFn: () => getStatesByCountry(countryId!),
    enabled: typeof countryId === "number" && countryId > 0,
    staleTime: CATALOG_STALE_TIME,
  });
}

export function useCitiesByStateQuery(stateId?: number | null) {
  return useQuery({
    queryKey: ["cities", stateId],
    queryFn: () => getCitiesByState(stateId!),
    enabled: typeof stateId === "number" && stateId > 0,
    staleTime: CATALOG_STALE_TIME,
  });
}

export function useCitiesQuery() {
  return useQuery({
    queryKey: ["all-cities"],
    queryFn: () => getCities(),
    staleTime: CATALOG_STALE_TIME,
  });
}
