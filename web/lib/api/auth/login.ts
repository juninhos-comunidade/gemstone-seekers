import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
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

function isTimeoutOrNetworkError(error: unknown): boolean {
  const message = (error as Error)?.message?.toLowerCase() ?? "";
  return (
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("econnaborted")
  );
}

interface UseLoginOptions {
  onErrorMessage?: Dispatch<SetStateAction<string | null>>;
}

export function useLogin(_options?: UseLoginOptions) {
  const { onErrorMessage } = _options ?? {};
  const router = useRouter();

  return useMutation({
    mutationFn: loginRequest,
    retry: (failureCount, error) => {
      if (isTimeoutOrNetworkError(error) && failureCount < 2) {
        return true;
      }
      return false;
    },
    retryDelay: 2000,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message ?? "Erro ao fazer login");
        return;
      }

      const token =
        result?.result?.token ??
        result?.token ??
        result?.accessToken ??
        result?.result?.accessToken;

      if (!token) {
        toast.error("Não foi possível autenticar. Tente novamente.");
        return;
      }

      setAuthToken(token);

      const role = result?.result?.role;
      const registrationCompleted = result?.result?.registrationCompleted;
      toast.success("Login realizado com sucesso!");

      if (!registrationCompleted) {
        router.push(
          role === "RECRUITER" ? "/role/recruiter" : "/role/candidate",
        );
        return;
      }
      router.push(
        role === "RECRUITER" ? "/recruiter/dashboard" : "/candidate/dashboard",
      );
    },
    onError: (error: Error) => {
      if (isTimeoutOrNetworkError(error)) {
        const msg =
          "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.";
        onErrorMessage?.(msg);
        toast.error(msg);
        return;
      }
      const msg = error.message ?? "Erro ao fazer login";
      onErrorMessage?.(msg);
      toast.error(msg);
    },
  });
}
