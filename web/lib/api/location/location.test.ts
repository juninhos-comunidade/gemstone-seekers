import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import {
  getCountries,
  getStatesByCountry,
  getStates,
  getCitiesByState,
  getCities,
  useCountriesQuery,
  useStatesQuery,
  useStatesByCountryQuery,
  useCitiesByStateQuery,
  useCitiesQuery,
} from "./location";

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
  Wrapper.displayName = "LocationQueryWrapper";
  return Wrapper;
}

describe("location API (lib/api/location/location.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCountries & useCountriesQuery", () => {
    it("should fetch countries successfully", async () => {
      const mockData = [{ id: 1, name: "Brazil" }];
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockData,
      });

      const result = await getCountries();
      expect(httpClient.get).toHaveBeenCalledWith("/countries");
      expect(result).toEqual(mockData);
    });

    it("should return empty array if result is null", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: null,
      });
      const result = await getCountries();
      expect(result).toEqual([]);
    });

    it("useCountriesQuery hook works", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: [{ id: 1, name: "Brazil" }],
      });
      const { result } = renderHook(() => useCountriesQuery(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ id: 1, name: "Brazil" }]);
    });
  });

  describe("getStatesByCountry & useStatesByCountryQuery", () => {
    it("should fetch states by country id", async () => {
      const mockData = [{ id: 10, name: "São Paulo", countryId: 1 }];
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockData,
      });

      const result = await getStatesByCountry(1);
      expect(httpClient.get).toHaveBeenCalledWith("/countries/1/states");
      expect(result).toEqual(mockData);
    });

    it("should return empty array if result is null", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: null,
      });
      const result = await getStatesByCountry(1);
      expect(result).toEqual([]);
    });

    it("useStatesByCountryQuery hook is enabled when countryId > 0", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: [{ id: 10, name: "São Paulo" }],
      });
      const { result } = renderHook(() => useStatesByCountryQuery(1), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ id: 10, name: "São Paulo" }]);
    });

    it("useStatesByCountryQuery hook is disabled when countryId is null or 0", () => {
      const { result } = renderHook(() => useStatesByCountryQuery(0), {
        wrapper: createWrapper(),
      });
      expect(result.current.fetchStatus).toBe("idle");
    });
  });

  describe("getStates & useStatesQuery", () => {
    it("should fetch all states", async () => {
      const mockData = [{ id: 10, name: "São Paulo" }];
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockData,
      });

      const result = await getStates();
      expect(httpClient.get).toHaveBeenCalledWith("/states");
      expect(result).toEqual(mockData);
    });

    it("should return empty array when result is null", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: null,
      });
      const result = await getStates();
      expect(result).toEqual([]);
    });

    it("useStatesQuery hook works", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: [{ id: 10, name: "São Paulo" }],
      });
      const { result } = renderHook(() => useStatesQuery(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ id: 10, name: "São Paulo" }]);
    });
  });

  describe("getCitiesByState & useCitiesByStateQuery", () => {
    it("should fetch cities by state id", async () => {
      const mockData = [{ id: 100, name: "Campinas" }];
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockData,
      });

      const result = await getCitiesByState(10);
      expect(httpClient.get).toHaveBeenCalledWith("/states/10/cities");
      expect(result).toEqual(mockData);
    });

    it("should return empty array when result is null", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: null,
      });
      const result = await getCitiesByState(10);
      expect(result).toEqual([]);
    });

    it("useCitiesByStateQuery hook works when stateId > 0", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: [{ id: 100, name: "Campinas" }],
      });
      const { result } = renderHook(() => useCitiesByStateQuery(10), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ id: 100, name: "Campinas" }]);
    });

    it("useCitiesByStateQuery hook disabled when stateId is null", () => {
      const { result } = renderHook(() => useCitiesByStateQuery(null), {
        wrapper: createWrapper(),
      });
      expect(result.current.fetchStatus).toBe("idle");
    });
  });

  describe("getCities & useCitiesQuery", () => {
    it("should fetch all cities", async () => {
      const mockData = [{ id: 100, name: "Campinas" }];
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockData,
      });

      const result = await getCities();
      expect(httpClient.get).toHaveBeenCalledWith("/cities");
      expect(result).toEqual(mockData);
    });

    it("should return empty array when result is null", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: null,
      });
      const result = await getCities();
      expect(result).toEqual([]);
    });

    it("useCitiesQuery hook works", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: [{ id: 100, name: "Campinas" }],
      });
      const { result } = renderHook(() => useCitiesQuery(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ id: 100, name: "Campinas" }]);
    });
  });
});
