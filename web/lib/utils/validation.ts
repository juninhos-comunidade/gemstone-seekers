import { z } from "zod";

/**
 * Valida dados usando um schema Zod e retorna os dados tipados.
 * Lança ZodError nativo se a validação falhar.
 */
export function validateSchema<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}
