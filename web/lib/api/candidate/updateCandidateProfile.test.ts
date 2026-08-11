import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateCandidateMutation } from "./updateCandidateProfile";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = "UpdateCandidateQueryWrapper";
  return Wrapper;
}

describe("updateCandidateProfile hook", () => {
  it("renders useUpdateCandidateMutation hook correctly", () => {
    const { result } = renderHook(() => useUpdateCandidateMutation(), {
      wrapper: createWrapper(),
    });
    expect(result.current.mutate).toBeDefined();
  });
});
