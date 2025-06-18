import { render, screen, fireEvent, waitFor } from "@/utils/testing/test-utils";
import GroupList from "./GroupList";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import * as reactQuery from "@tanstack/react-query";

// Моки
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@chakra-ui/react", () => {
  const ui = jest.requireActual("@chakra-ui/react");
  return { ...ui, useToast: jest.fn() };
});
jest.mock("../../services/api", () => ({
  groupsApi: {
    leaveGroup: jest.fn(() => Promise.resolve()),
    updateGroup: jest.fn(() => Promise.resolve()),
  },
}));
jest.mock("@tanstack/react-query", () => {
  const originalModule = jest.requireActual("@tanstack/react-query");

  return {
    __esModule: true,
    ...originalModule,
    useQueryClient: jest.fn(),
  };
});

describe("GroupList", () => {
  const pushMock = jest.fn();
  const toastMock = jest.fn();
  const invalidateQueriesMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useToast as jest.Mock).mockReturnValue(toastMock);
    (reactQuery.useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });
    pushMock.mockReset();
    toastMock.mockReset();
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        reload: jest.fn(),
      },
      writable: true,
    });
  });

  const groups = [
    {
      _id: "1",
      name: "Друзья",
      code: "XYZ123",
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it("показывает лоадер, если isLoading=true", () => {
    render(<GroupList groups={[]} isLoading={true} />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("показывает сообщение, если нет групп", () => {
    render(<GroupList groups={[]} isLoading={false} />);
    expect(
      screen.getByText("Вы не состоите ни в одной группе.")
    ).toBeInTheDocument();
  });

  it("отображает группу и открывает по клику", () => {
    render(<GroupList groups={groups} isLoading={false} />);
    fireEvent.click(screen.getByRole("button", { name: /открыть/i }));
    expect(pushMock).toHaveBeenCalledWith("/dashboard/group/1");
  });

  it("копирует код и показывает тост", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() },
    });

    render(<GroupList groups={groups} isLoading={false} />);
    fireEvent.click(screen.getByLabelText("Копировать код"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("XYZ123");
    expect(toastMock).toHaveBeenCalled();
  });

  it("открывает и применяет модалку редактирования", async () => {
    render(<GroupList groups={groups} isLoading={false} />);

    fireEvent.click(screen.getByRole("button", { name: /редактировать/i }));

    const input = screen.getByPlaceholderText("Новое название");
    fireEvent.change(input, { target: { value: "Новые друзья" } });

    const saveBtn = screen.getByRole("button", { name: /сохранить/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Название группы обновлено!" })
      );
    });
  });

  it("покидает группу", async () => {
    render(<GroupList groups={groups} isLoading={false} />);

    const leaveBtn = screen.getByLabelText("Покинуть группу");
    fireEvent.click(leaveBtn);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Вы покинули группу." })
      );
    });
  });
});
