import React, {
  Reducer,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { Modal } from "@src/entities/entities";
import {
  ModalAction,
  ModalContext as ModalContextT,
  ModalState,
  ModalProviderProps,
} from "@src/entities/modal-context.d";

import {
  initialState,
  reducer,
} from "@src/contexts/ModalContext/reducer/reducer";

export const ModalContext = createContext<ModalContextT | undefined>(undefined);

export const ModalProvider: React.FunctionComponent<ModalProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer<Reducer<ModalState, ModalAction>>(
    reducer,
    initialState
  );

  const handleSetModal = (modal: Modal): void => {
    return dispatch({
      type: "SET_MODAL",
      payload: { message: modal.message, open: modal.open },
    });
  };

  const handleSetModalClose = (): void => {
    return dispatch({
      type: "SET_MODAL",
      payload: { message: "", open: false },
    });
  };

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
        modal: state.modal,
        handleSetModal: handleSetModal,
        handleSetModalClose: handleSetModalClose,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = (): ModalContextT => {
  return useContext(ModalContext)!;
};
