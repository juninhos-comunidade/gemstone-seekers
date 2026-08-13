"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/PasswordInput/PasswordInput";
import { schema, SignupFormData } from "@/lib/schemas/signupSchema";
import { useSignup } from "@/lib/api/auth/signup";
import { PasswordCheck } from "@/components/PasswordCheck/PasswordInput";
import { useLoadingMessages } from "@/lib/hooks/useLoadingMessages";

export default function Page() {
  const { mutate: signup, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
  });

  const isLoading = isSubmitting || isPending;

  const handleSignUp = (data: z.infer<typeof schema>) => {
    signup(data);
  };

  const loadingMessage = useLoadingMessages(isPending);

  return (
    <main className="from-muted/40 via-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      <div className="bg-background/95 w-full max-w-md rounded-2xl border p-8 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-10">
        <h1 className="mb-1 text-center text-2xl font-bold tracking-tight">
          Criar Conta
        </h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">
          Preencha os dados abaixo para começar
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(handleSignUp)}>
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Nome completo
            </Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              disabled={isLoading}
              aria-invalid={!!errors.fullName}
              className="focus-visible:ring-primary/40 transition-colors focus-visible:ring-2 aria-[invalid=true]:border-red-500"
              {...register("fullName")}
            />
            {errors.fullName?.message && (
              <span className="block text-xs font-medium text-red-500">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              className="focus-visible:ring-primary/40 transition-colors focus-visible:ring-2 aria-[invalid=true]:border-red-500"
              {...register("email")}
            />
            {errors.email?.message && (
              <span className="block text-xs font-medium text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmEmail" className="text-sm font-medium">
              Confirmar e-mail
            </Label>
            <Input
              id="confirmEmail"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={!!errors.confirmEmail}
              onPaste={(e) => e.preventDefault()}
              className="focus-visible:ring-primary/40 transition-colors focus-visible:ring-2 aria-[invalid=true]:border-red-500"
              {...register("confirmEmail")}
            />
            {errors.confirmEmail?.message && (
              <span className="block text-xs font-medium text-red-500">
                {errors.confirmEmail.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <PasswordCheck
              disabled={isLoading}
              aria-invalid={!!errors.password}
              {...register("password")}
            />

            {errors.password?.message && (
              <span className="block text-xs font-medium text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar senha
            </Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              className="focus-visible:ring-primary/40 transition-colors focus-visible:ring-2 aria-[invalid=true]:border-red-500"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword?.message && (
              <span className="block text-xs font-medium text-red-500">
                {errors.confirmPassword.message}
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
                <span>{loadingMessage}</span>
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          Já possui uma conta?{" "}
          <Link
            href="/login"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
