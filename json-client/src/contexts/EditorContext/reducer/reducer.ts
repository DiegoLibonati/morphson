import { EditorAction, EditorState } from "@src/entities/editor-context.d";

export const initialState: EditorState = {
  text: "{}",
};

export function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_TEXT":
      const text = action.payload.text;
      return {
        ...state,
        text: text,
      };
    default:
      return state;
  }
}
