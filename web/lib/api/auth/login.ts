import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setAuthToken, setUserRole } from "@/lib/api/auth";
import { getCandidateProfile } from "@/lib/api/candidate/getCandidateProfile";
import { httpClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  success: boolean;
  result?: {
    refreshToken?: string;
    accessToken?: string;
  };
}

export async function loginRequest(data: LoginData): Promise<LoginResponse> {
  return httpClient.post<LoginResponse>("/auth/login", data);
}

function isTimeoutOrNetworkError(error?: Error | unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const message =
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
      ? (error as { message: string }).message.toLowerCase()
      : "";
  return (
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("econnaborted")
  );
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      if (!data || data.success === false) {
        toast.error(data?.message ?? "Erro ao fazer login");
        return;
      }

      const token = data.result?.accessToken;

      if (!token) {
        toast.error("Não foi possível autenticar. Tente novamente.");
        return;
      }

      setAuthToken(token);

      try {
        const profile = await getCandidateProfile();
        const role = profile?.candidate?.user?.role;
        const registrationCompleted = Boolean(profile?.candidate?.id);

        if (role === "CANDIDATE" || role === "RECRUITER") {
          setUserRole(role);
        }

        toast.success(data.message || "Login realizado com sucesso!");
        if (!registrationCompleted) {
          router.push("/role");
          return;
        }

        router.push(
          role === "RECRUITER"
            ? "/recruiter/dashboard"
            : "/candidate/dashboard",
        );
      } catch {
        toast.success(data.message || "Login realizado com sucesso!");
        router.push("/role");
      }
    },
    onError: (error: Error) => {
      if (isTimeoutOrNetworkError(error)) {
        const msg =
          "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.";
        toast.error(msg);
        return;
      }
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error(error?.message || "Ocorreu um erro ao realizar o login.");
      }
    },
  });
}
