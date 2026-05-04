import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import LoaderRoot from "@/components/Loaders/LoaderRoot/LoaderRoot";

const renderComponent = (): RenderResult =>
  render(
    <LoaderRoot>
      <span>Loading...</span>
    </LoaderRoot>
  );

describe("LoaderRoot", () => {
  describe("rendering", () => {
    it("should render children", () => {
      renderComponent();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <LoaderRoot className="custom-loader">
          <span>Loading...</span>
        </LoaderRoot>
      );
      expect(container.firstChild).toHaveClass("custom-loader");
    });
  });
});
