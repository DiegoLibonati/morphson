import { useContext } from "react";

import type { UseModalContext } from "@/types/hooks";

import { ModalContext } from "@/contexts/ModalContext/ModalContext";

export const useModalContext = (): UseModalContext => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within ModalProvider");
  }
  return context;
};
