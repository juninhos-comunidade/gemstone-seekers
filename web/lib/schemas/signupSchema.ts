import { z } from "zod";

export const schema = z
  .object({
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    confirmEmail: z.string().email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Os e-mails não coincidem",
    path: ["confirmEmail"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
export type SignupFormData = z.infer<typeof schema>;
