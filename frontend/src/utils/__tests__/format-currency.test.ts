import { formatCurrency } from "../format-currency";

describe("formatCurrency", () => {
  it("форматирует положительное число", () => {
    expect(formatCurrency(1234.56, 'RUB')).toBe("1\u00A0234,56\u00A0₽");
  });

  it("форматирует 0", () => {
    expect(formatCurrency(0, 'RUB')).toBe("0,00\u00A0₽");
  });

  it("форматирует отрицательное число", () => {
    expect(formatCurrency(-99, 'RUB')).toBe("-99,00\u00A0₽");
  });

  it("округляет до двух знаков", () => {
    expect(formatCurrency(1.999, 'RUB')).toBe("2,00\u00A0₽");
  });
});
