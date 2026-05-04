import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import InputField from "@/components/Inputs/InputField/InputField";

const mockOnChange = jest.fn();

const renderComponent = (value = ""): RenderResult =>
  render(
    <InputField
      id="field-input"
      label="JSON Name"
      placeholder="Enter name"
      name="jsonName"
      value={value}
      onChange={mockOnChange}
    />
  );

describe("InputField", () => {
  describe("rendering", () => {
    it("should render the text input", () => {
      renderComponent();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should render the label", () => {
      renderComponent();
      expect(screen.getByText("JSON Name")).toBeInTheDocument();
    });

    it("should associate label with input", () => {
      renderComponent();
      expect(screen.getByLabelText("JSON Name")).toBeInTheDocument();
    });

    it("should display the provided value", () => {
      renderComponent("my-value");
      expect(screen.getByRole("textbox")).toHaveValue("my-value");
    });

    it("should display the placeholder", () => {
      renderComponent();
      expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should call onChange when typing", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.type(screen.getByRole("textbox"), "a");
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
