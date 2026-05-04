import type { ModalReducer as ModalReducerT } from "@/types/reducers";
import type { ModalState } from "@/types/states";

export const ModalReducer = (state: ModalState, action: ModalReducerT): ModalState => {
  switch (action.type) {
    default:
      return {
        ...state,
        modal: {
          message: action.payload.message,
          open: action.payload.open,
        },
      };
  }
};
