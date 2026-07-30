import { describe, it, expect } from "vitest";
import { z, ZodError } from "zod";
import { validateSchema } from "@/lib/utils/validation";

describe("validateSchema (lib/utils/validation.ts)", () => {
  const userSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  it("should return the valid parsed data correctly", () => {
    const validData = { id: 1, name: "Alice" };
    const result = validateSchema(userSchema, validData);
    expect(result).toEqual(validData);
  });

  it("should throw a native ZodError if the data does not respect the schema", () => {
    const invalidData = { id: "not-a-number", name: "Alice" };
    expect(() => validateSchema(userSchema, invalidData)).toThrow(ZodError);
  });
});
