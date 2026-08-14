import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseQuery = vi.fn();
const mockHttpGet = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: unknown) => mockUseQuery(options),
}));

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: (...args: unknown[]) => mockHttpGet(...args),
  },
}));

describe("radar api hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockImplementation((options) => options);
  });

  it("useTechnologyDemand configures query with the market radar endpoint", async () => {
    const { useTechnologyDemand } = await import("./radar");
    const query = useTechnologyDemand();

    expect(query.queryKey).toEqual(["market-radar", "technology-demand"]);

    await query.queryFn();

    expect(mockHttpGet).toHaveBeenCalledWith("/market-radar/technology-demand");
  });
});
