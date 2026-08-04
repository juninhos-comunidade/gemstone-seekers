"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/reui/phone-input";
import { useUpdateRecruiter } from "@/lib/api/auth/UpdateRecruiter";
import {
  recruiterRoleSchema,
  type RecruiterRoleFormData,
} from "@/lib/schemas/recruiterRoleSchema";

const companySizeOptions = [
  { value: "1-10", label: "1-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "500+", label: "500+" },
];

export default function Page() {
  const { mutateAsync: updateRecruiter, isPending } = useUpdateRecruiter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterRoleFormData>({
    resolver: zodResolver(recruiterRoleSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      phone: "",
      companyWebsite: "",
      companySize: "",
    },
  });

  const isLoading = isSubmitting || isPending;

  const onSubmit = async (data: RecruiterRoleFormData) => {
    await updateRecruiter(data);
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
              disabled={isLoading}
              aria-invalid={!!errors.companyName}
              {...register("companyName")}
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
              disabled={isLoading}
              aria-invalid={!!errors.jobTitle}
              {...register("jobTitle")}
            />
            <span className="text-sm text-red-500">
              {errors.jobTitle?.message}
            </span>
          </div>

          <div className="space-y-2">
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
              disabled={isLoading}
              aria-invalid={!!errors.companyWebsite}
              {...register("companyWebsite")}
            />
            <span className="text-sm text-red-500">
              {errors.companyWebsite?.message}
            </span>
          </div>

          <div className="space-y-2">
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
            <span className="text-sm text-red-500">
              {errors.companySize?.message}
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
