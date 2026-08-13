"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateRecruiter } from "@/lib/api/auth/UpdateRecruiter";
import {
  recruiterRoleSchema,
  type RecruiterRoleFormData,
} from "@/lib/schemas/recruiterRoleSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/reui/phone-input";
import { useRouter } from "next/navigation";

const companySizeOptions = [
  { value: "1-10", label: "1-10 colaboradores" },
  { value: "11-50", label: "11-50 colaboradores" },
  { value: "51-200", label: "51-200 colaboradores" },
  { value: "201-500", label: "201-500 colaboradores" },
  { value: "500+", label: "500+ colaboradores" },
];

export default function RecruiterRegistrationPage() {
  const router = useRouter();
  const { mutateAsync: updateRecruiter, isPending } = useUpdateRecruiter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterRoleFormData>({
    resolver: zodResolver(recruiterRoleSchema),
    defaultValues: {
      documentType: "",
      documentNumber: "",
      companyName: "",
      jobTitle: "",
      phone: "",
      companyWebsite: "",
      companySize: "",
    },
  });

  useEffect(() => {
    const selectedRole = localStorage.getItem("signup-role");

    if (selectedRole === "candidate") {
      router.replace("/role/candidate");
    }
  }, [router]);

  const isLoading = isSubmitting || isPending;

  const onSubmit = async (data: RecruiterRoleFormData) => {
    try {
      await updateRecruiter(data);
    } catch {
      // Tratado no onError do useUpdateRecruiter
    }
  };

  return (
    <main className="from-muted/40 via-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      <div className="bg-background/95 w-full max-w-2xl rounded-2xl border p-8 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Complete seu cadastro de recrutador
          </h1>
          <p className="text-muted-foreground text-sm">
            Informe os dados da empresa e finalize seu acesso ao painel.
          </p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="documentType">Tipo de documento</Label>
              <Input
                id="documentType"
                type="text"
                placeholder="Ex: CPF / CNPJ"
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
                placeholder="Ex: 00.000.000/0000-00"
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
              <Label htmlFor="company-name">Nome da empresa</Label>
              <Input
                id="company-name"
                type="text"
                placeholder="Nome da empresa"
                disabled={isLoading}
                aria-invalid={!!errors.companyName}
                {...register("companyName")}
              />
              {errors.companyName?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.companyName.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="job-title">Cargo</Label>
              <Input
                id="job-title"
                type="text"
                placeholder="Ex: Analista de RH"
                disabled={isLoading}
                aria-invalid={!!errors.jobTitle}
                {...register("jobTitle")}
              />
              {errors.jobTitle?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.jobTitle.message}
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
              <Label htmlFor="company-website">Site da empresa</Label>
              <Input
                id="company-website"
                type="url"
                placeholder="https://suaempresa.com"
                disabled={isLoading}
                aria-invalid={!!errors.companyWebsite}
                {...register("companyWebsite")}
              />
              {errors.companyWebsite?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.companyWebsite.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-size">Tamanho da empresa</Label>
            <Controller
              name="companySize"
              control={control}
              render={({ field }) => (
                <Select
                  items={companySizeOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="company-size"
                    disabled={isLoading}
                    aria-invalid={!!errors.companySize}
                    className="w-full"
                  >
                    <SelectValue placeholder="Selecione o tamanho da empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.companySize?.message && (
              <span className="block text-xs font-medium text-red-500">
                {errors.companySize.message}
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
