"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/PasswordInput/PasswordInput";
import { schema } from "@/lib/schemas/loginSchema";

export default function Page() {
  const router = useRouter();

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const handleLogin = handleSubmit(async (data) => {
    console.log(data);
    router.push("/candidate/dashboard");
  });

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center">
      <div className="bg-background w-full max-w-sm rounded-xl border p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Entrar</h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="E-mail"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>

            <PasswordInput
              id="password"
              placeholder="Senha"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            disabled={isSubmitting}
            className="w-full"
            type="submit"
            onClick={isSubmitting ? undefined : handleLogin}
          >
            Entrar
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Não possui uma conta?{" "}
          <Link href="/signup/role" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
