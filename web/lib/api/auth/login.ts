import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setAuthToken } from "@/lib/api/auth";
import { httpClient } from "@/lib/api/client";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  result?: {
    token?: string;
    accessToken?: string;
    role?: "CANDIDATE" | "RECRUITER";
    registrationCompleted?: boolean;
  };
}

async function loginRequest(data: LoginData): Promise<LoginResponse> {
  return httpClient.post<LoginResponse>("/auth/login", data);
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (result) => {
      const token =
        result?.result?.token ??
        result?.token ??
        result?.accessToken ??
        result?.result?.accessToken;

      if (token) {
        setAuthToken(token);
      }

      const role = result?.result?.role;
      const registrationCompleted = result?.result?.registrationCompleted;

      toast.success("Login realizado com sucesso!");

      if (!registrationCompleted) {
        router.push(
          role === "RECRUITER"
            ? "/signup/role/recruiter"
            : "/signup/role/candidate",
        );
        return;
      }

      router.push(
        role === "RECRUITER" ? "/recruiter/dashboard" : "/candidate/dashboard",
      );
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao fazer login");
    },
  });
}
