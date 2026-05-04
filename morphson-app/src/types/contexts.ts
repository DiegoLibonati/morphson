import type { EditorState, JSONState, ModalState } from "@/types/states";
import type { EditorReducer, JSONReducer, ModalReducer } from "@/types/reducers";

export interface EditorContext {
  state: EditorState;
  dispatch: React.Dispatch<EditorReducer>;
}

export interface JSONContext {
  state: JSONState;
  dispatch: React.Dispatch<JSONReducer>;
}

export interface ModalContext {
  state: ModalState;
  dispatch: React.Dispatch<ModalReducer>;
}
