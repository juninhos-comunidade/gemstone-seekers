import { beforeEach, describe, expect, it, vi } from "vitest";
import { MOCK_CANDIDATE_BADGES } from "@/lib/mocks/badgeMock";

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

describe("badges api module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockImplementation((options) => options);
  });

  describe("getCandidateBadges", () => {
    it("returns result array when httpClient.get succeeds", async () => {
      const apiData = [
        {
          id: 1,
          name: "Test Badge",
          earnedAt: "2026-08-01T00:00:00Z",
        },
      ];
      mockHttpGet.mockResolvedValue({ result: apiData });

      const { getCandidateBadges } = await import("./badges");
      const data = await getCandidateBadges();

      expect(mockHttpGet).toHaveBeenCalledWith("/candidates/me/badges");
      expect(data).toEqual(apiData);
    });

    it("returns empty array when response result is null or undefined", async () => {
      mockHttpGet.mockResolvedValue({ result: null });

      const { getCandidateBadges } = await import("./badges");
      const data = await getCandidateBadges();

      expect(data).toEqual([]);
    });

    it("returns MOCK_CANDIDATE_BADGES fallback when httpClient.get fails", async () => {
      mockHttpGet.mockRejectedValue(new Error("Network Error"));

      const { getCandidateBadges } = await import("./badges");
      const data = await getCandidateBadges();

      expect(data).toEqual(MOCK_CANDIDATE_BADGES);
    });
  });

  describe("useCandidateBadgesQuery", () => {
    it("configures query with candidateBadges queryKey and queryFn", async () => {
      const { useCandidateBadgesQuery } = await import("./badges");
      const query = useCandidateBadgesQuery();

      expect(query.queryKey).toEqual(["candidateBadges"]);

      mockHttpGet.mockResolvedValue({ result: [] });
      const result = await query.queryFn();

      expect(mockHttpGet).toHaveBeenCalledWith("/candidates/me/badges");
      expect(result).toEqual([]);
    });
  });
});
