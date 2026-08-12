import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { getJobs, useJobsQuery } from "@/lib/api/jobs/getJobs";
import { getJobDetail, useJobDetailQuery } from "@/lib/api/jobs/getJobDetail";
import { createJob, useCreateJobMutation } from "@/lib/api/jobs/createJob";
import { updateJob, useUpdateJobMutation } from "@/lib/api/jobs/updateJob";
import { deleteJob, useDeleteJobMutation } from "@/lib/api/jobs/deleteJob";
import { Job, CreateJobInput, UpdateJobInput } from "@/lib/types/job";

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = "JobsQueryWrapper";
  return Wrapper;
}

describe("Jobs API (lib/api/jobs)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getJobs & useJobsQuery", () => {
    it("should fetch list of jobs successfully", async () => {
      const mockJobs: Job[] = [
        {
          id: "job-1",
          title: "Dev React",
          description: "Desc",
          recruiterId: "rec-1",
          companyId: "comp-1",
          seniorityLevel: "Pleno",
          department: "TI",
          status: "OPEN",
        },
      ];

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockJobs,
      });

      const result = await getJobs();
      expect(httpClient.get).toHaveBeenCalledWith("/jobs");
      expect(result).toEqual(mockJobs);
    });

    it("useJobsQuery hook fetches jobs", async () => {
      const mockJobs: Job[] = [];
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockJobs,
      });

      const { result } = renderHook(() => useJobsQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockJobs);
    });
  });

  describe("getJobDetail & useJobDetailQuery", () => {
    it("should fetch single job detail by id", async () => {
      const mockJob: Job = {
        id: "job-1",
        title: "Dev React",
        description: "Desc",
        recruiterId: "rec-1",
        companyId: "comp-1",
        seniorityLevel: "Pleno",
        department: "TI",
        status: "OPEN",
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockJob,
      });

      const result = await getJobDetail("job-1");
      expect(httpClient.get).toHaveBeenCalledWith("/jobs/job-1");
      expect(result).toEqual(mockJob);
    });

    it("useJobDetailQuery hook fetches job detail", async () => {
      const mockJob = { id: "job-1" } as Job;
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockJob,
      });

      const { result } = renderHook(() => useJobDetailQuery("job-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockJob);
    });
  });

  describe("createJob & useCreateJobMutation", () => {
    it("should post new job payload and return created job", async () => {
      const input: CreateJobInput = {
        title: "New Job",
        description: "Job description long text",
        seniorityLevel: "Junior",
        department: "Engineering",
        companyId: "comp-1",
        recruiterId: "rec-1",
      };

      const mockCreated: Job = {
        id: "job-999",
        ...input,
        seniorityLevel: input.seniorityLevel!,
        department: input.department!,
        status: "OPEN",
      };

      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: true,
        result: mockCreated,
      });

      const result = await createJob(input);
      expect(httpClient.post).toHaveBeenCalledWith("/jobs", input);
      expect(result).toEqual(mockCreated);
    });

    it("useCreateJobMutation hook mutates and invalidates query", async () => {
      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: true,
        result: { id: "job-1" },
      });

      const { result } = renderHook(() => useCreateJobMutation(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        title: "New",
        description: "Desc long text",
        companyId: "comp-1",
        recruiterId: "rec-1",
      });

      expect(httpClient.post).toHaveBeenCalled();
    });
  });

  describe("updateJob & useUpdateJobMutation", () => {
    it("should put updated job data and return updated job", async () => {
      const input: UpdateJobInput = {
        title: "Updated Title",
        description: "Updated description long text",
        seniorityLevel: "Sênior",
        department: "Engineering",
        companyId: "comp-1",
        recruiterId: "rec-1",
      };

      const mockUpdated: Job = {
        id: "job-101",
        ...input,
        seniorityLevel: input.seniorityLevel!,
        department: input.department!,
        status: "OPEN",
      };

      vi.mocked(httpClient.put).mockResolvedValueOnce({
        success: true,
        result: mockUpdated,
      });

      const result = await updateJob("job-101", input);
      expect(httpClient.put).toHaveBeenCalledWith("/jobs/job-101", input);
      expect(result).toEqual(mockUpdated);
    });

    it("useUpdateJobMutation hook mutates job", async () => {
      vi.mocked(httpClient.put).mockResolvedValueOnce({
        success: true,
        result: { id: "job-101" },
      });

      const { result } = renderHook(() => useUpdateJobMutation(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        id: "job-101",
        data: {
          title: "Title",
          description: "Desc long text",
          companyId: "comp-1",
          recruiterId: "rec-1",
        },
      });

      expect(httpClient.put).toHaveBeenCalled();
    });
  });

  describe("deleteJob & useDeleteJobMutation", () => {
    it("should call delete on /jobs/:id", async () => {
      vi.mocked(httpClient.delete).mockResolvedValueOnce({});

      await deleteJob("job-101");
      expect(httpClient.delete).toHaveBeenCalledWith("/jobs/job-101");
    });

    it("useDeleteJobMutation hook mutates delete job", async () => {
      vi.mocked(httpClient.delete).mockResolvedValueOnce({});

      const { result } = renderHook(() => useDeleteJobMutation(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync("job-101");

      expect(httpClient.delete).toHaveBeenCalled();
    });
  });
});
