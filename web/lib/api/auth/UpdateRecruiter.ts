import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { httpClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { RecruiterRoleFormData } from "@/lib/schemas/recruiterRoleSchema";

type CompleteRegistrationRequest = {
  role: "RECRUITER";
  documentType?: string;
  documentNumber?: string;
  phone: string;
  department?: string;
  companyId?: string;
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
    documentType: data.documentType,
    documentNumber: data.documentNumber,
    phone: data.phone,
    department: data.jobTitle,
    companyId: data.companyId,
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
      if (error instanceof ApiError && error.status === 409) {
        const msg = (error.message ?? "").toLowerCase();
        if (
          msg.includes("already completed") ||
          msg.includes("concluído") ||
          msg.includes("integrity") ||
          msg.includes("integridade") ||
          msg.includes("exists")
        ) {
          toast.success(
            "Cadastro do recrutador já estava concluído ou dados já cadastrados.",
          );
          router.push("/recruiter/dashboard");
          return;
        }
        toast.info("Cadastro já realizado. Redirecionando para o painel...");
        router.push("/recruiter/dashboard");
        return;
      }

      toast.error(error.message ?? "Erro ao atualizar perfil do recrutador");
    },
  });
}
