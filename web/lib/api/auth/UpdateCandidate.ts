import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { httpClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { CandidateRoleFormData } from "@/lib/schemas/candidateRoleSchema";

type CompleteRegistrationRequest = {
  role: "CANDIDATE";
  documentType?: string;
  documentNumber?: string;
  phone: string;
  summary?: string;
  companyId?: string;
  department?: string;
};

type UpdateCandidateResponse = {
  success: boolean;
  message?: string;
  result?: unknown;
};

async function updateCandidateRequest(
  data: CandidateRoleFormData,
): Promise<UpdateCandidateResponse> {
  const payload: CompleteRegistrationRequest = {
    role: "CANDIDATE",
    phone: data.phone,
    summary: `${data.role} • ${data.area} • ${data.experience} • ${data.location}`,
  };

  return httpClient.patch<UpdateCandidateResponse>(
    "/auth/complete-registration",
    payload,
  );
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
      if (
        error instanceof ApiError &&
        error.status === 409 &&
        error.message.toLowerCase().includes("already completed")
      ) {
        toast.success("Cadastro do candidato já estava concluído.");
        router.push("/candidate/dashboard");
        return;
      }

      toast.error(error.message ?? "Erro ao atualizar perfil do candidato");
    },
  });
}
