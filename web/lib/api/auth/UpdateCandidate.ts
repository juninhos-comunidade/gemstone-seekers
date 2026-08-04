import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { httpClient } from "@/lib/api/client";
import type { CandidateRoleFormData } from "@/lib/schemas/candidateRoleSchema";

type UpdateCandidateResponse = {
  success: boolean;
  message?: string;
  result?: unknown;
};

async function updateCandidateRequest(
  data: CandidateRoleFormData,
): Promise<UpdateCandidateResponse> {
  return httpClient.post<UpdateCandidateResponse>("/candidate/profile", data);
}

export function useUpdateCandidate() {
  const router = useRouter();

  return useMutation({
    mutationFn: updateCandidateRequest,
    onSuccess: () => {
      toast.success("Perfil do candidato atualizado com sucesso!");
      router.push("/candidate/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao atualizar perfil do candidato");
    },
  });
}
