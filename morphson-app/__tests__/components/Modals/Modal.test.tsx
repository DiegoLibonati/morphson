import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import Modal from "@/components/Modals/Modal/Modal";

const renderComponent = (): RenderResult =>
  render(
    <Modal>
      <p>Modal content</p>
    </Modal>
  );

describe("Modal", () => {
  describe("rendering", () => {
    it("should render children", () => {
      renderComponent();
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("should render the overlay backdrop", () => {
      const { container } = renderComponent();
      expect(container.querySelector<HTMLDivElement>(".modal-root")).toBeInTheDocument();
    });
  });
});
