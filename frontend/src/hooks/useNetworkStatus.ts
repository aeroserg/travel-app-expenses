"use client";

import { useState, useEffect } from "react";
import { getCachedExpenses, clearCachedExpenses } from "@/hooks/useCache"; // Работа с кэшем

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      console.log("🔄 Интернет восстановлен! Проверяем отложенные запросы...");


      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const registration = await navigator.serviceWorker.ready;
        //eslint-disable-next-line
        const sync = (registration as any).sync; 
        if (sync) {
          try {
            await sync.register("sync-expenses");
            console.log("✅ Background Sync зарегистрирован!");
            return;
          } catch (error) {
            console.warn("⚠ Не удалось зарегистрировать Background Sync:", error);
          }
        } else {
          console.warn("⚠ Background Sync не поддерживается в этом браузере.");
        }
      }

      // ✅ Если Background Sync нет, отправляем траты вручную
      const pendingExpenses = await getCachedExpenses();
      if (pendingExpenses.length > 0) {
        console.log("📤 Отправляем сохраненные траты...");
        for (const expense of pendingExpenses) {
          try {
            await fetch(`/groups/${expense.groupId}/expenses`, {
              method: "POST",
              body: JSON.stringify(expense),
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": localStorage.getItem("token") || "",
              },
            });
            console.log("✅ Успешно отправлено:", expense);
          } catch (error) {
            console.error("❌ Ошибка отправки траты:", error);
          }
        }
        await clearCachedExpenses();
      }
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
