import { useEffect, useReducer } from "react";

import type { JSX } from "react";
import type { ModalProviderProps } from "@/types/props";

import { ModalContext } from "@/contexts/ModalContext/ModalContext";
import { ModalReducer } from "@/contexts/ModalContext/ModalReducer";

export const ModalProvider = ({ children }: ModalProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(ModalReducer, {
    modal: {
      message: "",
      open: false,
    },
  });

  useEffect(() => {
    if (state.modal.open) {
      document.body.style.overflow = "hidden";
      return;
    }
    document.body.style.overflow = "auto";
  }, [state.modal.open]);

  return (
    <ModalContext.Provider
      value={{
        state: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
