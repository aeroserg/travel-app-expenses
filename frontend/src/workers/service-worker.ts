// import { registerRoute } from "workbox-routing";
// import { NetworkOnly } from "workbox-strategies";
// import { BackgroundSyncPlugin } from "workbox-background-sync";
// import { openDB } from "idb";

// const SYNC_EVENT = "sync-expenses";
// const DB_NAME = "expensesDB";
// const STORE_NAME = "pendingExpenses";

// // Фоновая синхронизация
// const bgSyncPlugin = new BackgroundSyncPlugin(SYNC_EVENT, {
//   maxRetentionTime: 102 * 60, // 102 часа
//   onSync: async () => {
//     const db = await openDB(DB_NAME, 1);
//     const tx = db.transaction(STORE_NAME, "readonly");
//     const expenses = await tx.store.getAll();
//     await tx.done;

//     if (expenses.length > 0) {
//       try {
//         const response = await fetch("/expenses/sync", {
//           method: "POST",
//           body: JSON.stringify(expenses),
//           headers: { "Content-Type": "application/json" },
//         });

//         if (response.ok) {
//           console.log("✅ Данные успешно синхронизированы и удалены из IndexedDB.");
//         }
//       } catch (error) {
//         console.error("❌ Ошибка фоновой синхронизации:", error);
//       }
//     }
//   },
// });

// // Обработчик запросов к API расходов
// registerRoute(
//   ({ url }) => url.pathname.startsWith("/api/expenses"),
//   new NetworkOnly({
//     plugins: [bgSyncPlugin],
//   }),
//   "POST"
// );
