import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddExpenseModal from "./AddExpenseModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import * as authHook from "@/hooks/useAuth";
import * as api from "@/services/api";
import * as cache from "@/hooks/useCache";
import * as sync from "@/hooks/useSync";

jest.mock("@/hooks/useAuth");
jest.mock("@/services/api");
jest.mock("@/hooks/useCache");
jest.mock("@/hooks/useSync");

const mockGroup = {
  _id: "group-id",
  members: [
    { _id: "1", name: "User 1" },
    { _id: "2", name: "User 2" },
  ],
};

const renderModal = () => {
  (authHook.useAuth as jest.Mock).mockReturnValue({ user: { _id: "123" } });
  (api.groupsApi.getGroup as jest.Mock).mockResolvedValue(mockGroup);
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AddExpenseModal isOpen={true} onClose={jest.fn()} groupId="group-id" />
      </ChakraProvider>
    </QueryClientProvider>
  );
};

describe("AddExpenseModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window.navigator, "onLine", {
      value: true,
      configurable: true,
    });
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, reload: jest.fn() },
    });
  });

  it("отображает заголовок модалки и участников", async () => {
    renderModal();
    expect(screen.getByText(/Добавить трату/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("User 1")).toBeInTheDocument());
  });

  it("кнопка disabled при незаполненных полях", async () => {
    renderModal();
    await waitFor(() => expect(screen.getByText("User 1")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /Добавить/ })).toBeDisabled();
  });

  it("включает кнопку при заполнении всех полей", async () => {
    renderModal();
    await waitFor(() => expect(screen.getByText("User 1")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Название"), {
      target: { value: "Обед" },
    });
    fireEvent.change(screen.getByPlaceholderText("Сумма"), {
      target: { value: "500" },
    });
    fireEvent.click(screen.getByText("User 1"));

    expect(screen.getByRole("button", { name: /Добавить/ })).not.toBeDisabled();
  });

  it("успешно вызывает addExpense при наличии интернета", async () => {
    (api.expensesApi.addExpense as jest.Mock).mockResolvedValue({});

    renderModal();
    await waitFor(() => expect(screen.getByText("User 1")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Название"), {
      target: { value: "Обед" },
    });
    fireEvent.change(screen.getByPlaceholderText("Сумма"), {
      target: { value: "500" },
    });
    fireEvent.click(screen.getByText("User 1"));
    fireEvent.click(screen.getByRole("button", { name: /Добавить/ }));

    await waitFor(() => {
      expect(api.expensesApi.addExpense).toHaveBeenCalledWith(
        "group-id",
        "Обед",
        500,
        "RUB",
        "123",
        ["1"]
      );
    });
  });

  it("сохраняет в кэш при offline", async () => {
    Object.defineProperty(window.navigator, "onLine", {
      value: false,
      configurable: true,
    });
    (cache.saveExpenseToCache as jest.Mock).mockResolvedValue(undefined);
    (sync.registerSync as jest.Mock).mockResolvedValue(undefined);

    renderModal();
    await waitFor(() => expect(screen.getByText("User 2")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Название"), {
      target: { value: "Суши" },
    });
    fireEvent.change(screen.getByPlaceholderText("Сумма"), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("User 2"));
    fireEvent.click(screen.getByRole("button", { name: /Добавить/ }));

    await waitFor(() => {
      expect(cache.saveExpenseToCache).toHaveBeenCalledWith({
        groupId: "group-id",
        name: "Суши",
        amount: 1000,
        currency: "RUB",
        paidBy: "123",
        debtors: ["2"],
      });
      expect(sync.registerSync).toHaveBeenCalled();
    });
  });

  it("бросает ошибку если user отсутствует", async () => {
    (authHook.useAuth as jest.Mock).mockReturnValue({ user: null });
    (api.groupsApi.getGroup as jest.Mock).mockResolvedValue(mockGroup);
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <AddExpenseModal isOpen={true} onClose={jest.fn()} groupId="group-id" />
        </ChakraProvider>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("User 1")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Название"), {
      target: { value: "Чаевые" },
    });
    fireEvent.change(screen.getByPlaceholderText("Сумма"), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByText("User 1"));
    fireEvent.click(screen.getByRole("button", { name: /Добавить/ }));

    await waitFor(() => {
      expect(screen.getByText(/Ошибка аутентификации/i)).toBeInTheDocument();
    });
  });

  it("обрабатывает offline режим и вызывает фоновую синхронизацию", async () => {
    (authHook.useAuth as jest.Mock).mockReturnValue({ user: { _id: "123" } });
    (api.groupsApi.getGroup as jest.Mock).mockResolvedValue(mockGroup);
    (cache.saveExpenseToCache as jest.Mock).mockResolvedValue(undefined);
    (sync.registerSync as jest.Mock).mockResolvedValue(undefined);

    Object.defineProperty(window.navigator, "onLine", {
      value: false,
      configurable: true,
    });

    renderModal();
    await waitFor(() => expect(screen.getByText("User 1")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Название"), {
      target: { value: "Offline трата" },
    });
    fireEvent.change(screen.getByPlaceholderText("Сумма"), {
      target: { value: "777" },
    });
    fireEvent.click(screen.getByText("User 1"));
    fireEvent.click(screen.getByRole("button", { name: /Добавить/ }));

    await waitFor(() => {
      expect(
        screen.getByText(/Трата сохранена и будет отправлена позже/i)
      ).toBeInTheDocument();
    });
  });
});
