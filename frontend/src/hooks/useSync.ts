interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistration {
  readonly sync?: SyncManager;
}


export async function registerSync() {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready;
    
    // ✅ Приводим `registration` к типу, который явно поддерживает `sync`
    const swRegistration = registration as ServiceWorkerRegistration & { sync?: SyncManager };

    if (swRegistration.sync) {
      try {
        await swRegistration.sync.register("sync-expenses");
        console.log("✅ Background Sync зарегистрирован!");
      } catch (error) {
        console.error("❌ Ошибка регистрации Background Sync:", error);
      }
    } else {
      console.warn("⚠ Background Sync не поддерживается в этом браузере.");
    }
  } else {
    console.warn("⚠ Background Sync не поддерживается.");
  }
}
