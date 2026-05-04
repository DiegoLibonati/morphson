import type { EditorReducer as EditorReducerT } from "@/types/reducers";
import type { EditorState } from "@/types/states";

export const EditorReducer = (state: EditorState, action: EditorReducerT): EditorState => {
  switch (action.type) {
    default: {
      const text = action.payload.text;
      return {
        ...state,
        text: text,
      };
    }
  }
};
