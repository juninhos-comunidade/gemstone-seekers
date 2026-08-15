import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useLoadingMessages } from "./useLoadingMessages";

describe("useLoadingMessages", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return the first message immediately when active", () => {
    const { result } = renderHook(() => useLoadingMessages(true));
    expect(result.current).toBe("Entrando...");
  });

  it("should not change message when not active", () => {
    const { result } = renderHook(() => useLoadingMessages(false));
    expect(result.current).toBe("Entrando...");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current).toBe("Entrando...");
  });

  it("should update message after delay when active", () => {
    const { result } = renderHook(() => useLoadingMessages(true));
    expect(result.current).toBe("Entrando...");

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current).toBe("Ainda entrando...");
  });

  it("should use custom messages when provided", () => {
    const customMessages = [
      { delay: 0, text: "Custom 1" },
      { delay: 2000, text: "Custom 2" },
    ];

    const { result } = renderHook(() =>
      useLoadingMessages(true, customMessages),
    );
    expect(result.current).toBe("Custom 1");

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current).toBe("Custom 2");
  });

  it("should clear timers when component unmounts", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    const { unmount } = renderHook(() => useLoadingMessages(true));

    unmount();

    // Should have cleared timers for all messages
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("should reset to first message when reactivated", () => {
    const { result, rerender } = renderHook(
      ({ isActive }) => useLoadingMessages(isActive),
      { initialProps: { isActive: false } },
    );

    expect(result.current).toBe("Entrando...");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current).toBe("Entrando...");

    rerender({ isActive: true });

    expect(result.current).toBe("Entrando...");

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current).toBe("Ainda entrando...");
  });
});
