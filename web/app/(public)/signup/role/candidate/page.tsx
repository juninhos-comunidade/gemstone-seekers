"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateCandidate } from "@/lib/api/auth/UpdateCandidate";
import {
  candidateRoleSchema,
  type CandidateRoleFormData,
} from "@/lib/schemas/candidateRoleSchema";

export default function Page() {
  const { mutateAsync: updateCandidate, isPending } = useUpdateCandidate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateRoleFormData>({
    resolver: zodResolver(candidateRoleSchema),
    defaultValues: {
      phone: "",
      area: "",
      role: "",
      experience: "",
      location: "",
      resume: "",
    },
  });

  const isLoading = isSubmitting || isPending;

  const onSubmit = async (data: CandidateRoleFormData) => {
    await updateCandidate(data);
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
              disabled={isLoading}
              aria-invalid={!!errors.phone}
              {...register("phone")}
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
              disabled={isLoading}
              aria-invalid={!!errors.area}
              {...register("area")}
            />
            <span className="text-sm text-red-500">{errors.area?.message}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo desejado</Label>
            <Input
              id="role"
              type="text"
              placeholder="Ex: Desenvolvedor Front-end"
              disabled={isLoading}
              aria-invalid={!!errors.role}
              {...register("role")}
            />
            <span className="text-sm text-red-500">{errors.role?.message}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Nível de experiência</Label>
            <Input
              id="experience"
              type="text"
              placeholder="Ex: Estágio, Júnior, Pleno, Sênior"
              disabled={isLoading}
              aria-invalid={!!errors.experience}
              {...register("experience")}
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
              disabled={isLoading}
              aria-invalid={!!errors.location}
              {...register("location")}
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
              disabled={isLoading}
              aria-invalid={!!errors.resume}
              {...register("resume")}
            />
            <span className="text-sm text-red-500">
              {errors.resume?.message}
            </span>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                <span>Concluindo...</span>
              </>
            ) : (
              "Concluir cadastro"
            )}
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
