import { FaInfoCircle } from "react-icons/fa";

import type { JSX } from "react";

import ButtonSecondary from "@/components/Buttons/ButtonSecondary/ButtonSecondary";
import Modal from "@/components/Modals/Modal/Modal";

import { useModalContext } from "@/hooks/useModalContext";

const ModalAlert = (): JSX.Element => {
  const { state: modalState, dispatch: modalDispatch } = useModalContext();

  const handleSetModalClose = (): void => {
    modalDispatch({
      type: "SET_MODAL",
      payload: { message: "", open: false },
    });
  };

  return (
    <Modal>
      <div className="flex flex-col items-center justify-center gap-2 w-full h-auto">
        <div className=" bg-primary bg-opacity-20 rounded-full p-2">
          <FaInfoCircle fontSize={24} className="fill-secondary"></FaInfoCircle>
        </div>
        <p className="w-full text-center text-secondary text-sm">{modalState.modal.message}</p>
      </div>
      <ButtonSecondary className="self-end" ariaLabel="Close Modal" onClick={handleSetModalClose}>
        Close
      </ButtonSecondary>
    </Modal>
  );
};

export default ModalAlert;
