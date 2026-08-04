import { describe, it, expect } from "vitest";
import { recruiterRegisterSchema } from "./recruiterRegisterSchema";

describe("recruiterRegisterSchema", () => {
  it("accepts valid recruiter register data", () => {
    const result = recruiterRegisterSchema.safeParse({
      name: "Thiago Silva",
      email: "thiago@example.com",
      password: "12345678",
      companyId: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid recruiter register data", () => {
    const result = recruiterRegisterSchema.safeParse({
      name: "ab",
      email: "email-invalido",
      password: "123",
      companyId: "empresa-invalida",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      expect(fieldErrors.name).toContain(
        "O nome deve ter pelo menos 3 caracteres",
      );
      expect(fieldErrors.email).toContain("E-mail inválido");
      expect(fieldErrors.password).toContain(
        "A senha deve ter pelo menos 8 caracteres",
      );
      expect(fieldErrors.companyId).toContain("Empresa inválida");
    }
  });
});
