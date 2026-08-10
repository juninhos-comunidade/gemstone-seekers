import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  useUpdateUserMutation,
  useUpdateAddressMutation,
  useAddLinkMutation,
  useDeleteLinkMutation,
  useAddExperienceMutation,
  useDeleteExperienceMutation,
  useAddEducationMutation,
  useDeleteEducationMutation,
  useAddCertificationMutation,
  useDeleteCertificationMutation,
  useAddLanguageMutation,
  useDeleteLanguageMutation,
  useAddProjectMutation,
  useDeleteProjectMutation,
} from "./userProfileMutations";
import { getCandidateProfile, useCandidateQuery } from "./getCandidateProfile";
import { httpClient } from "@/lib/api/client";

const mockInvalidateQueries = vi.fn();
const mockUseMutation = vi.fn();
const mockUseQuery = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
  useMutation: (options: unknown) => mockUseMutation(options),
  useQuery: (options: unknown) => mockUseQuery(options),
}));

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Candidate Profile API & Mutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCandidateProfile & useCandidateQuery", () => {
    it("getCandidateProfile fetches profile successfully", async () => {
      const mockResult = { candidate: { phone: "123" }, address: null };
      vi.mocked(httpClient.get).mockResolvedValueOnce({ result: mockResult });

      const data = await getCandidateProfile();
      expect(httpClient.get).toHaveBeenCalledWith("/profile");
      expect(data).toEqual(mockResult);
    });

    it("getCandidateProfile returns null if response.result is missing", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce(null);

      const data = await getCandidateProfile();
      expect(httpClient.get).toHaveBeenCalledWith("/profile");
      expect(data).toBeNull();
    });

    it("useCandidateQuery calls useQuery with candidateProfile key", () => {
      mockUseQuery.mockReturnValue({ data: null, isLoading: false });
      useCandidateQuery();
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["candidateProfile"],
        }),
      );
    });
  });

  describe("All 14 UserProfileMutations", () => {
    const runMutationTest = async (
      hookFn: () => unknown,
      httpMethod: "post" | "patch" | "delete",
      expectedEndpoint: string,
      inputPayload?: unknown,
    ) => {
      let mutationOptions: {
        mutationFn: (_arg: unknown) => Promise<unknown>;
        onSuccess: (_data: unknown) => void;
        onError: (_error: Error) => void;
      } | null = null;

      mockUseMutation.mockImplementation((options) => {
        mutationOptions = options;
        return {
          mutate: (payload: unknown) => options.mutationFn(payload),
          isPending: false,
        };
      });

      hookFn();
      expect(mutationOptions).not.toBeNull();

      vi.mocked(httpClient[httpMethod]).mockResolvedValueOnce({
        result: { success: true },
      });

      const res = await mutationOptions!.mutationFn(inputPayload);
      expect(httpClient[httpMethod]).toHaveBeenCalledWith(
        expectedEndpoint,
        ...(inputPayload && httpMethod !== "delete" ? [inputPayload] : []),
      );
      expect(res).toEqual({ success: true });

      mutationOptions!.onSuccess({ success: true });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ["candidateProfile"],
      });

      mutationOptions!.onError(new Error("Test error"));
      mutationOptions!.onError({} as Error);
    };

    it("tests useUpdateUserMutation", async () => {
      await runMutationTest(useUpdateUserMutation, "patch", "/profile/user", {
        name: "Test",
      });
    });

    it("tests useUpdateAddressMutation", async () => {
      await runMutationTest(
        useUpdateAddressMutation,
        "patch",
        "/profile/address",
        {
          street: "Main St",
        },
      );
    });

    it("tests useAddLinkMutation", async () => {
      await runMutationTest(useAddLinkMutation, "post", "/profile/links", {
        name: "GitHub",
        url: "https://github.com",
      });
    });

    it("tests useDeleteLinkMutation", async () => {
      await runMutationTest(
        useDeleteLinkMutation,
        "delete",
        "/profile/links/link-1",
        "link-1",
      );
    });

    it("tests useAddExperienceMutation", async () => {
      await runMutationTest(
        useAddExperienceMutation,
        "post",
        "/profile/experiences",
        {
          title: "Dev",
        },
      );
    });

    it("tests useDeleteExperienceMutation", async () => {
      await runMutationTest(
        useDeleteExperienceMutation,
        "delete",
        "/profile/experiences/exp-1",
        "exp-1",
      );
    });

    it("tests useAddEducationMutation", async () => {
      await runMutationTest(
        useAddEducationMutation,
        "post",
        "/profile/educations",
        {
          institution: "USP",
        },
      );
    });

    it("tests useDeleteEducationMutation", async () => {
      await runMutationTest(
        useDeleteEducationMutation,
        "delete",
        "/profile/educations/edu-1",
        "edu-1",
      );
    });

    it("tests useAddCertificationMutation", async () => {
      await runMutationTest(
        useAddCertificationMutation,
        "post",
        "/profile/certifications",
        { name: "AWS" },
      );
    });

    it("tests useDeleteCertificationMutation", async () => {
      await runMutationTest(
        useDeleteCertificationMutation,
        "delete",
        "/profile/certifications/cert-1",
        "cert-1",
      );
    });

    it("tests useAddLanguageMutation", async () => {
      await runMutationTest(
        useAddLanguageMutation,
        "post",
        "/profile/languages",
        {
          languageName: "English",
        },
      );
    });

    it("tests useDeleteLanguageMutation", async () => {
      await runMutationTest(
        useDeleteLanguageMutation,
        "delete",
        "/profile/languages/1",
        1,
      );
    });

    it("tests useAddProjectMutation", async () => {
      await runMutationTest(
        useAddProjectMutation,
        "post",
        "/profile/projects",
        {
          name: "Project A",
        },
      );
    });

    it("tests useDeleteProjectMutation", async () => {
      await runMutationTest(
        useDeleteProjectMutation,
        "delete",
        "/profile/projects/proj-1",
        "proj-1",
      );
    });
  });
});
