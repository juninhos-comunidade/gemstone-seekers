import { z } from "zod";

export const candidateRegisterSchema = z.object({
  role: z.literal("CANDIDATE"),

  documentType: z.string().min(1, "Selecione o tipo de documento"),

  documentNumber: z.string().min(1, "Informe o número do documento"),

  phone: z.string().min(1, "Informe o telefone"),

  summary: z.string().min(1, "Informe um resumo profissional"),

  companyId: z.string().uuid("ID da empresa inválido"),

  department: z.string().min(1, "Informe o departamento"),
});

export type CandidateRegisterFormData = z.infer<typeof candidateRegisterSchema>;
