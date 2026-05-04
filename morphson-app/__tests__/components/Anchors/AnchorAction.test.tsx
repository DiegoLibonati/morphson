import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import AnchorAction from "@/components/Anchors/AnchorAction/AnchorAction";

const renderComponent = (noMark: boolean): RenderResult =>
  render(
    <MemoryRouter>
      <AnchorAction to="/destination" ariaLabel="Go to destination" noMark={noMark}>
        Click here
      </AnchorAction>
    </MemoryRouter>
  );

describe("AnchorAction", () => {
  describe("rendering", () => {
    it("should render the link with children text", () => {
      renderComponent(false);
      expect(screen.getByRole("link", { name: "Go to destination" })).toBeInTheDocument();
      expect(screen.getByText("Click here")).toBeInTheDocument();
    });

    it("should render the mark indicator span by default", () => {
      const { container } = renderComponent(false);
      expect(container.querySelector<HTMLSpanElement>(".span-nomark")).toBeInTheDocument();
    });

    it("should not render the mark indicator span when noMark is true", () => {
      const { container } = renderComponent(true);
      expect(container.querySelector<HTMLSpanElement>(".span-nomark")).not.toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <MemoryRouter>
          <AnchorAction to="/destination" ariaLabel="Go" className="extra-class">
            Go
          </AnchorAction>
        </MemoryRouter>
      );
      expect(screen.getByRole("link", { name: "Go" })).toHaveClass("extra-class");
    });
  });

  describe("navigation", () => {
    it("should have the correct href", () => {
      renderComponent(false);
      expect(screen.getByRole("link", { name: "Go to destination" })).toHaveAttribute(
        "href",
        "/destination"
      );
    });
  });
});
