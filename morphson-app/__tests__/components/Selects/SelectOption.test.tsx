import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import SelectOption from "@/components/Selects/SelectOption/SelectOption";

const renderComponent = (): RenderResult =>
  render(
    <select>
      <SelectOption value="opt1">Option One</SelectOption>
    </select>
  );

describe("SelectOption", () => {
  describe("rendering", () => {
    it("should render the option with text", () => {
      renderComponent();
      expect(screen.getByRole("option", { name: "Option One" })).toBeInTheDocument();
    });

    it("should set the value attribute", () => {
      renderComponent();
      expect(screen.getByRole("option", { name: "Option One" })).toHaveAttribute("value", "opt1");
    });
  });
});
