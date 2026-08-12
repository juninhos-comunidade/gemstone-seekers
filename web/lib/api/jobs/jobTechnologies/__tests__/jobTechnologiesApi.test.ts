import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import {
  getJobTechnologies,
  useJobTechnologiesQuery,
} from "@/lib/api/jobs/jobTechnologies/getJobTechnologies";
import {
  addJobTechnologies,
  useAddJobTechnologiesMutation,
} from "@/lib/api/jobs/jobTechnologies/addJobTechnologies";
import {
  removeJobTechnologies,
  useRemoveJobTechnologiesMutation,
} from "@/lib/api/jobs/jobTechnologies/deleteJobTechnologies";

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = "JobTechnologiesQueryWrapper";
  return Wrapper;
}

describe("Job Technologies API (lib/api/jobs/jobTechnologies)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getJobTechnologies & useJobTechnologiesQuery", () => {
    it("should return empty array if no jobId provided", async () => {
      const result = await getJobTechnologies("");
      expect(result).toEqual([]);
      expect(httpClient.get).not.toHaveBeenCalled();
    });

    it("should fetch technologies for given job and format response", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: [
          {
            technologyId: 1,
            technologyName: "React",
            category: "Frontend",
            isMandatory: true,
          },
        ],
      });

      const result = await getJobTechnologies("job-101");
      expect(httpClient.get).toHaveBeenCalledWith("/jobs/job-101/technologies");
      expect(result).toEqual([
        {
          technologyId: 1,
          technologyName: "React",
          category: "Frontend",
          isMandatory: true,
        },
      ]);
    });

    it("useJobTechnologiesQuery hook fetches job technologies", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: [],
      });

      const { result } = renderHook(() => useJobTechnologiesQuery("job-101"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([]);
    });
  });

  describe("addJobTechnologies & useAddJobTechnologiesMutation", () => {
    it("should post technologies array to /jobs/:jobId/technologies", async () => {
      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: true,
        result: [],
      });

      await addJobTechnologies("job-101", [
        { technologyId: 1, isMandatory: true },
      ]);

      expect(httpClient.post).toHaveBeenCalledWith(
        "/jobs/job-101/technologies",
        { technologyId: 1, isMandatory: true },
      );
    });

    it("useAddJobTechnologiesMutation hook mutates and invalidates queries", async () => {
      vi.mocked(httpClient.post).mockResolvedValueOnce({});

      const { result } = renderHook(() => useAddJobTechnologiesMutation(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        jobId: "job-101",
        technologies: [{ technologyId: 1, isMandatory: true }],
      });

      expect(httpClient.post).toHaveBeenCalled();
    });
  });

  describe("removeJobTechnologies & useRemoveJobTechnologiesMutation", () => {
    it("should call delete for each technologyId in array", async () => {
      vi.mocked(httpClient.delete).mockResolvedValue({
        success: true,
        result: null,
      });

      await removeJobTechnologies("job-101", [1, 2]);

      expect(httpClient.delete).toHaveBeenCalledTimes(2);
      expect(httpClient.delete).toHaveBeenNthCalledWith(
        1,
        "/jobs/job-101/technologies/1",
      );
      expect(httpClient.delete).toHaveBeenNthCalledWith(
        2,
        "/jobs/job-101/technologies/2",
      );
    });

    it("useRemoveJobTechnologiesMutation hook mutates and invalidates queries", async () => {
      vi.mocked(httpClient.delete).mockResolvedValue({});

      const { result } = renderHook(() => useRemoveJobTechnologiesMutation(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        jobId: "job-101",
        technologyIds: [1],
      });

      expect(httpClient.delete).toHaveBeenCalled();
    });
  });
});
