import { EditorReducer as EditorReducerT } from "@src/entities/contexts";
import { EditorState } from "@src/entities/states";

export const initialState: EditorState = {
  text: "{}",
};

export const EditorReducer = (state: EditorState, action: EditorReducerT) => {
  switch (action.type) {
    case "SET_TEXT":
      const text = action.payload.text;
      return {
        ...state,
        text: text,
      };
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};
