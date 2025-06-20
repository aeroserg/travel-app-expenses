import { render, screen, fireEvent } from "@testing-library/react";
import TelegramLoginButton from "../TelegramLoginButton";

describe("TelegramLoginButton", () => {
  const originalHref = window.location.href;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        ...window.location,
        href: "", // сюда будем писать
      } as Location,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        ...window.location,
        href: originalHref,
      } as Location,
    });
  });

  it("рендерит кнопку с текстом", () => {
    render(<TelegramLoginButton />);
    const button = screen.getByRole("button", { name: /войти через telegram/i });
    expect(button).toBeInTheDocument();
  });

  it("редиректит на Telegram OAuth URL при клике", () => {
    render(<TelegramLoginButton />);
    const button = screen.getByRole("button", { name: /войти через telegram/i });
    fireEvent.click(button);

    const href = window.location.href;
    expect(href).toMatch(/^https:\/\/oauth\.telegram\.org\/auth\?/);
    expect(href).toContain("bot_id=");
    expect(href).toContain("origin=");
    expect(href).toContain("return_to=");
    expect(href).toContain("scope=profile");
    expect(href).toContain("request_access=write");
    expect(href).toContain("nonce=");
  });
});
