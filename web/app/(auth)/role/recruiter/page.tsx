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
import { useCompaniesQuery } from "@/lib/api/companies/getCompanies";
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

export default function RecruiterRegistrationPage() {
  const router = useRouter();
  const { mutateAsync: updateRecruiter, isPending } = useUpdateRecruiter();
  const { data: companies, isLoading: isLoadingCompanies } =
    useCompaniesQuery();

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
      companyId: "",
      jobTitle: "",
      phone: "",
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
    await updateRecruiter(data);
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
              <Label htmlFor="company">Empresa</Label>
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <Select
                    items={
                      companies?.map((company) => ({
                        value: company.id,
                        label: company.name,
                      })) || []
                    }
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading || isLoadingCompanies}
                  >
                    <SelectTrigger
                      id="company"
                      aria-invalid={!!errors.companyId}
                      className="w-full"
                    >
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCompanies ? (
                        <div className="flex items-center justify-center p-2">
                          <Spinner className="h-4 w-4" />
                        </div>
                      ) : (
                        companies?.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.companyId?.message && (
                <span className="block text-xs font-medium text-red-500">
                  {errors.companyId.message}
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
