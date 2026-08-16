"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { setUserRole } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type RoleFormData = {
  role: "candidate" | "recruiter";
};

export default function Page() {
  const router = useRouter();

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

  const handleChooseRole = async ({ role }: RoleFormData) => {
    try {
      localStorage.setItem("signup-role", role);
      setUserRole(role === "candidate" ? "CANDIDATE" : "RECRUITER");

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
