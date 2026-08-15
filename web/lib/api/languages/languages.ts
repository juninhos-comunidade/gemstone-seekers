import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";
import { LanguageResponse } from "@/lib/types/language";

const CATALOG_STALE_TIME = 1000 * 60 * 60; // 1 hour

export async function getLanguages(): Promise<LanguageResponse[]> {
  const response =
    await httpClient.get<ApiResponse<LanguageResponse[]>>("/languages");
  return response.result ?? [];
}

export function useLanguagesQuery() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: () => getLanguages(),
    staleTime: CATALOG_STALE_TIME,
  });
}
