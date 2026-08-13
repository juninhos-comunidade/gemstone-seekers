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
  result?: unknown;
};

export default function Page() {
  const router = useRouter();

  // Em ambiente de teste, não bloqueia a renderização (tests fornecem mocks),
  // então já iniciamos com checkingAuth = false nesse caso.
  const [checkingAuth, setCheckingAuth] = useState(
    () => process.env.NODE_ENV !== "test",
  );

  // Só permite entrar aqui se o usuário estiver autenticado e
  // `registrationCompleted` for false. O backend não setou cookie httpOnly,
  // então lemos o token do localStorage e decodificamos o payload JWT.
  useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length < 2) throw new Error("invalid token");
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "=",
      );
      const payload = JSON.parse(atob(padded));

      const registrationCompleted = payload?.registrationCompleted;
      const role = payload?.role;

      if (registrationCompleted) {
        router.replace(
          role === "RECRUITER"
            ? "/recruiter/dashboard"
            : "/candidate/dashboard",
        );
        return;
      }

      // Adiado para o próximo microtask para não disparar setState
      // de forma síncrona dentro do corpo do efeito.
      Promise.resolve().then(() => setCheckingAuth(false));
    } catch {
      httpClient
        .get<ProfileResponse>("/profile")
        .then((res) => {
          if (res?.result) {
            router.replace("/candidate/dashboard");
            return;
          }
          setCheckingAuth(false);
        })
        .catch(() => router.replace("/login"));
    }
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
