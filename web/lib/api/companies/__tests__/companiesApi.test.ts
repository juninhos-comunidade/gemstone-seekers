import { describe, it, expect, vi, beforeEach } from "vitest";
import { httpClient } from "@/lib/api/client";
import { getCompanies } from "@/lib/api/companies/getCompanies";
import { getCompanyRecruiters } from "@/lib/api/companies/getCompanyRecruiters";
import { Company, CompanyRecruiter } from "@/lib/types/company";

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

describe("Companies API (lib/api/companies)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCompanies", () => {
    it("should fetch companies list successfully", async () => {
      const mockCompanies: Company[] = [
        { id: "comp-1", name: "Tech Corp", cnpj: "12.345.678/0001-90" },
      ];

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockCompanies,
      });

      const result = await getCompanies();
      expect(httpClient.get).toHaveBeenCalledWith("/companies");
      expect(result).toEqual(mockCompanies);
    });
  });

  describe("getCompanyRecruiters", () => {
    it("should return empty array if no companyId provided", async () => {
      const result = await getCompanyRecruiters("");
      expect(result).toEqual([]);
      expect(httpClient.get).not.toHaveBeenCalled();
    });

    it("should fetch recruiters for given companyId", async () => {
      const mockRecruiters: CompanyRecruiter[] = [
        {
          id: "rec-1",
          companyId: "comp-1",
          name: "João Recrutador",
          userId: "user-1",
        },
      ];

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockRecruiters,
      });

      const result = await getCompanyRecruiters("comp-1");
      expect(httpClient.get).toHaveBeenCalledWith(
        "/companies/comp-1/recruiters",
      );
      expect(result).toEqual(mockRecruiters);
    });
  });
});
