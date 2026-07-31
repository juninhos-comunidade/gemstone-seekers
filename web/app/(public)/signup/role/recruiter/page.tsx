"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RecruiterRoleFormData = {
  companyName: string;
  jobTitle: string;
  phone: string;
  companyWebsite: string;
  companySize: string;
};

export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterRoleFormData>({
    defaultValues: {
      companyName: "",
      jobTitle: "",
      phone: "",
      companyWebsite: "",
      companySize: "",
    },
  });

  const onSubmit = async (data: RecruiterRoleFormData) => {
    try {
      localStorage.setItem("recruiter-signup-data", JSON.stringify(data));
      router.push("/recruiter/dashboard");
    } catch {
      toast.error("Erro ao concluir cadastro");
    }
  };

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center">
      <div className="bg-background w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Informações do Recrutador
        </h1>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          Complete seu perfil para finalizar o cadastro
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da empresa</Label>
            <Input
              id="company-name"
              type="text"
              placeholder="Nome da empresa"
              aria-invalid={!!errors.companyName}
              {...register("companyName", {
                required: "Informe o nome da empresa",
              })}
            />
            <span className="text-sm text-red-500">
              {errors.companyName?.message}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-title">Cargo</Label>
            <Input
              id="job-title"
              type="text"
              placeholder="Ex: Analista de RH"
              aria-invalid={!!errors.jobTitle}
              {...register("jobTitle", {
                required: "Informe o cargo",
              })}
            />
            <span className="text-sm text-red-500">
              {errors.jobTitle?.message}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              aria-invalid={!!errors.phone}
              {...register("phone", {
                required: "Informe o telefone",
              })}
            />
            <span className="text-sm text-red-500">
              {errors.phone?.message}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-website">Site da empresa</Label>
            <Input
              id="company-website"
              type="url"
              placeholder="https://suaempresa.com"
              aria-invalid={!!errors.companyWebsite}
              {...register("companyWebsite", {
                required: "Informe o site da empresa",
              })}
            />
            <span className="text-sm text-red-500">
              {errors.companyWebsite?.message}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-size">Tamanho da empresa</Label>
            <Input
              id="company-size"
              type="text"
              placeholder="Ex: 1-10, 11-50, 51-200..."
              aria-invalid={!!errors.companySize}
              {...register("companySize", {
                required: "Informe o tamanho da empresa",
              })}
            />
            <span className="text-sm text-red-500">
              {errors.companySize?.message}
            </span>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Concluindo..." : "Concluir cadastro"}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Prefere fazer isso depois?{" "}
          <Link href="/dashboard" className="text-primary hover:underline">
            Pular por enquanto
          </Link>
        </p>
      </div>
    </main>
  );
}
