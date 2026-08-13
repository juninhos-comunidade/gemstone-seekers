"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAuthToken } from "@/lib/api/auth";
import { httpClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type RoleFormData = {
  role: "candidate" | "recruiter";
};

type ProfileResponse = {
  result?: {
    id?: string;
    role?: "CANDIDATE" | "RECRUITER";
    registrationCompleted?: boolean;
  };
};

export default function Page() {
  const router = useRouter();

  // Inicia sempre como true: o efeito de autenticação determina se
  // o usuário já concluiu o cadastro antes de liberar a tela de seleção.
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Consulta GET /profile para determinar `role` e `registrationCompleted`.
  // A decodificação manual do JWT foi removida porque a API não inclui a
  // claim `role` no payload do token.
  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    httpClient
      .get<ProfileResponse>("/profile")
      .then((res) => {
        const profile = res?.result;
        if (profile?.registrationCompleted) {
          router.replace(
            profile.role === "RECRUITER"
              ? "/recruiter/dashboard"
              : "/candidate/dashboard",
          );
          return;
        }
        setCheckingAuth(false);
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, [router]);

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<RoleFormData>({
    defaultValues: {
      role: "candidate",
    },
  });

  const isLoading = isSubmitting;

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleChooseRole = async ({ role }: RoleFormData) => {
    try {
      localStorage.setItem("signup-role", role);

      router.push(role === "candidate" ? "/role/candidate" : "/role/recruiter");
    } catch {
      toast.error("Erro ao selecionar perfil");
    }
  };

  return (
    <form
      className="flex min-h-screen items-center justify-center gap-10 p-8"
      onSubmit={handleSubmit(handleChooseRole)}
    >
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Recrutador</h2>
        <p className="text-muted-foreground mb-4">Você é um recrutador?</p>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2"
          onClick={() => setValue("role", "recruiter")}
        >
          {isLoading ? (
            <>
              <Spinner className="h-4 w-4" />
              <span>Selecionando...</span>
            </>
          ) : (
            "Selecionar"
          )}
        </Button>
      </div>

      <div className="bg-border h-48 w-px" />

      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Candidato(a)</h2>
        <p className="text-muted-foreground mb-4">Você é um candidato?</p>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2"
          onClick={() => setValue("role", "candidate")}
        >
          {isLoading ? (
            <>
              <Spinner className="h-4 w-4" />
              <span>Selecionando...</span>
            </>
          ) : (
            "Selecionar"
          )}
        </Button>
      </div>
    </form>
  );
}
