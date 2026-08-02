import { useQuery } from "@tanstack/react-query";
import { TechnologyItem } from "@/lib/types/job";
import { MOCK_TECHNOLOGIES_CATALOG } from "@/lib/mocks/jobMock";

export async function getTechnologies(): Promise<TechnologyItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_TECHNOLOGIES_CATALOG;
}

export function useTechnologiesQuery() {
  return useQuery({
    queryKey: ["technologies"],
    queryFn: () => getTechnologies(),
  });
}
