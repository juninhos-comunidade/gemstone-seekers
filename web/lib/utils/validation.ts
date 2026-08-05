import { z } from "zod";
export function validateSchema<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}
