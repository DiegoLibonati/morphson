import { ModalAction, ModalState } from "@src/entities/modal-context.d";

export const initialState: ModalState = {
  modal: {
    message: "",
    open: false,
  },
};

export function reducer(state: ModalState, action: ModalAction): ModalState {
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
      return state;
  }
}
