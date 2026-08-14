import { describe, it, expect } from "vitest";
import { recruiterRoleSchema } from "./recruiterRoleSchema";

describe("recruiterRoleSchema", () => {
  it("accepts valid recruiter role data", () => {
    const result = recruiterRoleSchema.safeParse({
      documentType: "CNPJ",
      documentNumber: "00.000.000/0000-00",
      companyId: "company-123",
      jobTitle: "Analista de RH",
      phone: "+55 11 99999-9999",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty required fields", () => {
    const result = recruiterRoleSchema.safeParse({
      documentType: "",
      documentNumber: "",
      companyId: "",
      jobTitle: "",
      phone: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      expect(fieldErrors.documentType).toContain("Informe o tipo de documento");
      expect(fieldErrors.documentNumber).toContain(
        "Informe o número do documento",
      );
      expect(fieldErrors.companyId).toContain("Selecione a empresa");
      expect(fieldErrors.jobTitle).toContain("Informe o cargo");
      expect(fieldErrors.phone).toContain("Informe o telefone");
    }
  });
});
