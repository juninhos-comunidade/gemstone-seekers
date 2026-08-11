import { describe, it, expect, vi, beforeEach } from "vitest";
import { getJobDetail, useJobDetailQuery } from "./getJobDetail";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";
import { httpClient } from "@/lib/api/client";

const mockUseQuery = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: unknown) => mockUseQuery(options),
}));

describe("getJobDetail API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna o trabalho quando um ID válido é fornecido", async () => {
    const mockJob = MOCK_JOBS[0];
    vi.spyOn(httpClient, "get").mockResolvedValueOnce({
      success: true,
      result: mockJob,
    });

    const job = await getJobDetail(mockJob.id);
    expect(job).toBeDefined();
    expect(job?.id).toBe(mockJob.id);
  });

  it("retorna null quando o ID não existe", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValueOnce({
      success: true,
      result: null,
    });

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
