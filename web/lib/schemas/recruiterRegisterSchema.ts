import { z } from "zod";

export const recruiterRegisterSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),

  email: z.string().email("E-mail inválido"),

  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),

  companyId: z.string().uuid("Empresa inválida"),
});

export type RecruiterRegisterFormData = z.infer<typeof recruiterRegisterSchema>;
