import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { getCandidateProfile, useCandidateQuery } from "./getCandidateProfile";

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = "CandidateProfileQueryWrapper";
  return Wrapper;
}

describe("getCandidateProfile & useCandidateQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return candidate profile data when successful", async () => {
    const mockData = {
      candidate: {
        id: "cand-1",
        user: {
          id: "u-1",
          name: "John",
          email: "john@example.com",
          role: "CANDIDATE",
        },
      },
      address: null,
    };

    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: true,
      result: mockData,
    });

    const result = await getCandidateProfile();
    expect(httpClient.get).toHaveBeenCalledWith("/profile");
    expect(result).toEqual(mockData);
  });

  it("should return null if response or result is null/undefined", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: true,
      result: null,
    });

    const result = await getCandidateProfile();
    expect(result).toBeNull();
  });

  it("useCandidateQuery hook fetches candidate profile", async () => {
    const mockData = {
      candidate: {
        id: "cand-1",
        user: {
          id: "u-1",
          name: "John",
          email: "john@example.com",
          role: "CANDIDATE",
        },
      },
      address: null,
    };

    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: true,
      result: mockData,
    });

    const { result } = renderHook(() => useCandidateQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});
