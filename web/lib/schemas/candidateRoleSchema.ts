import { z } from "zod";

export const candidateRoleSchema = z.object({
  documentType: z.string().min(1, "Informe o tipo de documento"),
  documentNumber: z.string().min(1, "Informe o número do documento"),
  phone: z.string().min(1, "Informe o telefone"),
  area: z.string().min(1, "Informe a área de interesse"),
  role: z.string().min(1, "Informe o cargo desejado"),
  experience: z.string().min(1, "Informe o nível de experiência"),
  location: z.string().min(1, "Informe a localização"),
  resume: z.string().min(1, "Informe o link do currículo"),
});

export type CandidateRoleFormData = z.infer<typeof candidateRoleSchema>;
