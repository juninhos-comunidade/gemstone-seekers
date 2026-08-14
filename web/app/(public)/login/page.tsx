"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/PasswordInput/PasswordInput";
import { schema } from "@/lib/schemas/loginSchema";
import { useLogin } from "@/lib/api/auth/login";
import { Spinner } from "@/components/ui/spinner";
import { useLoadingMessages } from "@/lib/hooks/useLoadingMessages";

export default function Page() {
  const { mutate: login, isPending, error } = useLogin();

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = isSubmitting || isPending;

  const handleLogin = handleSubmit((data) => {
    login(data);
  });

  const loadingMessage = useLoadingMessages(isPending);

  return (
    <main className="bg-background md:bg-muted/30 min-h-screen md:flex md:items-center md:justify-center md:p-4">
      <div className="grid w-full max-w-5xl md:grid-cols-2 md:overflow-hidden md:rounded-2xl md:border md:shadow-lg">
        <section className="bg-primary text-primary-foreground relative hidden min-h-[600px] flex-col justify-between overflow-hidden p-10 md:flex">
          <div className="bg-primary-foreground/10 absolute -top-24 -right-24 h-64 w-64 rounded-full" />
          <div className="bg-primary-foreground/10 absolute -bottom-32 -left-24 h-80 w-80 rounded-full" />

          <div className="relative z-10">
            <div className="mb-10 flex items-center gap-3">
              <div className="bg-primary-foreground/10 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold">
                G
              </div>
              <span className="text-lg font-semibold">Gemstone Seekers</span>
            </div>

            <div className="max-w-md">
              <h2 className="text-4xl leading-tight font-bold">
                Encontre oportunidades.
                <br />
                Mostre seu potencial.
              </h2>
              <p className="text-primary-foreground/80 mt-6 text-base leading-relaxed">
                Conecte talentos e empresas em um só lugar. Desenvolva suas
                habilidades e encontre novas oportunidades para sua carreira.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex gap-2">
              <span className="bg-primary-foreground h-2 w-2 rounded-full" />
              <span className="bg-primary-foreground/40 h-2 w-2 rounded-full" />
              <span className="bg-primary-foreground/40 h-2 w-2 rounded-full" />
            </div>
            <p className="text-primary-foreground/60 text-sm">
              Sua próxima oportunidade pode estar aqui.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center p-8 sm:p-12 md:min-h-[600px]">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Bem-vindo de volta
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Entre na sua conta para continuar.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                {error.message}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin} noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-sm text-red-500"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <PasswordInput
                  id="password"
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...register("password")}
                />
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="text-sm text-red-500"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    <span>{loadingMessage}</span>
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <p className="text-muted-foreground mt-8 text-center text-sm">
              Não possui uma conta?{" "}
              <Link
                href="/signup"
                className="text-primary font-medium hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
