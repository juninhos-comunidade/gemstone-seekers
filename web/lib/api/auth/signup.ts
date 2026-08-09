import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

async function signupRequest(data: SignupData): Promise<SignupResponse> {
  const payload = {
    name: data.fullName,
    email: data.email,
    password: data.password,
  };

  return httpClient.post<SignupResponse>("/auth/register", payload);
}

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: signupRequest,
    onSuccess: (result) => {
      const token =
        result?.result?.token ??
        result?.token ??
        result?.accessToken ??
        result?.result?.accessToken;

      if (token) {
        setAuthToken(token);
      }

      toast.success("Conta criada com sucesso!");
      router.push("/signup/role");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Falha ao cadastrar");
    },
  });
}
