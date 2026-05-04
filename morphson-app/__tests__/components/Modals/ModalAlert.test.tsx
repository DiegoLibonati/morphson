import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";
import type { ModalContext as ModalContextT } from "@/types/contexts";

import ModalAlert from "@/components/Modals/ModalAlert/ModalAlert";

import { ModalProvider } from "@/contexts/ModalContext/ModalProvider";
import { ModalContext } from "@/contexts/ModalContext/ModalContext";

const mockDispatch = jest.fn();

const renderWithOpenModal = (message = "Something went wrong"): RenderResult => {
  const mockContextValue: ModalContextT = {
    state: { modal: { message, open: true } },
    dispatch: mockDispatch,
  };

  return render(
    <ModalContext.Provider value={mockContextValue}>
      <ModalAlert />
    </ModalContext.Provider>
  );
};

const renderWithProvider = (): RenderResult =>
  render(
    <ModalProvider>
      <ModalAlert />
    </ModalProvider>
  );

describe("ModalAlert", () => {
  describe("rendering", () => {
    it("should render the modal message", () => {
      renderWithOpenModal("An error occurred");
      expect(screen.getByText("An error occurred")).toBeInTheDocument();
    });

    it("should render the Close button", () => {
      renderWithOpenModal();
      expect(screen.getByRole("button", { name: "Close Modal" })).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should dispatch SET_MODAL with open false when Close is clicked", async () => {
      const user = userEvent.setup();
      renderWithOpenModal("Test message");

      await user.click(screen.getByRole("button", { name: "Close Modal" }));

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_MODAL",
        payload: { message: "", open: false },
      });
    });

    it("should render without crashing inside ModalProvider", () => {
      renderWithProvider();
      expect(screen.getByRole("button", { name: "Close Modal" })).toBeInTheDocument();
    });
  });
});
