import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import InputWithLabel from "@/components/Inputs/InputWithLabel/InputWithLabel";

const renderComponent = (): RenderResult =>
  render(
    <InputWithLabel id="my-input" label="My Label">
      <input id="my-input" type="text" />
    </InputWithLabel>
  );

describe("InputWithLabel", () => {
  describe("rendering", () => {
    it("should render the label text", () => {
      renderComponent();
      expect(screen.getByText("My Label")).toBeInTheDocument();
    });

    it("should associate label with input via htmlFor", () => {
      renderComponent();
      expect(screen.getByLabelText("My Label")).toBeInTheDocument();
    });

    it("should render children", () => {
      renderComponent();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <InputWithLabel id="my-input" label="My Label" className="wrapper-class">
          <input id="my-input" type="text" />
        </InputWithLabel>
      );
      expect(container.firstChild).toHaveClass("wrapper-class");
    });
  });
});
