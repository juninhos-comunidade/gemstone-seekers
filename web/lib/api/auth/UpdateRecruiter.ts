import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { httpClient } from "@/lib/api/client";
import type { RecruiterRoleFormData } from "@/lib/schemas/recruiterRoleSchema";

type UpdateRecruiterResponse = {
  success: boolean;
  message?: string;
  result?: unknown;
};

async function updateRecruiterRequest(
  data: RecruiterRoleFormData,
): Promise<UpdateRecruiterResponse> {
  return httpClient.post<UpdateRecruiterResponse>("/recruiter/profile", data);
}

export function useUpdateRecruiter() {
  const router = useRouter();

  return useMutation({
    mutationFn: updateRecruiterRequest,
    onSuccess: () => {
      toast.success("Perfil do recrutador atualizado com sucesso!");
      router.push("/recruiter/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao atualizar perfil do recrutador");
    },
  });
}
