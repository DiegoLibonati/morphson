import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import { ModalAlert } from "@src/components/Modals/ModalAlert/ModalAlert";

import { ModalProvider, useModalContext } from "@src/contexts/export";

import { mockModalOpenState } from "@tests/jest.constants";

type RenderComponent = {
  container: HTMLElement;
};

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

jest.mock("@src/contexts/ModalContext/ModalContext", () => ({
  ...jest.requireActual("@src/contexts/ModalContext/ModalContext"),
  useModalContext: jest.fn(),
}));

describe("ModalAlert.tsx", () => {
  describe("General Tests.", () => {
    const mockHandleSetModalClose = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        modal: mockModalOpenState,
        handleSetModalClose: mockHandleSetModalClose,
      });
    });

    test("It must render the message of the modal.", () => {
      renderComponent();

      const message = screen.getByText(mockModalOpenState.message);

      expect(message).toBeInTheDocument();
    });

    test("It should render the close modal button and execute the relevant functions when it is clicked.", async () => {
      renderComponent();

      const btnCloseModal = screen.getByRole("button", {
        name: /close modal/i,
      });

      expect(btnCloseModal).toBeInTheDocument();

      await user.click(btnCloseModal);

      expect(mockHandleSetModalClose).toHaveBeenCalledTimes(1);
    });
  });
});
