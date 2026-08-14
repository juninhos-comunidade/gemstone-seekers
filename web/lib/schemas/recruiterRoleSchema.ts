import { z } from "zod";

export const recruiterRoleSchema = z.object({
  documentType: z.string().min(1, "Informe o tipo de documento"),
  documentNumber: z.string().min(1, "Informe o número do documento"),
  companyId: z.string().min(1, "Selecione a empresa"),
  jobTitle: z.string().min(1, "Informe o cargo"),
  phone: z.string().min(1, "Informe o telefone"),
});

export type RecruiterRoleFormData = z.infer<typeof recruiterRoleSchema>;
