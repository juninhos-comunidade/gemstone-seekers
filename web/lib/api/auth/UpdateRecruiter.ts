import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setUserRole } from "@/lib/api/auth";
import { httpClient } from "@/lib/api/client";
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
      setUserRole("RECRUITER");
      toast.success("Perfil do recrutador atualizado com sucesso!");
      router.push("/recruiter/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao atualizar perfil do recrutador");
    },
  });
}
