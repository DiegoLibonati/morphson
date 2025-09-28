import { Modal } from "@src/entities/entities.d";

export type ModalState = {
  modal: Modal;
};

export type ModalAction = {
  type: "SET_MODAL";
  payload: { message: string; open: boolean };
};

export type ModalContext = {
  modal: Modal;
  handleSetModal: (modal: Modal) => void;
  handleSetModalClose: () => void;
};

export interface ModalProviderProps {
  children: React.ReactNode;
}
