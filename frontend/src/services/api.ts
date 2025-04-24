import { QueryClient } from "@tanstack/react-query";
import { Expense } from "../types/expense.interface";
import { Group } from "../types/group.interface";

export const API_URL = "http://localhost:4000";
export const queryClient = new QueryClient();

/**
 * Функция для запросов на сервер с поддержкой `X-Auth-Token`
 */
/**
 * Функция для запросов на сервер с поддержкой `X-Auth-Token`
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token"); // Храним токен в localStorage

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "X-Auth-Token": token } : {}), // Добавляем токен, если он есть
    ...options.headers, // Пользовательские заголовки
  };

  console.log(
    `[API] Запрос: ${options.method || "GET"} ${API_URL}${endpoint}`
  );
  console.log(`Отправляем токен: ${token}`);

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Клонируем response, чтобы можно было дважды прочитать body (для логов и возврата)
  const responseClone = response.clone();
  const responseBody = await responseClone.json().catch(() => null);

  console.log(`[API] Ответ: ${response.status} ${response.statusText}`, responseBody);

  // Обрабатываем новый токен, если он пришел
  if (responseBody && responseBody.token) {
    console.log(`Новый токен получен: ${responseBody.token}`);
    localStorage.setItem("token", responseBody.token); // Обновляем токен
  }

  if (!response.ok) {
    console.error(`[API] Ошибка: ${response.status}`, responseBody);

    if (response.status === 401) {
      console.warn("[API] 401 Unauthorized - разлогиниваем пользователя");
      localStorage.removeItem("token"); // Удаляем токен
      window.location.href = "/auth/login"; // Редирект на страницу логина
    }

    throw new Error(responseBody?.message || "Ошибка API");
  }

  return responseBody as T;
}


// Функция разлогина при 401 Unauthorized
// function handleUnauthorized() {
//   localStorage.removeItem("token"); // Удаляем токен
//   window.location.href = "/auth/login"; // Редирект на страницу логина
// }

/** ==============================
 *  🚀 AUTH API
 *  ============================== */
export const authApi = {
  async login(email: string, password: string) {
    return apiFetch<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async getProfile() {
    return apiFetch<{ _id: string; name: string; email: string }>("/users/me");
  },

  async register(name: string, email: string, password: string) {
    return apiFetch<{ token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  async logout() {
    localStorage.removeItem("token");
  },
};

/** ==============================
 *  🚀 GROUPS API
 *  ============================== */
export const groupsApi = {
  async getGroups(): Promise<Group[]> {
    return apiFetch<Group[]>("/groups");
  },

  async updateGroup(groupId: string, name: string) {
    return apiFetch<{ id: string }>(`/groups/${groupId}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  },

  async getGroup(
    groupId: string
  ): Promise<Group & { members: { _id: string; name: string }[] }> {
    return apiFetch<Group & { members: { _id: string; name: string }[] }>(
      `/groups/${groupId}`
    );
  },

  async createGroup(name: string) {
    return apiFetch<{ id: string }>("/groups", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  async joinGroup(groupId: string) {
    return apiFetch<{
       _id: string 
}>(`/groups/${groupId}/join`, {
      method: "POST",
    });
  },
  
  async deleteGroup(groupId: string) {
    return apiFetch(`/groups/${groupId}`, { method: "DELETE" });
  },

  async leaveGroup(groupId: string) {
    return apiFetch(`/groups/${groupId}/leave`, { method: "POST" });
  },

  async getGroupById(groupId: string) {
    return apiFetch<{ id: string; name: string; members: { _id: string; name: string }[] }>(
      `/groups/${groupId}`
    );
  },
};

/** ==============================
 *  🚀 EXPENSES API
 *  ============================== */
export const expensesApi = {
  async getExpenses(groupId: string): Promise<Expense[]> {
    return apiFetch<Expense[]>(`/groups/${groupId}/expenses`);
  },

  async addExpense(
    groupId: string,
    name: string,
    amount: number,
    currency: "RUB" | "USD" | "EUR",
    paidBy: string,
    debtors: string[]
  ) {
    return apiFetch<{ id: string }>(`/groups/${groupId}/expenses`, {
      method: "POST",
      body: JSON.stringify({ name, amount, currency, paidBy, debtors }),
    });
  },

  async deleteExpense(groupId: string, expenseId: string) {
    return apiFetch(`/groups/${groupId}/expenses/${expenseId}`, {
      method: "DELETE",
    });
  },
};

/** ==============================
 *  🚀 DEBTS API (Для получения долгов)
 *  ============================== */
export const debtsApi = {
  async getDebts(groupId: string) {
    return apiFetch<{ _id: string; from: { _id: string; name: string }; to: { _id: string; name: string }; amount: number, currency: string }[]>(
      `/groups/${groupId}/debts`
    );
  },
};


/** ==============================
 *  🚀 SYNC API (Для оффлайн режима)
 *  ============================== */
export const syncApi = {
  async syncOfflineExpenses(expenses: Expense[]) {
    return apiFetch("/sync/expenses", {
      method: "POST",
      body: JSON.stringify({ expenses }),
    });
  },
};
