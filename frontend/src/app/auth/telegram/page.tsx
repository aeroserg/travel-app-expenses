"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi, ITelegramAuthPayload } from "@/services/api";

export default function TelegramCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/tgAuthResult=([A-Za-z0-9\-_]+)/);
    if (!match) return;

    const base64url = match[1];
    const base64 = base64url
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(base64url.length + (4 - (base64url.length % 4)) % 4, "=");

    try {
      const payload: ITelegramAuthPayload = JSON.parse(atob(base64));

      authApi.telegramLogin(payload)
        .then(() => {
          router.push("/dashboard");
        })
        .catch((err) => {
          console.error("Ошибка входа через Telegram:", err);
          alert("Ошибка входа через Telegram: " + err.message);
        });
    } catch (e) {
      console.error("Ошибка обработки tgAuthResult:", e);
      alert("Некорректные данные Telegram");
    }
  }, [router]);

  return <p>Авторизация через Telegram...</p>;
}
