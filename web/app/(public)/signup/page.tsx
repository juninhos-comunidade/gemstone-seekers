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

export default function Page() {
  const { mutateAsync: signup, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
  });

  const isLoading = isSubmitting || isPending;

  const handleSignUp = async (data: z.infer<typeof schema>) => {
    await signup(data);
  };

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center">
      <div className="bg-background w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Criar Conta</h1>

        <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              disabled={isLoading}
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            <span className="text-sm text-red-500">
              {errors.fullName?.message}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <span className="text-sm text-red-500">
              {errors.email?.message}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <span className="text-sm text-red-500">
              {errors.password?.message}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <span className="text-sm text-red-500">
              {errors.confirmPassword?.message}
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
                <span>Cadastrando...</span>
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
