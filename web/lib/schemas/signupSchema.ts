import { z } from "zod";

export const schema = z
  .object({
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    email: z.string().email("E-mail inválido"), // use z.email() se estiver no zod v4+
    password: z.string().min(6, "Senha é obrigatória"),
    confirmPassword: z.string().min(6, "Confirmar senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });
