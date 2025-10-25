import React, {
  createContext,
  useEffect,
  useReducer,
} from "react";

import { ModalContext as ModalContextT } from "@src/entities/contexts";
import { ModalProviderProps } from "@src/entities/props";

import {
  initialState,
  ModalReducer,
} from "@src/contexts/ModalContext/ModalReducer";

export const ModalContext = createContext<ModalContextT | null>(null);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [state, dispatch] = useReducer(ModalReducer, initialState);

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
