import { FaInfoCircle } from "react-icons/fa";

import { ButtonSecondary } from "@src/components/Buttons/export";
import { Modal } from "@src/components/Modals/export";

import { useModalContext } from "@src/contexts/export";

export const ModalAlert = (): JSX.Element => {
  const { modal, handleSetModalClose } = useModalContext();

  return (
    <Modal>
      <div className="flex flex-col items-center justify-center gap-2 w-full h-auto">
        <div className=" bg-primary bg-opacity-20 rounded-full p-2">
          <FaInfoCircle fontSize={24} className="fill-secondary"></FaInfoCircle>
        </div>
        <p className="w-full text-center text-secondary text-sm">
          {modal.message}
        </p>
      </div>
      <ButtonSecondary
        className="self-end"
        ariaLabel="Close Modal"
        onClick={handleSetModalClose}
      >
        Close
      </ButtonSecondary>
    </Modal>
  );
};
