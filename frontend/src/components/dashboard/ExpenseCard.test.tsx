import { render, screen, fireEvent } from "@testing-library/react";
import ExpenseCard from "./ExpenseCard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Мокаем expensesApi
jest.mock("@/services/api", () => ({
  expensesApi: {
    deleteExpense: jest.fn().mockResolvedValue({ message: "OK" }),
  },
}));

describe("ExpenseCard", () => {
  const queryClient = new QueryClient();

  const props = {
    _id: "exp123",
    name: "Обед",
    amount: 500,
    currency: "RUB",
    paidBy: { name: "Юра" },
    groupId: "group456",
  };

beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
  Object.defineProperty(window, "location", {
    value: { reload: jest.fn() },
    writable: true,
  });
});

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ExpenseCard {...props} />
      </QueryClientProvider>
    );

  it("отображает имя, сумму и имя плательщика", () => {
    renderWithProviders();
    expect(screen.getByText("Обед")).toBeInTheDocument();
    expect(
      screen.getByText("Сумма: 500,00 ₽ (оплатил Юра)")
    ).toBeInTheDocument();
  });

  it("вызывает deleteExpense и обновляет страницу при клике на кнопку", async () => {
    renderWithProviders();
    const button = screen.getByRole("button", { name: /удалить/i });
    fireEvent.click(button);

    // Подождем тик цикла
    await new Promise(process.nextTick);

    expect(window.alert).toHaveBeenCalledWith("Трата удалена");
    expect(window.location.reload).toHaveBeenCalled();
  });
});
