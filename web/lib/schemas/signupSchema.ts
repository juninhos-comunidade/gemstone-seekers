import { z } from "zod";

export const schema = z
  .object({
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha é obrigatória"),
    confirmPassword: z.string().min(6, "Confirmar senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof schema>;
