"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CandidateRoleFormData = {
  phone: string;
  area: string;
  role: string;
  experience: string;
  location: string;
  resume: string;
};

export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateRoleFormData>({
    defaultValues: {
      phone: "",
      area: "",
      role: "",
      experience: "",
      location: "",
      resume: "",
    },
  });

  const onSubmit = async (data: CandidateRoleFormData) => {
    try {
      const res = await fetch("/api/candidate/profile", {
        // <- rota real da API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message ?? "Erro ao concluir cadastro");
      }

      router.push("/candidate/dashboard");
    } catch {
      toast.error("Erro ao concluir cadastro");
    }
  };

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center">
      <div className="bg-background w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Informações do Candidato
        </h1>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          Complete seu perfil para finalizar o cadastro
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            <Label htmlFor="area">Área de interesse</Label>
            <Input
              id="area"
              type="text"
              placeholder="Ex: Tecnologia, Marketing, Vendas..."
              aria-invalid={!!errors.area}
              {...register("area", {
                required: "Informe a área de interesse",
              })}
            />
            <span className="text-sm text-red-500">{errors.area?.message}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo desejado</Label>
            <Input
              id="role"
              type="text"
              placeholder="Ex: Desenvolvedor Front-end"
              aria-invalid={!!errors.role}
              {...register("role", {
                required: "Informe o cargo desejado",
              })}
            />
            <span className="text-sm text-red-500">{errors.role?.message}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Nível de experiência</Label>
            <Input
              id="experience"
              type="text"
              placeholder="Ex: Estágio, Júnior, Pleno, Sênior"
              aria-invalid={!!errors.experience}
              {...register("experience", {
                required: "Informe o nível de experiência",
              })}
            />
            <span className="text-sm text-red-500">
              {errors.experience?.message}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              type="text"
              placeholder="Cidade, Estado"
              aria-invalid={!!errors.location}
              {...register("location", {
                required: "Informe a localização",
              })}
            />
            <span className="text-sm text-red-500">
              {errors.location?.message}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Currículo (link)</Label>
            <Input
              id="resume"
              type="url"
              placeholder="Link do LinkedIn ou currículo"
              aria-invalid={!!errors.resume}
              {...register("resume", {
                required: "Informe o link do currículo",
              })}
            />
            <span className="text-sm text-red-500">
              {errors.resume?.message}
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
