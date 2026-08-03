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

      toast.success("Login realizado com sucesso!");
      router.push("/candidate/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao fazer login");
    },
  });
}
