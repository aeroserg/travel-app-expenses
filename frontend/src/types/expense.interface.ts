export interface Expense {
    _id: string; // Уникальный идентификатор траты
    name: string; // Название (например, "Обед", "Такси")
    amount: number; // Сумма
    currency: currency; // Валюта
    paidBy: Record<string, string | number>; // ID пользователя, который оплатил
    debtors: Record<string, string | number>; // Список ID пользователей, которые должны деньги
    createdAt: string; // Дата создания траты (ISO string)
  }
export type currency = "RUB" | "USD" | "EUR"; // Валюта

export interface IDBExpense {
  _id: string; // Уникальный идентификатор траты
  groupId: string;
  name: string; // Название (например, "Обед", "Такси")
  amount: number; // Сумма
  currency: currency; // Валюта
  paidBy: string; // ID пользователя, который оплатил
  debtors: string[]; // Список ID пользователей, которые должны деньги
  createdAt: string; // Дата создания траты (ISO string)
}