import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import {
  getTechnologies,
  useTechnologiesQuery,
} from "@/lib/api/technologies/getTechnologies";
import { TechnologyItem } from "@/lib/types/technology";

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
  Wrapper.displayName = "TechnologiesQueryWrapper";
  return Wrapper;
}

describe("Technologies API (lib/api/technologies)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch technology catalog list", async () => {
    const mockTechs: TechnologyItem[] = [
      { id: 1, name: "React", category: "Frontend" },
      { id: 2, name: "Node.js", category: "Backend" },
    ];

    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: true,
      result: mockTechs,
    });

    const result = await getTechnologies();
    expect(httpClient.get).toHaveBeenCalledWith("/technologies");
    expect(result).toEqual(mockTechs);
  });

  it("useTechnologiesQuery hook fetches technology catalog", async () => {
    const mockTechs: TechnologyItem[] = [];
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: true,
      result: mockTechs,
    });

    const { result } = renderHook(() => useTechnologiesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTechs);
  });
});
