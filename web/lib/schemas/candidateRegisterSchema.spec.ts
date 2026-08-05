import { describe, it, expect } from "vitest";
import { candidateRegisterSchema } from "./candidateRegisterSchema";

describe("candidateRegisterSchema", () => {
  it("accepts valid candidate register data", () => {
    const result = candidateRegisterSchema.safeParse({
      role: "CANDIDATE",
      documentType: "CPF",
      documentNumber: "12345678900",
      phone: "+55 11 99999-9999",
      summary: "Desenvolvedor front-end com foco em React.",
      companyId: "550e8400-e29b-41d4-a716-446655440000",
      department: "Tecnologia",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid candidate register data", () => {
    const result = candidateRegisterSchema.safeParse({
      role: "RECRUITER",
      documentType: "",
      documentNumber: "",
      phone: "",
      summary: "",
      companyId: "invalid-uuid",
      department: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      expect(fieldErrors.documentType).toContain(
        "Selecione o tipo de documento",
      );
      expect(fieldErrors.documentNumber).toContain(
        "Informe o número do documento",
      );
      expect(fieldErrors.phone).toContain("Informe o telefone");
      expect(fieldErrors.summary).toContain("Informe um resumo profissional");
      expect(fieldErrors.companyId).toContain("ID da empresa inválido");
      expect(fieldErrors.department).toContain("Informe o departamento");
    }
  });
});
