import { z } from "zod";

export const recruiterRoleSchema = z.object({
  documentType: z.string().min(1, "Informe o tipo de documento"),
  documentNumber: z.string().min(1, "Informe o número do documento"),
  companyName: z.string().min(1, "Informe o nome da empresa"),
  jobTitle: z.string().min(1, "Informe o cargo"),
  phone: z.string().min(1, "Informe o telefone"),
  companyWebsite: z.string().min(1, "Informe o site da empresa"),
  companySize: z.string().min(1, "Informe o tamanho da empresa"),
});

export type RecruiterRoleFormData = z.infer<typeof recruiterRoleSchema>;
