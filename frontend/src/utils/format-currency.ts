// src/utils/formatCurrency.ts
export function formatCurrency(amount: number, currency: "USD" | "EUR" | "RUB"): string {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }
  