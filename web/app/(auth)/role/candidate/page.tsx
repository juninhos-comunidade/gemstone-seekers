"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
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
import { SelectLevel } from "@/components/SelectLevel/SelectLevel";
import { PhoneInput } from "@/components/reui/phone-input";
import { useRouter } from "next/navigation";

export default function CandidateRegistrationPage() {
  const router = useRouter();
  const { mutate: updateCandidate, isPending } = useUpdateCandidate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CandidateRoleFormData>({
    resolver: zodResolver(candidateRoleSchema),
    defaultValues: {
      documentType: "",
      documentNumber: "",
      phone: "",
      area: "",
      role: "",
      experience: "",
      location: "",
      resume: "",
    },
  });

  useEffect(() => {
    const selectedRole = localStorage.getItem("signup-role");

    if (selectedRole === "recruiter") {
      router.replace("/role/recruiter");
    }
  }, [router]);

  const isLoading = isSubmitting || isPending;

  const onSubmit = (data: CandidateRoleFormData) => {
    updateCandidate(data);
  };

  return (
    <main className="from-muted/40 via-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      <div className="bg-background/95 w-full max-w-2xl rounded-2xl border p-8 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Complete seu cadastro de candidato
          </h1>
          <p className="text-muted-foreground text-sm">
            Preencha seus dados profissionais para concluir o acesso à
            plataforma.
          </p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="documentType">Tipo de documento</Label>
              <Input
                id="documentType"
                type="text"
                placeholder="Ex: CPF"
                disabled={isLoading}
                aria-invalid={!!errors.documentType}
                {...register("documentType")}
              />
              {errors.documentType?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.documentType.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentNumber">Número do documento</Label>
              <Input
                id="documentNumber"
                type="text"
                placeholder="Ex: 123.456.789-00"
                disabled={isLoading}
                aria-invalid={!!errors.documentNumber}
                {...register("documentNumber")}
              />
              {errors.documentNumber?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.documentNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    disabled={isLoading}
                    aria-invalid={!!errors.phone}
                  />
                )}
              />
              {errors.phone?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                type="text"
                placeholder="Cidade, Estado"
                disabled={isLoading}
                aria-invalid={!!errors.location}
                {...register("location")}
              />
              {errors.location?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.location.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="area">Área de interesse</Label>
              <Input
                id="area"
                type="text"
                placeholder="Ex: Tecnologia, Marketing, Dados"
                disabled={isLoading}
                aria-invalid={!!errors.area}
                {...register("area")}
              />
              {errors.area?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.area.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Cargo desejado</Label>
              <Input
                id="role"
                type="text"
                placeholder="Ex: Desenvolvedor Front-end"
                disabled={isLoading}
                aria-invalid={!!errors.role}
                {...register("role")}
              />
              {errors.role?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.role.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="experience">Nível de experiência</Label>
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <SelectLevel
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
            {errors.experience?.message && (
              <span className="block text-xs font-medium text-red-500">
                {errors.experience.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="resume">Currículo ou LinkedIn</Label>
            <Input
              id="resume"
              type="url"
              placeholder="https://linkedin.com/in/seu-perfil"
              disabled={isLoading}
              aria-invalid={!!errors.resume}
              {...register("resume")}
            />
            {errors.resume?.message && (
              <span className="block text-xs font-medium text-red-500">
                {errors.resume.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 py-5 text-sm font-semibold shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                <span>Salvando...</span>
              </>
            ) : (
              "Concluir cadastro"
            )}
          </Button>
        </form>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          Escolheu o perfil errado?{" "}
          <Link
            href="/role"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Voltar e alterar perfil
          </Link>
        </p>
      </div>
    </main>
  );
}
