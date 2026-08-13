import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setAuthToken } from "@/lib/api/auth";
import { httpClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  result: {
    refreshToken: string;
    accessToken: string;
    role: "CANDIDATE" | "RECRUITER";
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
    onSuccess: (data) => {
      setAuthToken(data.result.accessToken);

      const role = data.result.role;
      const registrationCompleted = data.result.registrationCompleted;

      toast.success(data.message ?? "Login realizado com sucesso!");
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
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro ao realizar o login.");
      }
    },
  });
}
