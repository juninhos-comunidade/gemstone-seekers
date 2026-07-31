import { z } from "zod";
export const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha inválida"),
});
