import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import SelectWithLabel from "@/components/Selects/SelectWithLabel/SelectWithLabel";

const renderComponent = (): RenderResult =>
  render(
    <SelectWithLabel id="my-select" label="Choose option">
      <select id="my-select">
        <option value="a">Option A</option>
      </select>
    </SelectWithLabel>
  );

describe("SelectWithLabel", () => {
  describe("rendering", () => {
    it("should render the label text", () => {
      renderComponent();
      expect(screen.getByText("Choose option")).toBeInTheDocument();
    });

    it("should associate label with select via htmlFor", () => {
      renderComponent();
      expect(screen.getByLabelText("Choose option")).toBeInTheDocument();
    });

    it("should render children", () => {
      renderComponent();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <SelectWithLabel id="my-select" label="Choose option" className="wrapper-class">
          <select id="my-select" />
        </SelectWithLabel>
      );
      expect(container.firstChild).toHaveClass("wrapper-class");
    });
  });
});
