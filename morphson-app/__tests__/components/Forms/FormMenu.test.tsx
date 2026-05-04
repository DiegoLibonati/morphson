import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import FormMenu from "@/components/Forms/FormMenu/FormMenu";

const mockOnSubmit = jest.fn((e: React.SyntheticEvent) => {
  e.preventDefault();
});

const renderComponent = (): RenderResult =>
  render(
    <FormMenu onSubmit={mockOnSubmit}>
      <button type="submit">Submit</button>
    </FormMenu>
  );

describe("FormMenu", () => {
  describe("rendering", () => {
    it("should render children inside a form", () => {
      const { container } = renderComponent();
      expect(container.querySelector("form")).toBeInTheDocument();
    });

    it("should render a submit button", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <FormMenu onSubmit={mockOnSubmit} className="my-form">
          <button type="submit">Submit</button>
        </FormMenu>
      );
      expect(container.firstChild).toHaveClass("my-form");
    });
  });

  describe("behavior", () => {
    it("should call onSubmit when form is submitted", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole("button", { name: "Submit" }));
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
