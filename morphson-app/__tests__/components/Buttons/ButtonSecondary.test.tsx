import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import ButtonSecondary from "@/components/Buttons/ButtonSecondary/ButtonSecondary";

const mockOnClick = jest.fn();

const renderComponent = (label = "Click me"): RenderResult =>
  render(
    <ButtonSecondary ariaLabel="test-button" onClick={mockOnClick}>
      {label}
    </ButtonSecondary>
  );

describe("ButtonSecondary", () => {
  describe("rendering", () => {
    it("should render with children text", () => {
      renderComponent("Press me");
      expect(screen.getByRole("button", { name: "test-button" })).toBeInTheDocument();
      expect(screen.getByText("Press me")).toBeInTheDocument();
    });

    it("should have type button", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "test-button" })).toHaveAttribute("type", "button");
    });

    it("should apply custom className", () => {
      render(
        <ButtonSecondary ariaLabel="test-button" onClick={mockOnClick} className="custom-class">
          Click
        </ButtonSecondary>
      );
      expect(screen.getByRole("button", { name: "test-button" })).toHaveClass("custom-class");
    });
  });

  describe("behavior", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole("button", { name: "test-button" }));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });
});
