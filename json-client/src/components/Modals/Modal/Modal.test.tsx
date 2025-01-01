import { screen, render } from "@testing-library/react";

import { Modal } from "./Modal";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const { container } = render(
    <Modal>
      <h2>Cuack</h2>
    </Modal>
  );

  return {
    container: container,
  };
};

test("It must render the root modal.", () => {
  const { container } = renderComponent();

  const modalRoot = container.querySelector(".modal-root") as HTMLDivElement;
  const modalCenter = modalRoot.children[0];

  expect(modalRoot).toBeInTheDocument();
  expect(modalCenter).toBeInTheDocument();
});

test("It must render the content entered by child to the modal.", () => {
  renderComponent();

  const heading = screen.getByRole("heading", { name: /cuack/i });

  expect(heading).toBeInTheDocument();
});
