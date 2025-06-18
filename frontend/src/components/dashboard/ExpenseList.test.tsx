import { render, screen, waitFor } from "@testing-library/react";
import ExpenseList from "./ExpenseList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import * as api from "@/services/api";

jest.mock("@/services/api");
jest.mock("../shared/Loader", () => ({
  __esModule: true,
  default: () => <div data-testid="loader" />,
}));

const renderWithProviders = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <ExpenseList groupId="test-group-id" />
      </ChakraProvider>
    </QueryClientProvider>
  );
};

describe("ExpenseList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("показывает лоадер при загрузке", async () => {
    (api.expensesApi.getExpenses as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );
    renderWithProviders();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("показывает сообщение при пустом списке", async () => {
    (api.expensesApi.getExpenses as jest.Mock).mockResolvedValue([]);
    renderWithProviders();
    await waitFor(() => {
      expect(screen.getByText(/нет трат/i)).toBeInTheDocument();
    });
  });

  it("отображает список трат", async () => {
    (api.expensesApi.getExpenses as jest.Mock).mockResolvedValue([
      {
        _id: "1",
        name: "Суши",
        amount: 1000,
        currency: "RUB",
        paidBy: "123",
        debtors: ["456"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Суши")).toBeInTheDocument();
    });
  });
});
