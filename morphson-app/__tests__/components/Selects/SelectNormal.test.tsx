import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import SelectNormal from "@/components/Selects/SelectNormal/SelectNormal";
import SelectOption from "@/components/Selects/SelectOption/SelectOption";

const mockOnChange = jest.fn();

const renderComponent = (value = "opt1"): RenderResult =>
  render(
    <SelectNormal
      id="my-select"
      label="Select option"
      name="mySelect"
      value={value}
      onChange={mockOnChange}
    >
      <SelectOption value="opt1">Option 1</SelectOption>
      <SelectOption value="opt2">Option 2</SelectOption>
    </SelectNormal>
  );

describe("SelectNormal", () => {
  describe("rendering", () => {
    it("should render the label", () => {
      renderComponent();
      expect(screen.getByText("Select option")).toBeInTheDocument();
    });

    it("should render the select element", () => {
      renderComponent();
      expect(screen.getByRole("combobox", { name: "Select option" })).toBeInTheDocument();
    });

    it("should render the options", () => {
      renderComponent();
      expect(screen.getByRole("option", { name: "Option 1" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Option 2" })).toBeInTheDocument();
    });

    it("should display the selected value", () => {
      renderComponent("opt1");
      expect(screen.getByRole("combobox", { name: "Select option" })).toHaveValue("opt1");
    });
  });

  describe("behavior", () => {
    it("should call onChange when selection changes", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.selectOptions(screen.getByRole("combobox", { name: "Select option" }), "opt2");
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
