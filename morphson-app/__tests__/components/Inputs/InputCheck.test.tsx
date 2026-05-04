import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import InputCheck from "@/components/Inputs/InputCheck/InputCheck";

const mockOnChange = jest.fn();

const renderComponent = (): RenderResult =>
  render(
    <InputCheck
      id="check-input"
      label="Accept terms"
      name="terms"
      value="accepted"
      onChange={mockOnChange}
    />
  );

describe("InputCheck", () => {
  describe("rendering", () => {
    it("should render the checkbox", () => {
      renderComponent();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("should render the label text", () => {
      renderComponent();
      expect(screen.getByText("Accept terms")).toBeInTheDocument();
    });

    it("should associate label with checkbox via htmlFor", () => {
      renderComponent();
      expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
    });

    it("should set the value on the checkbox", () => {
      renderComponent();
      expect(screen.getByRole("checkbox")).toHaveAttribute("value", "accepted");
    });
  });

  describe("behavior", () => {
    it("should call onChange when clicked", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole("checkbox"));
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });
});
