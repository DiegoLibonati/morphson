import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import AnchorSecondary from "@/components/Anchors/AnchorSecondary/AnchorSecondary";

const renderComponent = (): RenderResult =>
  render(
    <MemoryRouter>
      <AnchorSecondary to="/home" ariaLabel="Go to home">
        Home
      </AnchorSecondary>
    </MemoryRouter>
  );

describe("AnchorSecondary", () => {
  describe("rendering", () => {
    it("should render the link with children text", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to home" })).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <MemoryRouter>
          <AnchorSecondary to="/home" ariaLabel="Go to home" className="extra-class">
            Home
          </AnchorSecondary>
        </MemoryRouter>
      );
      expect(screen.getByRole("link", { name: "Go to home" })).toHaveClass("extra-class");
    });
  });

  describe("navigation", () => {
    it("should have the correct href", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to home" })).toHaveAttribute("href", "/home");
    });
  });
});
