import { describe, it, expect, vi } from "vitest";
import { getJobDetail, useJobDetailQuery } from "./getJobDetail";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

const mockUseQuery = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: unknown) => mockUseQuery(options),
}));

describe("getJobDetail API", () => {
  it("retorna o trabalho quando um ID válido é fornecido", async () => {
    const mockId = MOCK_JOBS[0].id;
    const job = await getJobDetail(mockId);
    expect(job).toBeDefined();
    expect(job?.id).toBe(mockId);
  });

  it("retorna null quando o ID não existe", async () => {
    const job = await getJobDetail("invalid-non-existent-id");
    expect(job).toBeNull();
  });

  it("useJobDetailQuery configura queryKey e queryFn corretamente", () => {
    useJobDetailQuery("job-123");
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["jobs", "job-123"],
        enabled: true,
      }),
    );
  });
});
