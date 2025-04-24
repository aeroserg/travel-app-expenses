
//eslint-disable-next-line 
export async function saveExpenseToCache(expense: any) {
    const cache = await caches.open("pending-expenses");
    await cache.put(
      new Request(`/offline-expense-${Date.now()}`),
      new Response(JSON.stringify(expense), { headers: { "Content-Type": "application/json" } })
    );
  }
  
  export async function getCachedExpenses() {
    const cache = await caches.open("pending-expenses");
    const keys = await cache.keys();
    const expenses = [];
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const expenseData = await response.json();
        expenses.push(expenseData);
      }
    }
    return expenses;
  }
  
  export async function clearCachedExpenses() {
    const cache = await caches.open("pending-expenses");
    const keys = await cache.keys();
    for (const request of keys) {
      await cache.delete(request);
    }
  }
  