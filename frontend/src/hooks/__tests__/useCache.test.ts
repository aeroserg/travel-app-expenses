import {
  saveExpenseToCache,
  getCachedExpenses,
  clearCachedExpenses,
} from "../useCache";
import { Response } from 'node-fetch';


describe("useCache", () => {
  const mockCacheData: Record<string, Response> = {
    "/offline-expense-1": new Response(JSON.stringify({ id: 1 })),
    "/offline-expense-2": new Response(JSON.stringify({ id: 2 })),
  };

  beforeEach(() => {
    global.caches = {
      open: jest.fn().mockResolvedValue({
        put: jest.fn(),
        keys: jest
          .fn()
          .mockResolvedValue([
            { url: "/offline-expense-1" },
            { url: "/offline-expense-2" },
          ]),
        match: jest.fn((req: { url: string }) =>
          Promise.resolve(mockCacheData[req.url])
        ),
        delete: jest.fn(),
      }),
    } as unknown as CacheStorage;
  });

  it("сохраняет расход в кэш без ошибок", async () => {
    await expect(saveExpenseToCache({ test: "data" })).resolves.toBeUndefined();
  });

  it("получает расходы из кэша", async () => {
    const result = await getCachedExpenses();
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("очищает кэш", async () => {
    await clearCachedExpenses();
    const cache = await caches.open("pending-expenses");
    expect(cache.delete).toHaveBeenCalledTimes(2);
  });
});
