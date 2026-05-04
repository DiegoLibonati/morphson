import { useReducer } from "react";

import type { JSX } from "react";
import type { EditorProviderProps } from "@/types/props";

import { EditorContext } from "@/contexts/EditorContext/EditorContext";
import { EditorReducer } from "@/contexts/EditorContext/EditorReducer";

export const EditorProvider = ({ children }: EditorProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(EditorReducer, {
    text: "{}",
  });

  return (
    <EditorContext.Provider
      value={{
        state: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
