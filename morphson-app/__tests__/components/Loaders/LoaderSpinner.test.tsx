import { render } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import LoaderSpinner from "@/components/Loaders/LoaderSpinner/LoaderSpinner";

const renderComponent = (): RenderResult => render(<LoaderSpinner />);

describe("LoaderSpinner", () => {
  describe("rendering", () => {
    it("should render the spinner element", () => {
      const { container } = renderComponent();
      expect(container.querySelector<HTMLDivElement>(".loader")).toBeInTheDocument();
    });

    it("should render inside LoaderRoot overlay", () => {
      const { container } = renderComponent();
      expect(container.firstChild).toHaveClass("absolute");
    });
  });
});
