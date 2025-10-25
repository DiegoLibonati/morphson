import { ModalReducer as ModalReducerT } from "@src/entities/contexts";
import { ModalState } from "@src/entities/states";

export const initialState: ModalState = {
  modal: {
    message: "",
    open: false,
  },
};

export const ModalReducer = (state: ModalState, action: ModalReducerT) => {
  switch (action.type) {
    case "SET_MODAL":
      return {
        ...state,
        modal: {
          message: action.payload.message,
          open: action.payload.open,
        },
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
};
