import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import { ModalAlert } from "./ModalAlert";

import { ModalProvider, useModalContext } from "@/src/contexts/export";

import { MOCK_MODAL_OPEN_STATE } from "@/src/tests/constants";

type RenderComponent = {
  container: HTMLElement;
};

const mockHandleSetModalClose = jest.fn();

jest.mock("../../../contexts/ModalContext/ModalContext", () => ({
  ...jest.requireActual("../../../contexts/ModalContext/ModalContext"),
  useModalContext: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  (useModalContext as jest.Mock).mockReturnValue({
    modal: MOCK_MODAL_OPEN_STATE,
    handleSetModalClose: mockHandleSetModalClose,
  });
});

const renderComponent = (): RenderComponent => {
  const { container } = render(
    <ModalProvider>
      <ModalAlert></ModalAlert>
    </ModalProvider>
  );

  return {
    container: container,
  };
};

test("It must render the message of the modal.", () => {
  renderComponent();

  const message = screen.getByText(MOCK_MODAL_OPEN_STATE.message);

  expect(message).toBeInTheDocument();
});

test("It should render the close modal button and execute the relevant functions when it is clicked.", async () => {
  renderComponent();

  const btnCloseModal = screen.getByRole("button", { name: /close modal/i });

  expect(btnCloseModal).toBeInTheDocument();

  await user.click(btnCloseModal);

  expect(mockHandleSetModalClose).toHaveBeenCalledTimes(1);
});
