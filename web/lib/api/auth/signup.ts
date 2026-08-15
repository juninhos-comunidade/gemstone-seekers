import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setAuthToken } from "@/lib/api/auth";
import { httpClient } from "@/lib/api/client";
import { loginRequest } from "./login";

export type SignupData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type RegisterResponse = {
  id: string;
  name: string;
  email: string;
};

export type SignupResponse = {
  success: boolean;
  message?: string;
  result?: RegisterResponse;
  token?: string;
};

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

export async function signupRequest(data: SignupData): Promise<SignupResponse> {
  const payload = {
    name: data.fullName,
    email: data.email,
    password: data.password,
  };

  const res = await httpClient.post<SignupResponse>("/auth/register", payload);

  if (!res || !res.success) {
    return res;
  }

  try {
    const loginRes = await loginRequest({
      email: data.email,
      password: data.password,
    });

    if (loginRes?.success && loginRes.result?.accessToken) {
      return {
        ...res,
        token: loginRes.result.accessToken,
      };
    }
  } catch {}

  return res;
}

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: signupRequest,
    onSuccess: (result) => {
      if (result && "success" in result && result.success === false) {
        toast.error(result.message ?? "Falha ao cadastrar");
        return;
      }

      const token = result?.token;

      if (token) {
        setAuthToken(token);
        toast.success("Conta criada com sucesso!");
        router.push("/role");
      } else {
        toast.error(
          "Conta criada, mas não foi possível autenticar automaticamente. Faça login.",
        );
        router.push("/login");
      }
    },
    onError: (error: Error) => {
      if (isTimeoutOrNetworkError(error)) {
        const msg =
          "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.";
        toast.error(msg);
        return;
      }

      const msg = error?.message || "Falha ao cadastrar";
      toast.error(msg);
    },
  });
}
