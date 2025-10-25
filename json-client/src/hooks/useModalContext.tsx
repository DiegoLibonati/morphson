import { useContext } from "react";

import { UseModalContext } from "@src/entities/hooks";

import { ModalContext } from "@src/contexts/ModalContext/ModalContext";

export const useModalContext = (): UseModalContext => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within ModalProvider");
  }
  return context;
};
