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

describe("badges api module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockImplementation((options) => options);
  });

  describe("getCandidateBadges", () => {
    it("returns result array when httpClient.get succeeds", async () => {
      const apiData = [
        {
          badgeName: "Test Badge",
          technologyName: "TypeScript",
          description: "Test description",
          scoreAchieved: 10.0,
          earnedAt: "2026-08-01T00:00:00Z",
        },
      ];
      mockHttpGet.mockResolvedValue({ result: apiData });

      const { getCandidateBadges } = await import("./badges");
      const data = await getCandidateBadges();

      expect(mockHttpGet).toHaveBeenCalledWith("/badges/me");
      expect(data).toEqual(apiData);
    });

    it("returns empty array when response result is null or undefined", async () => {
      mockHttpGet.mockResolvedValue({ result: null });

      const { getCandidateBadges } = await import("./badges");
      const data = await getCandidateBadges();

      expect(mockHttpGet).toHaveBeenCalledWith("/badges/me");
      expect(data).toEqual([]);
    });

    it("throws error when httpClient.get fails", async () => {
      const error = new Error("Network Error");
      mockHttpGet.mockRejectedValue(error);

      const { getCandidateBadges } = await import("./badges");

      await expect(getCandidateBadges()).rejects.toThrow("Network Error");
      expect(mockHttpGet).toHaveBeenCalledWith("/badges/me");
    });
  });

  describe("useCandidateBadgesQuery", () => {
    it("configures query with candidateBadges queryKey and queryFn", async () => {
      const { useCandidateBadgesQuery } = await import("./badges");
      const query = useCandidateBadgesQuery();

      expect(query.queryKey).toEqual(["candidateBadges"]);

      mockHttpGet.mockResolvedValue({ result: [] });
      const result = await query.queryFn();

      expect(mockHttpGet).toHaveBeenCalledWith("/badges/me");
      expect(result).toEqual([]);
    });
  });
});
