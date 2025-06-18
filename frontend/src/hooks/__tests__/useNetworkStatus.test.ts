import { renderHook, act } from "@testing-library/react";
import { useNetworkStatus } from "../useNetworkStatus";

describe("useNetworkStatus", () => {
  beforeEach(() => {
    Object.defineProperty(global.navigator, "onLine", {
      value: true,
      configurable: true,
    });

    global.caches = {
      open: jest.fn().mockResolvedValue({
        keys: jest.fn().mockResolvedValue([]),
        match: jest.fn(),
        delete: jest.fn(),
      }),
    } as unknown as CacheStorage;
  });

  it("возвращает true при старте", () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current).toBe(true);
  });

  it("обновляется при offline событии", () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);
  });

  it("обновляется при online событии", async () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(true);
  });
});
