import { describe, it, expect } from "vitest";
import { recruiterRoleSchema } from "./recruiterRoleSchema";

describe("recruiterRoleSchema", () => {
  it("accepts valid recruiter role data", () => {
    const result = recruiterRoleSchema.safeParse({
      documentType: "CNPJ",
      documentNumber: "00.000.000/0000-00",
      companyName: "Gemstone Seekers",
      jobTitle: "Analista de RH",
      phone: "+55 11 99999-9999",
      companyWebsite: "https://gemstoneseekers.com",
      companySize: "11-50",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty required fields", () => {
    const result = recruiterRoleSchema.safeParse({
      documentType: "",
      documentNumber: "",
      companyName: "",
      jobTitle: "",
      phone: "",
      companyWebsite: "",
      companySize: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      expect(fieldErrors.documentType).toContain("Informe o tipo de documento");
      expect(fieldErrors.documentNumber).toContain(
        "Informe o número do documento",
      );
      expect(fieldErrors.companyName).toContain("Informe o nome da empresa");
      expect(fieldErrors.jobTitle).toContain("Informe o cargo");
      expect(fieldErrors.phone).toContain("Informe o telefone");
      expect(fieldErrors.companyWebsite).toContain("Informe o site da empresa");
      expect(fieldErrors.companySize).toContain("Informe o tamanho da empresa");
    }
  });
});
