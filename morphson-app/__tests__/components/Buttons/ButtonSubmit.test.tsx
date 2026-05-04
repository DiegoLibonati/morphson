import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import ButtonSubmit from "@/components/Buttons/ButtonSubmit/ButtonSubmit";

const renderComponent = (disabled = false): RenderResult =>
  render(
    <ButtonSubmit ariaLabel="submit-button" disabled={disabled}>
      Submit
    </ButtonSubmit>
  );

describe("ButtonSubmit", () => {
  describe("rendering", () => {
    it("should render with children text", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "submit-button" })).toBeInTheDocument();
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });

    it("should have type submit", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "submit-button" })).toHaveAttribute(
        "type",
        "submit"
      );
    });

    it("should apply custom className", () => {
      render(
        <ButtonSubmit ariaLabel="submit-button" className="my-class">
          Submit
        </ButtonSubmit>
      );
      expect(screen.getByRole("button", { name: "submit-button" })).toHaveClass("my-class");
    });
  });

  describe("disabled state", () => {
    it("should not be disabled by default when disabled is false", () => {
      renderComponent(false);
      expect(screen.getByRole("button", { name: "submit-button" })).not.toBeDisabled();
    });

    it("should be disabled when disabled prop is true", () => {
      renderComponent(true);
      expect(screen.getByRole("button", { name: "submit-button" })).toBeDisabled();
    });
  });
});
