"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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

  const handleChooseRole = async ({ role }: RoleFormData) => {
    try {
      const res = await fetch("/api/user/role", {
        // <- rota real da API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message ?? "Erro ao selecionar perfil");
      }

      router.push(
        role === "candidate"
          ? "/signup/role/candidate"
          : "/signup/role/recruiter",
      );
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
          disabled={isSubmitting}
          onClick={() => setValue("role", "recruiter")}
        >
          {isSubmitting ? "Selecionando..." : "Selecionar"}
        </Button>
      </div>

      <div className="bg-border h-48 w-px" />

      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Candidato(a)</h2>
        <p className="text-muted-foreground mb-4">Você é um candidato?</p>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setValue("role", "candidate")}
        >
          {isSubmitting ? "Selecionando..." : "Selecionar"}
        </Button>
      </div>
    </form>
  );
}
