import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { getLanguages, useLanguagesQuery } from "./languages";

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
  Wrapper.displayName = "LanguagesQueryWrapper";
  return Wrapper;
}

describe("languages API (lib/api/languages/languages.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch languages list successfully", async () => {
    const mockLangs = [
      { id: 1, name: "English" },
      { id: 2, name: "Portuguese" },
    ];

    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: true,
      result: mockLangs,
    });

    const result = await getLanguages();
    expect(httpClient.get).toHaveBeenCalledWith("/languages");
    expect(result).toEqual(mockLangs);
  });

  it("should return empty array if result is null or undefined", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: true,
      result: null,
    });

    const result = await getLanguages();
    expect(result).toEqual([]);
  });

  it("useLanguagesQuery hook fetches languages", async () => {
    const mockLangs = [{ id: 1, name: "English" }];

    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: true,
      result: mockLangs,
    });

    const { result } = renderHook(() => useLanguagesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockLangs);
  });
});
