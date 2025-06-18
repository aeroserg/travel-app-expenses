import { render } from "@testing-library/react";
import Loader from "../Loader";

describe("Loader", () => {
  it("рендерится без ошибок", () => {
    const { getByTestId } = render(<Loader />);
    expect(getByTestId("loader")).toBeInTheDocument();
  });
});
