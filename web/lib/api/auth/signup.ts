import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import { setAuthToken } from "@/lib/api/auth";
import { httpClient } from "@/lib/api/client";

type SignupData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupResponse = {
  success: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  result?: {
    token?: string;
    accessToken?: string;
    id?: string;
    name?: string;
    email?: string;
  };
};

// Alguns formatos alternativos que a API pode retornar para o token,
// mantidos separados de SignupResponse para não poluir o tipo "oficial".
type SignupResponseExtended = SignupResponse & {
  data?: {
    token?: string;
    accessToken?: string;
  };
  jwt?: string;
};

// Se você já exporta essa função de um arquivo de utilitários,
// pode apenas importá-la em vez de declarar novamente aqui.
function isTimeoutOrNetworkError(error: unknown): boolean {
  const message = (error as Error)?.message?.toLowerCase() ?? "";
  return (
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("econnaborted")
  );
}

interface UseSignupOptions {
  onErrorMessage?: Dispatch<SetStateAction<string | null>>;
}

async function signupRequest(data: SignupData): Promise<SignupResponse> {
  const payload = {
    name: data.fullName,
    email: data.email,
    password: data.password,
  };

  const res = await httpClient.post<SignupResponseExtended>(
    "/auth/register",
    payload,
  );

  const token =
    res?.result?.token ??
    res?.token ??
    res?.accessToken ??
    res?.result?.accessToken ??
    res?.data?.token ??
    res?.data?.accessToken ??
    res?.jwt;

  if (!token && res?.success !== false) {
    try {
      const loginRes = await httpClient.post<SignupResponseExtended>(
        "/auth/login",
        {
          email: data.email,
          password: data.password,
        },
      );

      const loginToken =
        loginRes?.result?.token ??
        loginRes?.token ??
        loginRes?.accessToken ??
        loginRes?.result?.accessToken ??
        loginRes?.data?.token ??
        loginRes?.data?.accessToken ??
        loginRes?.jwt;

      if (loginToken) {
        return {
          ...res,
          token: loginToken,
        };
      }
    } catch {
      // Se o auto-login falhar, mantém a resposta original
    }
  }

  return res;
}

export function useSignup(_options?: UseSignupOptions) {
  const { onErrorMessage } = _options ?? {};
  const router = useRouter();

  return useMutation({
    mutationFn: signupRequest,
    retry: (failureCount, error) => {
      // Tenta de novo automaticamente se for timeout/rede (cold start do Render).
      // Permitindo até 2 tentativas extras para dar mais tempo ao servidor.
      if (isTimeoutOrNetworkError(error) && failureCount < 2) {
        return true;
      }
      return false;
    },
    // Tempo maior entre as tentativas (3 segundos)
    retryDelay: 3000,
    onSuccess: (result) => {
      if (result && "success" in result && result.success === false) {
        toast.error(result.message ?? "Falha ao cadastrar");
        return;
      }

      const token =
        result?.result?.token ??
        result?.token ??
        result?.accessToken ??
        result?.result?.accessToken;

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
        onErrorMessage?.(msg);
        toast.error(msg);
        return;
      }

      const msg = error.message ?? "Falha ao cadastrar";
      onErrorMessage?.(msg);
      toast.error(msg);
    },
  });
}
