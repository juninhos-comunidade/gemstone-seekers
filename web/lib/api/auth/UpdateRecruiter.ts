import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { httpClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { RecruiterRoleFormData } from "@/lib/schemas/recruiterRoleSchema";

type CompleteRegistrationRequest = {
  role: "RECRUITER";
  phone: string;
  companyId?: string;
  department?: string;
};

type UpdateRecruiterResponse = {
  success: boolean;
  message?: string;
  result?: unknown;
};

async function updateRecruiterRequest(
  data: RecruiterRoleFormData,
): Promise<UpdateRecruiterResponse> {
  const payload: CompleteRegistrationRequest = {
    role: "RECRUITER",
    phone: data.phone,
    department: data.jobTitle,
  };

  return httpClient.patch<UpdateRecruiterResponse>(
    "/auth/complete-registration",
    payload,
  );
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
      if (
        error instanceof ApiError &&
        error.status === 409 &&
        error.message.toLowerCase().includes("already completed")
      ) {
        toast.success("Cadastro do recrutador já estava concluído.");
        router.push("/recruiter/dashboard");
        return;
      }

      toast.error(error.message ?? "Erro ao atualizar perfil do recrutador");
    },
  });
}
